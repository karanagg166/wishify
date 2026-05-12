"use client";

import { motion } from "motion/react";

interface HeroSectionProps {
  userName: string | null;
}

export function HeroSection({ userName }: HeroSectionProps) {
  const firstName = userName?.split(" ")[0] ?? "there";

  return (
    <section style={{ padding: "1.75rem 1.25rem 0" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: "1.25rem",
          background: "linear-gradient(135deg, #7c3aed 0%, #f97316 100%)",
          padding: "1.75rem 1.5rem",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -20,
            fontSize: 100,
            opacity: 0.12,
            userSelect: "none",
          }}
        >
          🎉
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            opacity: 0.85,
            marginBottom: "0.375rem",
          }}
        >
          Welcome back, {firstName} 👋
        </p>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.25,
          }}
        >
          Create a personalized
          <br />
          greeting card today
        </h2>
      </motion.div>
    </section>
  );
}
