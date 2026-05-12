"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { useTemplateContext } from "@/context/TemplateContext";
import { usePremium } from "@/context/PremiumContext";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/lib/utils";
import { ProfileSetupSheet } from "@/components/features/auth/ProfileSetupSheet";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryBar } from "@/components/home/CategoryBar";
import { TemplateGrid } from "@/components/home/TemplateGrid";
import type { Template } from "@/types";

export default function HomeClient() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { selectedCategory, setSelectedCategory } = useTemplateContext();
  const { openPopup, isPremiumUser } = usePremium();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

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
      <HeroSection userName={user?.name ?? null} />

      {/* ── Category Tabs ── */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ── Template Grid ── */}
      <TemplateGrid
        templates={templates}
        fetching={fetching}
        userName={user?.name ?? null}
        userImage={user?.image ?? null}
        onCardClick={handleTemplateClick}
      />

      {/* ── Profile Setup Sheet ── */}
      <ProfileSetupSheet open={showProfileSetup} />
    </div>
  );
}
