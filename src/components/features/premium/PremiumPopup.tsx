"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePremium } from "@/context/PremiumContext";
import { PREMIUM_PRICE } from "@/constants/config";

export function PremiumPopup() {
  const { isPopupOpen, closePopup } = usePremium();

  return (
    <AnimatePresence>
      {isPopupOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
            }}
          />

          <motion.div
            key="modal"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "#fff",
              borderRadius: "1.5rem 1.5rem 0 0",
              padding: "2rem 1.5rem 2.5rem",
              zIndex: 60,
              maxWidth: 480, margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 1.75rem" }} />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 260 }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 72, height: 72, borderRadius: "1.5rem",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                boxShadow: "0 8px 24px rgb(251 191 36 / 0.35)",
                marginBottom: "1.25rem",
                fontSize: 36,
              }}
            >
              ✨
            </motion.div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
              This is a Premium Template
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Unlock <strong>100+ exclusive templates</strong>, priority support, and more for just{" "}
              <strong style={{ color: "#7c3aed" }}>{PREMIUM_PRICE}</strong>.
            </p>

            {/* Features list */}
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem", textAlign: "left" }}>
              {[
                "✅ 100+ Premium Templates",
                "✅ No watermarks",
                "✅ Early access to new categories",
                "✅ Priority customer support",
              ].map((f) => (
                <li key={f} style={{ padding: "0.375rem 0", fontSize: "0.875rem", color: "#374151" }}>{f}</li>
              ))}
            </ul>

            <button
              id="btn-upgrade-premium"
              className="btn-primary"
              style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
              onClick={() => {
                // TODO: wire up payment flow (Phase 6)
                alert("Payment integration coming soon! 🚀");
                closePopup();
              }}
            >
              Upgrade to Premium — {PREMIUM_PRICE}
            </button>

            <button
              id="btn-dismiss-premium"
              onClick={closePopup}
              style={{
                marginTop: "0.75rem", width: "100%",
                background: "none", border: "none",
                color: "#9ca3af", fontSize: "0.875rem",
                cursor: "pointer", padding: "0.5rem",
              }}
            >
              Maybe later
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
