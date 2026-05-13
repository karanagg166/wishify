"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ShareSheet } from "@/components/share/ShareSheet";
import type { Template } from "@/types";

interface CardEditorClientProps {
  template: Template;
}

export function CardEditorClient({ template }: CardEditorClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [previewReady, setPreviewReady] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

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
            aspectRatio: "4 / 5",
            background: "#f3f4f6",
          }}
        >
          {!previewReady && (
            <div
              className="skeleton"
              style={{ width: "100%", aspectRatio: "4/5", position: "absolute", inset: 0 }}
            />
          )}
          <Image
            src={template.imageUrl}
            alt={template.title}
            fill
            sizes="(max-width: 640px) 92vw, 400px"
            style={{ objectFit: "cover" }}
            onLoad={() => setPreviewReady(true)}
            priority
          />

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 28,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 700,
              padding: "0 3.5rem",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name ?? "Your Name"}
            </span>
          </div>

          {user?.image && (
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 18,
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: "4px solid #16a34a",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <Image
                src={user.image}
                alt="You"
                fill
                sizes="50px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
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
        <motion.button
          id="btn-share"
          onClick={() => setShareOpen(true)}
          className="btn-primary"
          style={{ width: "100%", padding: "1rem" }}
          whileTap={{ scale: 0.97 }}
        >
          🚀 Share this Wish
        </motion.button>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
          {[
            { label: "WhatsApp", icon: "💬" },
            { label: "Instagram", icon: "📸" },
            { label: "Email", icon: "✉️" },
            { label: "Download", icon: "⬇️" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              id={`btn-share-${label.toLowerCase()}`}
              onClick={() => setShareOpen(true)}
              style={{
                background: "none", border: "1.5px solid #e5e7eb",
                borderRadius: 99, padding: "0.4rem 0.875rem",
                fontSize: "0.75rem", fontWeight: 500, color: "#374151",
                cursor: "pointer",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Share Sheet ── */}
      <ShareSheet
        open={shareOpen}
        template={template}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
