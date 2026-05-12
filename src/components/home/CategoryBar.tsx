"use client";

import { CATEGORIES } from "@/constants/categories";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <section style={{ padding: "1.25rem 0 0" }}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          overflowX: "auto",
        }}
        className="scrollbar-none"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`cat-${cat.slug}`}
            onClick={() => onSelectCategory(cat.slug)}
            style={{
              flexShrink: 0,
              padding: "0.4rem 0.875rem",
              borderRadius: 99,
              border: "1.5px solid",
              borderColor: selectedCategory === cat.slug ? "#7c3aed" : "#e5e7eb",
              background: selectedCategory === cat.slug ? "#7c3aed" : "#fff",
              color: selectedCategory === cat.slug ? "#fff" : "#374151",
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
