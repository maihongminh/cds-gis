// src/app/dashboard/ai-assistant/components/ai-topic-filters.tsx
"use client";

import { cn } from "@/lib/utils";
import { AiPromptCategory } from "@/types/ai";

interface AiTopicFiltersProps {
  selectedCategory: AiPromptCategory | "all";
  onSelectCategory: (category: AiPromptCategory | "all") => void;
}

export function AiTopicFilters({ selectedCategory, onSelectCategory }: AiTopicFiltersProps) {
  const filters: { value: AiPromptCategory | "all"; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "budget", label: "Kinh tế - Ngân sách" },
    { value: "administration", label: "Hành chính công" },
    { value: "agriculture", label: "Nông nghiệp - Môi trường" },
    { value: "emergency", label: "Thiên tai - Khẩn cấp" },
    { value: "tasks", label: "Nhiệm vụ điều hành" },
    { value: "dataQuality", label: "Chất lượng dữ liệu" },
    { value: "socioEconomic", label: "Kế hoạch KT-XH" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onSelectCategory(f.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full transition-colors border",
            selectedCategory === f.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
