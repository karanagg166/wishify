"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { animateCanvasLayers } from "@/lib/anime-effects";
import { TemplateCard } from "./TemplateCard";
import { SkeletonGrid } from "./SkeletonGrid";
import type { Template } from "@/types";

interface TemplateGridProps {
  templates: Template[];
  fetching: boolean;
  userName: string | null;
  userImage: string | null;
  onCardClick: (t: Template) => void;
}

export function TemplateGrid({
  templates,
  fetching,
  userName,
  userImage,
  onCardClick,
}: TemplateGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Animate cards into view after render
  useEffect(() => {
    if (!fetching && gridRef.current) {
      const cards = Array.from(
        gridRef.current.querySelectorAll<HTMLElement>("[data-card]")
      );
      if (cards.length) animateCanvasLayers(cards);
    }
  }, [fetching, templates]);

  return (
    <section style={{ padding: "1.25rem 1.25rem 5rem" }}>
      <AnimatePresence mode="wait">
        {fetching ? (
          <SkeletonGrid key="skeleton" />
        ) : templates.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#9ca3af",
            }}
          >
            <p style={{ fontSize: "2.5rem" }}>🖼️</p>
            <p style={{ marginTop: "0.75rem" }}>
              No templates in this category yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
              <div
                ref={gridRef}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                  gap: "1rem",
                }}
              >
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  userName={userName}
                  userImage={userImage}
                  onClick={() => onCardClick(t)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
