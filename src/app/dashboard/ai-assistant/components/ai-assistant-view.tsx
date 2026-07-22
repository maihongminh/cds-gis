// src/app/dashboard/ai-assistant/components/ai-assistant-view.tsx
"use client";

import { useState } from "react";
import { AiChatPanel } from "./ai-chat-panel";
import { AiSuggestedPrompts } from "./ai-suggested-prompts";
import { AiDemoDisclaimer } from "./ai-demo-disclaimer";

export function AiAssistantView() {
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>();

  const handleSelectPrompt = (prompt: string) => {
    setInitialPrompt(prompt);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Cột trái: Chat workspace (8/12) */}
      <div className="w-full lg:w-8/12 flex flex-col h-full">
        <AiChatPanel initialMessage={initialPrompt} onClear={() => setInitialPrompt(undefined)} />
      </div>

      {/* Cột phải: Suggested Prompts & History (4/12) */}
      <div className="w-full lg:w-4/12 flex flex-col">
        <div className="sticky top-6 space-y-6">
          <AiSuggestedPrompts onSelectPrompt={handleSelectPrompt} />
          <AiDemoDisclaimer />
        </div>
      </div>
    </div>
  );
}
