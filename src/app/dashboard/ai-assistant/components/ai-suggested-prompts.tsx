// src/app/dashboard/ai-assistant/components/ai-suggested-prompts.tsx
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AiPromptCategory } from "@/types/ai";
import { MOCK_AI_SUGGESTED_PROMPTS } from "@/data/mock-ai";
import { AiTopicFilters } from "./ai-topic-filters";

interface AiSuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function AiSuggestedPrompts({ onSelectPrompt }: AiSuggestedPromptsProps) {
  const [category, setCategory] = useState<AiPromptCategory | "all">("all");

  const filteredPrompts = MOCK_AI_SUGGESTED_PROMPTS.filter(
    (p) => category === "all" || p.category === category
  );

  return (
    <div className="bg-card/50 border border-border rounded-xl p-4 h-full">
      <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3>Gợi ý câu hỏi</h3>
      </div>

      <AiTopicFilters selectedCategory={category} onSelectCategory={setCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {filteredPrompts.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPrompt(p.prompt)}
            className="text-left p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm transition-all"
          >
            <div className="text-xs font-semibold text-primary mb-1">{p.label}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">{p.prompt}</div>
          </button>
        ))}
      </div>
      
      {filteredPrompts.length === 0 && (
        <div className="text-sm text-muted-foreground italic py-4 text-center">
          Không có câu hỏi gợi ý cho chủ đề này.
        </div>
      )}
    </div>
  );
}
