"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePremium } from "@/context/PremiumContext";
import { particleBurst } from "@/lib/anime-effects";
import { ROUTES } from "@/constants/routes";
import type { Template, OverlayConfig } from "@/types";

interface CardEditorClientProps {
  template: Template;
}

type ShareStatus = "idle" | "rendering" | "sharing" | "done";

export function CardEditorClient({ template }: CardEditorClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isPremiumUser } = usePremium();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<InstanceType<typeof import("fabric").Canvas> | null>(null);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<ShareStatus>("idle");
  const [canvasReady, setCanvasReady] = useState(false);

  const overlay: OverlayConfig = template.overlayConfig as OverlayConfig ?? {
    nameX: 200, nameY: 420, nameAnchor: "center",
    avatarX: 155, avatarY: 30, avatarSize: 90,
    fontSize: 20, textColor: "#1a1a1a", fontFamily: "Inter, sans-serif",
  };

  // ── Initialize Fabric.js canvas ──────────────────────────────────────────
  const initCanvas = useCallback(async () => {
    if (!canvasRef.current) return;

    const { Canvas, FabricImage, FabricText } = await import("fabric");

    // Tear down any existing canvas
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }

    const canvas = new Canvas(canvasRef.current, {
      width: 400,
      height: 500,
      selection: false,
      renderOnAddRemove: true,
    });
    fabricRef.current = canvas;

    // 1. Background template image
    const bgImg = await FabricImage.fromURL(template.imageUrl, {
      crossOrigin: "anonymous",
    });
    bgImg.scaleToWidth(400);
    bgImg.set({ selectable: false, evented: false, left: 0, top: 0 });
    canvas.add(bgImg);
    canvas.sendObjectToBack(bgImg);

    // 2. Avatar circle (if user has an image)
    if (user?.image) {
      const avatarImg = await FabricImage.fromURL(user.image, { crossOrigin: "anonymous" });
      avatarImg.scaleToWidth(overlay.avatarSize);
      avatarImg.set({
        left: overlay.avatarX,
        top: overlay.avatarY,
        clipPath: new (await import("fabric")).Circle({
          radius: overlay.avatarSize / 2,
          originX: "center",
          originY: "center",
        }),
        selectable: false,
        evented: false,
      });
      canvas.add(avatarImg);
    }

    // 3. User name text
    const name = user?.name ?? "Your Name";
    const text = new FabricText(name, {
      left: overlay.nameX,
      top: overlay.nameY,
      originX: overlay.nameAnchor as "center" | "left" | "right",
      originY: "center",
      fontSize: overlay.fontSize,
      fill: overlay.textColor,
      fontFamily: overlay.fontFamily,
      fontWeight: "700",
      selectable: false,
      evented: false,
    });
    canvas.add(text);

    canvas.renderAll();
    setCanvasReady(true);
  }, [template, user, overlay]);

  useEffect(() => {
    initCanvas();
    return () => { fabricRef.current?.dispose(); };
  }, [initCanvas]);

  // ── Share handler ────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!fabricRef.current || status !== "idle") return;
    setStatus("rendering");

    try {
      const canvas = fabricRef.current;
      const dataUrl = canvas.toDataURL({ format: "jpeg", quality: 0.92, multiplier: 2 });

      // Save to DB as a Share record
      setStatus("sharing");
      await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, imageData: dataUrl }),
      });

      // Native share API
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "wishify-card.jpg", { type: "image/jpeg" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${user?.name ?? "My"} Wishify Greeting`,
          files: [file],
        });
      } else {
        // Fallback — trigger download
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "wishify-card.jpg";
        a.click();
      }

      setStatus("done");
      if (shareBtnRef.current?.parentElement) {
        particleBurst(shareBtnRef.current.parentElement as HTMLElement);
      }
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("[share]", err);
      setStatus("idle");
    }
  }, [status, template.id, user]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      {/* ── Top Bar ── */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f3f4f6",
          padding: "0.875rem 1.25rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}
      >
        <button
          id="btn-back"
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: "0.25rem" }}
        >
          ← Back
        </button>
        <h1 style={{ flex: 1, fontSize: "1rem", fontWeight: 700, margin: 0 }}>
          {template.title}
        </h1>
        {template.tier === "PREMIUM" && (
          <span className="badge-premium">PRO</span>
        )}
      </header>

      {/* ── Canvas ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 1.25rem" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            borderRadius: "1.25rem",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
            maxWidth: 400,
            width: "100%",
          }}
        >
          {!canvasReady && (
            <div
              className="skeleton"
              style={{ width: "100%", aspectRatio: "4/5", position: "absolute", inset: 0 }}
            />
          )}
          <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%" }} />
        </motion.div>

        {/* ── User info strip ── */}
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {user?.image && (
            <Image
              src={user.image}
              alt="You"
              width={28}
              height={28}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
            Showing your photo &amp; name on the card
          </span>
        </div>
      </div>

      {/* ── Share CTA ── */}
      <div
        style={{
          position: "sticky", bottom: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #f3f4f6",
          padding: "1rem 1.25rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "0.625rem",
        }}
      >
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div
              key="done"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center", color: "#16a34a", fontWeight: 600, padding: "0.75rem" }}
            >
              🎉 Shared successfully!
            </motion.div>
          ) : (
            <motion.button
              key="share"
              ref={shareBtnRef}
              id="btn-share"
              onClick={handleShare}
              disabled={status !== "idle"}
              className="btn-primary"
              style={{ width: "100%", padding: "1rem" }}
              whileTap={{ scale: 0.97 }}
            >
              {status === "idle" && "🚀 Share this Wish"}
              {status === "rendering" && "⚙️ Generating…"}
              {status === "sharing" && "📤 Sharing…"}
            </motion.button>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          {["WhatsApp", "Instagram", "Download"].map((s) => (
            <button
              key={s}
              id={`btn-share-${s.toLowerCase()}`}
              onClick={handleShare}
              style={{
                background: "none", border: "1.5px solid #e5e7eb",
                borderRadius: 99, padding: "0.4rem 0.875rem",
                fontSize: "0.75rem", fontWeight: 500, color: "#374151",
                cursor: "pointer",
              }}
            >
              {s === "WhatsApp" ? "💬" : s === "Instagram" ? "📸" : "⬇️"} {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
