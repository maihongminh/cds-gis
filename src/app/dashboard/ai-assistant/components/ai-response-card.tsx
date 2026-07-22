// src/app/dashboard/ai-assistant/components/ai-response-card.tsx
"use client";

import { AiMockResponse, AiResponseSection } from "@/types/ai";
import { Info, AlertTriangle, Lightbulb, Link as LinkIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AiResponseCardProps {
  response: AiMockResponse;
}

export function AiResponseCard({ response }: AiResponseCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-card-foreground">{response.title}</h3>
        {response.isDemo && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-primary/10 text-primary rounded-md">
            AI Demo
          </span>
        )}
      </div>

      <div className="p-4 space-y-5">
        {response.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>

      {response.relatedRoutes && response.relatedRoutes.length > 0 && (
        <div className="bg-muted/30 px-4 py-3 border-t border-border text-sm flex gap-2 items-center text-muted-foreground">
          <LinkIcon className="w-4 h-4" />
          <span>Liên kết liên quan:</span>
          <div className="flex gap-2 flex-wrap">
            {response.relatedRoutes.map((route, i) => (
              <Link key={i} href={route} className="text-primary hover:underline">
                {route}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRenderer({ section }: { section: AiResponseSection }) {
  switch (section.type) {
    case "summary":
      return (
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{section.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );
    case "metrics":
      return (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">{section.title}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {section.metrics?.map((m) => (
              <div key={m.id} className="bg-muted/20 border border-border/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                <div className="flex items-end gap-1">
                  <span className="text-lg font-bold text-foreground">{m.formattedValue}</span>
                  <span className="text-xs text-muted-foreground font-medium pb-1">{m.unit}</span>
                </div>
                {m.trendDirection && (
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-xs font-medium",
                    m.trendDirection === "up" ? "text-emerald-500" :
                    m.trendDirection === "down" ? "text-destructive" : "text-amber-500"
                  )}>
                    {m.trendDirection === "up" && <TrendingUp className="w-3 h-3" />}
                    {m.trendDirection === "down" && <TrendingDown className="w-3 h-3" />}
                    {m.trendDirection === "stable" && <Minus className="w-3 h-3" />}
                    {m.trendValue && <span>{m.trendValue}%</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case "analysis":
      return (
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <h4 className="text-sm font-semibold text-primary mb-1">{section.title}</h4>
          <p className="text-sm text-primary/80">{section.content}</p>
        </div>
      );
    case "risk":
      return (
        <div className="flex gap-3 bg-destructive/5 p-3 rounded-lg border border-destructive/20">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-destructive mb-1">{section.title}</h4>
            <p className="text-destructive/80 text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );
    case "recommendation":
      return (
        <div className="flex gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">{section.title}</h4>
            {section.content && <p className="text-muted-foreground text-sm mb-2">{section.content}</p>}
            {section.items && section.items.length > 0 && (
              <ul className="list-disc pl-4 space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    case "followUp":
      return (
        <div className="pt-2">
          <h4 className="text-sm font-semibold text-foreground mb-2">{section.title}</h4>
          <div className="flex flex-wrap gap-2">
            {section.items?.map((item, i) => (
              <span key={i} className="text-xs bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border cursor-pointer hover:bg-muted hover:text-foreground transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}
