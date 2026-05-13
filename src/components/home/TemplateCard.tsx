"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  userName: string | null;
  userImage: string | null;
  onClick: () => void;
}

export function TemplateCard({ template, userName, userImage, onClick }: TemplateCardProps) {
  const primaryImage = template.thumbUrl || template.imageUrl;
  const fallbackImage = template.imageUrl || template.thumbUrl;
  const [imageSrc, setImageSrc] = useState(primaryImage);

  useEffect(() => {
    setImageSrc(primaryImage);
  }, [primaryImage]);

  return (
    <motion.div
      data-card
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid #e5e7eb",
        background: "#fff",
        position: "relative",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(17,24,39,0.05)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
        <img
          src={imageSrc}
          alt={template.title}
          loading="lazy"
          onError={() => {
            if (imageSrc !== fallbackImage) setImageSrc(fallbackImage);
          }}
          style={{
            display: "block",
            width: "100%",
            minWidth: "100%",
            height: "100%",
            minHeight: "100%",
            objectFit: "cover",
            objectPosition: "center",
            background: "#f3f4f6",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.24), rgba(0,0,0,0) 45%)",
            pointerEvents: "none",
          }}
        />

        {template.tier === "PREMIUM" && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(17,24,39,0.78)",
              borderRadius: "999px",
              padding: "0.25rem 0.5rem",
              fontSize: "0.625rem",
              fontWeight: 600,
              color: "#fef3c7",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              zIndex: 2,
            }}
          >
            PRO
          </div>
        )}

        {userName && (
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(17,24,39,0.72)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "999px",
              padding: "0.2rem 0.45rem 0.2rem 0.2rem",
              zIndex: 1,
            }}
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "#fff",
                }}
              />
            ) : (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#16a34a",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />
            )}
            <span
              style={{
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 600,
                maxWidth: 76,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "0.7rem 0.75rem 0.8rem" }}>
        <p
          style={{
            fontSize: "0.86rem",
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.28,
            minHeight: "2.2em",
          }}
        >
          {template.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#6b7280",
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
              borderRadius: 999,
              padding: "0.18rem 0.45rem",
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <span>{template.category?.icon ?? "✨"}</span>
            <span>{template.category?.label ?? "General"}</span>
          </p>
          {template.tier === "PREMIUM" && (
            <span style={{ fontSize: "0.72rem", color: "#92400e", fontWeight: 600 }}>Premium</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
