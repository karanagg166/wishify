"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTemplateContext } from "@/context/TemplateContext";
import { usePremium } from "@/context/PremiumContext";
import { CATEGORIES } from "@/constants/categories";
import { ROUTES } from "@/constants/routes";
import { animateCanvasLayers } from "@/lib/anime-effects";
import { getInitials } from "@/lib/utils";
import { ProfileSetupSheet } from "@/components/features/auth/ProfileSetupSheet";
import type { Template } from "@/types";

export default function HomeClient() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { selectedCategory, setSelectedCategory } = useTemplateContext();
  const { openPopup, isPremiumUser } = usePremium();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Show profile setup for new users without a name
  useEffect(() => {
    if (!isLoading && user && !user.name) {
      setShowProfileSetup(true);
    }
  }, [user, isLoading]);

  const fetchTemplates = useCallback(async (category: string) => {
    setFetching(true);
    try {
      const params = category !== "all" ? `?category=${category}` : "";
      const res = await fetch(`/api/templates${params}`);
      const data = await res.json();
      setTemplates(data.templates ?? []);
    } catch {
      setTemplates([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates(selectedCategory);
  }, [selectedCategory, fetchTemplates]);

  // Animate cards into view
  useEffect(() => {
    if (!fetching && gridRef.current) {
      const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>("[data-card]"));
      if (cards.length) animateCanvasLayers(cards);
    }
  }, [fetching, templates]);

  function handleTemplateClick(t: Template) {
    if (t.tier === "PREMIUM" && !isPremiumUser()) {
      openPopup(t);
      return;
    }
    router.push(ROUTES.CARD(t.id));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* ── Sticky Header ── */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 20,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f3f4f6",
          padding: "1rem 1.25rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            <span className="gradient-text">Wishify</span>
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 1 }}>
            Create beautiful greetings ✨
          </p>
        </div>

        {/* Avatar */}
        <motion.div
          whileTap={{ scale: 0.92 }}
          style={{
            width: 40, height: 40, borderRadius: "50%", overflow: "hidden",
            background: "linear-gradient(135deg, #7c3aed, #f97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          {user?.image ? (
            <Image src={user.image} alt={user.name ?? "Avatar"} width={40} height={40} style={{ objectFit: "cover", borderRadius: "50%" }} />
          ) : (
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}>
              {getInitials(user?.name ?? null)}
            </span>
          )}
        </motion.div>
      </header>

      {/* ── Hero Banner ── */}
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
          <div style={{ position: "absolute", top: -30, right: -20, fontSize: 100, opacity: 0.12, userSelect: "none" }}>🎉</div>
          <p style={{ fontSize: "0.8125rem", fontWeight: 500, opacity: 0.85, marginBottom: "0.375rem" }}>
            Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
          </p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.25 }}>
            Create a personalized<br />greeting card today
          </h2>
        </motion.div>
      </section>

      {/* ── Category Tabs ── */}
      <section style={{ padding: "1.25rem 0 0" }}>
        <div
          style={{ display: "flex", gap: "0.5rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", overflowX: "auto" }}
          className="scrollbar-none"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`cat-${cat.slug}`}
              onClick={() => setSelectedCategory(cat.slug)}
              style={{
                flexShrink: 0,
                padding: "0.4rem 0.875rem",
                borderRadius: 99,
                border: "1.5px solid",
                borderColor: selectedCategory === cat.slug ? "#7c3aed" : "#e5e7eb",
                background: selectedCategory === cat.slug ? "#7c3aed" : "#fff",
                color: selectedCategory === cat.slug ? "#fff" : "#374151",
                fontWeight: 500, fontSize: "0.875rem",
                cursor: "pointer", transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Template Grid ── */}
      <section style={{ padding: "1.25rem 1.25rem 5rem" }}>
        <AnimatePresence mode="wait">
          {fetching ? (
            <SkeletonGrid key="skeleton" />
          ) : templates.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "3rem 1rem", color: "#9ca3af" }}
            >
              <p style={{ fontSize: "2.5rem" }}>🖼️</p>
              <p style={{ marginTop: "0.75rem" }}>No templates in this category yet</p>
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
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.875rem",
                }}
              >
                {templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    userName={user?.name ?? null}
                    userImage={user?.image ?? null}
                    onClick={() => handleTemplateClick(t)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Profile Setup Sheet ── */}
      <ProfileSetupSheet open={showProfileSetup} />
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function TemplateCard({
  template,
  userName,
  userImage,
  onClick,
}: {
  template: Template;
  userName: string | null;
  userImage: string | null;
  onClick: () => void;
}) {
  return (
    <motion.div
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
      {/* Template image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
        <Image
          src={template.thumbUrl}
          alt={template.title}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          style={{ objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
        />

        {/* Live overlay — user name */}
        {userName && (
          <div
            style={{
              position: "absolute", bottom: 10, left: 0, right: 0,
              textAlign: "center",
              fontSize: "0.625rem", fontWeight: 600, color: "#1a1a1a",
              textShadow: "0 1px 3px rgba(255,255,255,0.9)",
              padding: "0 6px",
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
            }}
          >
            {userName}
          </div>
        )}

        {/* Lock icon for premium */}
        {template.tier === "PREMIUM" && (
          <div
            style={{
              position: "absolute", top: 6, right: 6,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              borderRadius: "0.375rem", padding: "2px 6px",
              fontSize: "0.6rem", fontWeight: 700, color: "#78350f",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}
          >
            PRO
          </div>
        )}
      </div>

      {/* Card footer */}
      <div style={{ padding: "0.5rem 0.625rem" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {template.title}
        </p>
        <p style={{ fontSize: "0.6875rem", color: "#9ca3af", margin: "1px 0 0" }}>
          {template.category?.icon} {template.category?.label}
        </p>
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
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
            <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: "0.375rem" }} />
            <div className="skeleton" style={{ height: 10, width: "45%" }} />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
