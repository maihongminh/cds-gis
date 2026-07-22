import * as React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 @3xl:flex-row @3xl:items-start @3xl:justify-between pb-4 border-b border-border/60 ${className}`}>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
