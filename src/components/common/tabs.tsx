import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface CommonTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  contentClassName?: string;
  onValueChange?: (value: string) => void;
}

export function CommonTabs({
  tabs,
  defaultValue,
  className,
  contentClassName,
  onValueChange,
}: CommonTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <Tabs
      defaultValue={defaultValue || tabs[0].value}
      onValueChange={onValueChange}
      className={cn("w-full space-y-4", className)}
    >
      <TabsList className="bg-card p-2 border border-border/40 w-full justify-start overflow-y-hidden overflow-x-auto scrollbar-overlay-x whitespace-nowrap flex h-12.5 gap-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2 font-semibold px-4 py-1.5 transition-background duration-200 border border-border data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md"
          >
            {tab.icon && <span className="size-4 flex items-center justify-center">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={cn("outline-none focus-visible:ring-0 animate-fade-in", contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
