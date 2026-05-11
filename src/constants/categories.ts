import type { Category } from "@/types";

export const CATEGORY_ALL = "all";

export const CATEGORIES: Category[] = [
  { id: "all",        slug: CATEGORY_ALL,  label: "All",         icon: "✨", sortOrder: 0 },
  { id: "birthday",   slug: "birthday",    label: "Birthday",    icon: "🎂", sortOrder: 1 },
  { id: "anniversary",slug: "anniversary", label: "Anniversary", icon: "💍", sortOrder: 2 },
  { id: "festival",   slug: "festival",    label: "Festival",    icon: "🎉", sortOrder: 3 },
  { id: "shayari",    slug: "shayari",     label: "Shayari",     icon: "✍️", sortOrder: 4 },
  { id: "joke",       slug: "joke",        label: "Joke",        icon: "😂", sortOrder: 5 },
  { id: "love",       slug: "love",        label: "Love",        icon: "❤️", sortOrder: 6 },
];
