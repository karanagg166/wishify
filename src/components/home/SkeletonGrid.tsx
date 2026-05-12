"use client";

import { motion } from "motion/react";

export function SkeletonGrid() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ borderRadius: "1rem", overflow: "hidden" }}>
          <div className="skeleton" style={{ width: "100%", aspectRatio: "4/5" }} />
          <div style={{ padding: "0.5rem 0" }}>
            <div
              className="skeleton"
              style={{ height: 12, width: "70%", marginBottom: "0.375rem", borderRadius: 4 }}
            />
            <div
              className="skeleton"
              style={{ height: 10, width: "45%", borderRadius: 4 }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
