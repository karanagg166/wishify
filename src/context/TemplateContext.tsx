"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Template } from "@/types";

interface TemplateContextValue {
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  selectedTemplate: Template | null;
  setSelectedTemplate: (t: Template | null) => void;
}

const TemplateContext = createContext<TemplateContextValue>({
  selectedCategory: "all",
  setSelectedCategory: () => {},
  selectedTemplate: null,
  setSelectedTemplate: () => {},
});

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleCategoryChange = useCallback((slug: string) => {
    setSelectedCategory(slug);
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory: handleCategoryChange,
        selectedTemplate,
        setSelectedTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateContext() {
  return useContext(TemplateContext);
}
