"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "motion/react";
import type { Template, OverlayConfig } from "@/types";

interface TemplateCardProps {
  template: Template;
  userName: string | null;
  userImage: string | null;
  onClick: () => void;
}

export function TemplateCard({ template, userName, userImage, onClick }: TemplateCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const initAttempted = useRef(false);

  const overlay: OverlayConfig = (template.overlayConfig as OverlayConfig) ?? {
    nameX: 200, nameY: 420, nameAnchor: "center",
    avatarX: 155, avatarY: 30, avatarSize: 90,
    fontSize: 20, textColor: "#1a1a1a", fontFamily: "Inter, sans-serif",
  };

  // ── IntersectionObserver for lazy canvas initialization ──────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Initialize Fabric.js canvas when card becomes visible ───────────
  const initCanvas = useCallback(async () => {
    if (!canvasRef.current || initAttempted.current) return;
    initAttempted.current = true;

    try {
      const { Canvas, FabricImage, FabricText, Circle } = await import("fabric");

      // Canvas at half the overlay resolution for card preview
      const CANVAS_W = 200;
      const CANVAS_H = 250;
      const SCALE = CANVAS_W / 400; // scale factor from full-size overlay coords

      const canvas = new Canvas(canvasRef.current, {
        width: CANVAS_W,
        height: CANVAS_H,
        selection: false,
        renderOnAddRemove: false,
      });
      fabricRef.current = canvas;

      // 1. Background template image
      const bgImg = await FabricImage.fromURL(template.thumbUrl, {
        crossOrigin: "anonymous",
      });
      bgImg.scaleToWidth(CANVAS_W);
      bgImg.set({ selectable: false, evented: false, left: 0, top: 0 });
      canvas.add(bgImg);
      canvas.sendObjectToBack(bgImg);

      // 2. Avatar circle (if user has an image)
      if (userImage) {
        try {
          const scaledAvatarSize = overlay.avatarSize * SCALE;
          const avatarImg = await FabricImage.fromURL(userImage, {
            crossOrigin: "anonymous",
          });
          avatarImg.scaleToWidth(scaledAvatarSize);
          avatarImg.set({
            left: overlay.avatarX * SCALE,
            top: overlay.avatarY * SCALE,
            clipPath: new Circle({
              radius: scaledAvatarSize / 2,
              originX: "center",
              originY: "center",
            }),
            selectable: false,
            evented: false,
          });
          canvas.add(avatarImg);
        } catch {
          // Avatar loading failed — continue without it
        }
      }

      // 3. User name text
      if (userName) {
        const text = new FabricText(userName, {
          left: overlay.nameX * SCALE,
          top: overlay.nameY * SCALE,
          originX: (overlay.nameAnchor as "center" | "left" | "right") ?? "center",
          originY: "center",
          fontSize: Math.round(overlay.fontSize * SCALE),
          fill: overlay.textColor,
          fontFamily: overlay.fontFamily ?? "Inter, sans-serif",
          fontWeight: "700",
          selectable: false,
          evented: false,
        });
        canvas.add(text);
      }

      canvas.renderAll();
      setCanvasReady(true);
    } catch (err) {
      console.warn("[TemplateCard] Canvas init failed:", err);
      // Fallback: card will show without canvas overlay
    }
  }, [template.thumbUrl, userName, userImage, overlay]);

  useEffect(() => {
    if (isVisible) {
      initCanvas();
    }
    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, [isVisible, initCanvas]);

  return (
    <motion.div
      ref={containerRef}
      data-card
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid #f3f4f6",
        background: "#f9fafb",
        position: "relative",
      }}
    >
      {/* Canvas preview area */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
        {/* Fabric canvas — lazy loaded */}
        <canvas
          ref={canvasRef}
          style={{
            display: isVisible ? "block" : "none",
            width: "100%",
            height: "100%",
            borderRadius: "1rem 1rem 0 0",
          }}
        />

        {/* Skeleton placeholder while canvas loads */}
        {!canvasReady && (
          <div
            className="skeleton"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "1rem 1rem 0 0",
            }}
          />
        )}

        {/* PRO badge for premium templates */}
        {template.tier === "PREMIUM" && (
          <div
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              borderRadius: "0.375rem",
              padding: "2px 6px",
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "#78350f",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              zIndex: 2,
            }}
          >
            PRO
          </div>
        )}

        {/* Lock overlay for premium templates */}
        {template.tier === "PREMIUM" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              borderRadius: "1rem 1rem 0 0",
            }}
          >
            <span style={{ fontSize: "1.5rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
              🔒
            </span>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div style={{ padding: "0.5rem 0.625rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {template.title}
        </p>
        <p style={{ fontSize: "0.6875rem", color: "#9ca3af", margin: "1px 0 0" }}>
          {template.category?.icon} {template.category?.label}
        </p>
      </div>
    </motion.div>
  );
}
