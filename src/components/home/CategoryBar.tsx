"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { CATEGORIES } from "@/constants/categories";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

const VISIBLE_COUNT = 4; // Show first N categories before "More"

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const [showMore, setShowMore] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 180 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const visibleCategories = CATEGORIES.slice(0, VISIBLE_COUNT);
  const overflowCategories = CATEGORIES.slice(VISIBLE_COUNT);
  const isOverflowSelected = overflowCategories.some((c) => c.slug === selectedCategory);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function updateMenuPosition() {
      const rect = dropdownButtonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuWidth = Math.max(rect.width, 180);
      const maxLeft = window.innerWidth - menuWidth - 12;
      setMenuPosition({
        top: rect.bottom + 8,
        left: Math.max(12, Math.min(rect.left, maxLeft)),
        width: menuWidth,
      });
    }

    if (!showMore) return;

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [showMore]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(target)
      ) {
        setShowMore(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowMore(false);
    }
    if (showMore) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showMore]);

  const chipBaseStyle: CSSProperties = {
    flexShrink: 0,
    height: "2.5rem",
    padding: "0 1rem",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    fontWeight: 600,
    fontSize: "0.925rem",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
  };

  return (
    <section style={{ padding: "1.25rem 0 0" }}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          overflowX: "auto",
          flexWrap: "nowrap",
          alignItems: "center",
        }}
        className="scrollbar-none"
      >
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            id={`cat-${cat.slug}`}
            onClick={() => onSelectCategory(cat.slug)}
            style={{
              ...chipBaseStyle,
              borderColor: selectedCategory === cat.slug ? "#16a34a" : "#e5e7eb",
              background: selectedCategory === cat.slug ? "#16a34a" : "#fff",
              color: selectedCategory === cat.slug ? "#fff" : "#374151",
            }}
          >
            {cat.label}
          </button>
        ))}

        {/* More dropdown */}
        {overflowCategories.length > 0 && (
          <div style={{ position: "relative" }}>
            <button
              id="cat-more-toggle"
              ref={dropdownButtonRef}
              onClick={() => setShowMore((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showMore}
              style={{
                ...chipBaseStyle,
                background: isOverflowSelected ? "#16a34a" : "#fff",
                color: isOverflowSelected ? "#fff" : "#374151",
              }}
            >
              More
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transform: showMore ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {mounted &&
        showMore &&
        createPortal(
          <div
            ref={dropdownRef}
            role="menu"
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              background: "#fff",
              borderRadius: "0.875rem",
              boxShadow: "0 12px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #f3f4f6",
              padding: "0.375rem",
              zIndex: 999,
              maxHeight: "min(280px, calc(100vh - 24px))",
              overflowY: "auto",
            }}
          >
            {overflowCategories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-${cat.slug}`}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  setShowMore(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "0.625rem",
                  border: "none",
                  background: selectedCategory === cat.slug ? "#f0fdf4" : "transparent",
                  color: selectedCategory === cat.slug ? "#16a34a" : "#374151",
                  fontWeight: selectedCategory === cat.slug ? 600 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* Trending for Today section label */}
      <div
        style={{
          padding: "1.25rem 1.25rem 0",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
        }}
      >
        <span style={{ fontSize: "1.125rem" }}>🔥</span>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Trending for Today
        </h2>
      </div>
    </section>
  );
}
