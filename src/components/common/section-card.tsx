import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  children,
  actions,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn("bg-card border-border  overflow-hidden h-full", className)}>
      <CardHeader className="flex flex-row max-xl:flex-col max-xl:gap-6 xl:items-center justify-between space-y-0 px-4 md:px-6 border-b border-border/40 bg-muted/10">
        <div className="space-y-1 pr-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground font-sans">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-muted-foreground font-medium">
              {description}
            </CardDescription>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </CardHeader>

      <CardContent className={cn("", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
