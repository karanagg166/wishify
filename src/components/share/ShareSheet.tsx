"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { particleBurst } from "@/lib/anime-effects";
import type { Template, OverlayConfig } from "@/types";

type ShareStatus = "idle" | "rendering" | "sharing" | "done";

interface ShareSheetProps {
  open: boolean;
  template: Template | null;
  onClose: () => void;
}

export function ShareSheet({ open, template, onClose }: ShareSheetProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<ShareStatus>("idle");
  const sheetRef = useRef<HTMLDivElement>(null);

  const renderAndGetBlob = useCallback(async (): Promise<Blob | null> => {
    if (!template) return null;

    try {
      const { Canvas, FabricImage, FabricText, Circle } = await import("fabric");
      const overlay: OverlayConfig = (template.overlayConfig as OverlayConfig) ?? {
        nameX: 200, nameY: 420, nameAnchor: "center",
        avatarX: 155, avatarY: 30, avatarSize: 90,
        fontSize: 20, textColor: "#1a1a1a", fontFamily: "Inter, sans-serif",
      };

      // Create off-screen canvas at 2x resolution
      const offscreen = document.createElement("canvas");
      offscreen.width = 800;
      offscreen.height = 1000;
      offscreen.style.display = "none";
      document.body.appendChild(offscreen);

      const canvas = new Canvas(offscreen, {
        width: 800,
        height: 1000,
        selection: false,
      });

      // Background
      const bgImg = await FabricImage.fromURL(template.imageUrl, {
        crossOrigin: "anonymous",
      });
      bgImg.scaleToWidth(800);
      bgImg.set({ selectable: false, evented: false, left: 0, top: 0 });
      canvas.add(bgImg);
      canvas.sendObjectToBack(bgImg);

      // Avatar
      if (user?.image) {
        try {
          const scaledSize = overlay.avatarSize * 2;
          const avatarImg = await FabricImage.fromURL(user.image, {
            crossOrigin: "anonymous",
          });
          avatarImg.scaleToWidth(scaledSize);
          avatarImg.set({
            left: overlay.avatarX * 2,
            top: overlay.avatarY * 2,
            clipPath: new Circle({
              radius: scaledSize / 2,
              originX: "center",
              originY: "center",
            }),
            selectable: false,
            evented: false,
          });
          canvas.add(avatarImg);
        } catch {
          // Avatar load failed
        }
      }

      // Name
      const name = user?.name ?? "Your Name";
      const text = new FabricText(name, {
        left: overlay.nameX * 2,
        top: overlay.nameY * 2,
        originX: (overlay.nameAnchor as "center" | "left" | "right") ?? "center",
        originY: "center",
        fontSize: overlay.fontSize * 2,
        fill: overlay.textColor,
        fontFamily: overlay.fontFamily ?? "Inter, sans-serif",
        fontWeight: "700",
        selectable: false,
        evented: false,
      });
      canvas.add(text);
      canvas.renderAll();

      const dataUrl = canvas.toDataURL({ multiplier: 1, format: "jpeg", quality: 0.92 });
      canvas.dispose();
      offscreen.remove();

      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (err) {
      console.error("[ShareSheet] render error:", err);
      return null;
    }
  }, [template, user]);

  const handleShare = useCallback(async () => {
    if (status !== "idle" || !template) return;
    setStatus("rendering");

    const blob = await renderAndGetBlob();
    if (!blob) {
      setStatus("idle");
      return;
    }

    setStatus("sharing");
    try {
      // Save share record
      await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      }).catch(() => {}); // Non-blocking

      const file = new File([blob], "wishify-card.jpg", { type: "image/jpeg" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${user?.name ?? "My"} Wishify Greeting`,
          files: [file],
        });
      } else {
        // Fallback download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wishify-card.jpg";
        a.click();
        URL.revokeObjectURL(url);
      }

      setStatus("done");
      if (sheetRef.current) {
        particleBurst(sheetRef.current);
      }
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2500);
    } catch (err) {
      console.error("[ShareSheet] share error:", err);
      setStatus("idle");
    }
  }, [status, template, user, renderAndGetBlob, onClose]);

  const handleWhatsApp = useCallback(async () => {
    if (!template) return;
    setStatus("rendering");
    const blob = await renderAndGetBlob();
    setStatus("idle");

    if (blob) {
      const file = new File([blob], "wishify-card.jpg", { type: "image/jpeg" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
    }
    // Fallback: open WhatsApp with text
    window.open(
      `https://wa.me/?text=${encodeURIComponent("Check out my Wishify greeting! 🎉")}`,
      "_blank"
    );
  }, [template, renderAndGetBlob]);

  const handleDownload = useCallback(async () => {
    if (!template) return;
    setStatus("rendering");
    const blob = await renderAndGetBlob();
    setStatus("idle");

    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wishify-${template.title.toLowerCase().replace(/\s/g, "-")}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [template, renderAndGetBlob]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard not available
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 50,
            }}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#fff",
              borderRadius: "1.25rem 1.25rem 0 0",
              padding: "1.25rem 1.25rem 2rem",
              zIndex: 51,
              maxHeight: "60vh",
              overflow: "auto",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "#d1d5db",
                margin: "0 auto 1rem",
              }}
            />

            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Share Your Greeting
            </h3>

            {/* Primary CTA */}
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    textAlign: "center",
                    color: "#16a34a",
                    fontWeight: 600,
                    padding: "0.875rem",
                    fontSize: "1rem",
                  }}
                >
                  🎉 Shared successfully!
                </motion.div>
              ) : (
                <motion.button
                  key="share-btn"
                  id="btn-share-primary"
                  onClick={handleShare}
                  disabled={status !== "idle"}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    marginBottom: "0.875rem",
                    fontSize: "1rem",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {status === "idle" && "🚀 Share this Wish"}
                  {status === "rendering" && "⚙️ Generating…"}
                  {status === "sharing" && "📤 Sharing…"}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Secondary actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "WhatsApp", icon: "💬", action: handleWhatsApp },
                { label: "Download", icon: "⬇️", action: handleDownload },
                { label: "Copy Link", icon: "🔗", action: handleCopyLink },
              ].map(({ label, icon, action }) => (
                <button
                  key={label}
                  id={`btn-share-${label.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={action}
                  disabled={status !== "idle" && status !== "done"}
                  style={{
                    background: "none",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 99,
                    padding: "0.4rem 0.875rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
