// src/app/dashboard/ai-assistant/components/ai-chat-panel.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, RefreshCcw, Bot } from "lucide-react";
import { AiChatMessage, AiMockResponse } from "@/types/ai";
import { computeAiResponse } from "@/lib/ai/mock-ai-engine";
import { AiResponseCard } from "./ai-response-card";

interface AiChatPanelProps {
  initialMessage?: string;
  onClear: () => void;
}

type MessageItem =
  | { type: "user"; content: string; id: string }
  | { type: "assistant"; response: AiMockResponse; id: string }
  | { type: "error"; content: string; id: string };

export function AiChatPanel({ initialMessage, onClear }: AiChatPanelProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: MessageItem = { type: "user", content: text.trim(), id: `u-${Date.now()}` };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await computeAiResponse(text.trim());
      setMessages((prev) => [...prev, { type: "assistant", response, id: response.id }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "error", content: "Có lỗi xảy ra khi kết nối mô phỏng. Vui lòng thử lại.", id: `e-${Date.now()}` }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-card-foreground text-sm">Trợ lý AI dữ liệu Lao Bảo</h2>
            <p className="text-xs text-muted-foreground">Demo Mode</p>
          </div>
        </div>
        <button
          onClick={() => { setMessages([]); onClear(); }}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-background px-2 py-1 rounded border border-border transition-colors"
        >
          <RefreshCcw size={14} /> Xóa hội thoại
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Bot size={32} className="text-muted-foreground/50" />
            </div>
            <p className="text-sm">Hãy chọn câu hỏi gợi ý bên phải hoặc nhập câu hỏi của bạn.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              {msg.type === "user" ? (
                <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] text-sm shadow-sm">
                  {msg.content}
                </div>
              ) : msg.type === "assistant" ? (
                <div className="w-full max-w-[90%]">
                  <AiResponseCard response={msg.response} />
                </div>
              ) : (
                <div className="bg-destructive/10 text-destructive px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] text-sm border border-destructive/20">
                  {msg.content}
                </div>
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                }
              }}
              placeholder="Nhập câu hỏi bằng ngôn ngữ tự nhiên..."
              className="block w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-12 max-h-32"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-slate-400">Kết quả do AI mô phỏng tạo ra có thể chưa chính xác. Chỉ phục vụ demo.</span>
        </div>
      </div>
    </div>
  );
}
