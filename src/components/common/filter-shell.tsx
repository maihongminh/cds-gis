'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FilterShellProps {
  children: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FilterShell({
  children,
  onSearch,
  onReset,
  isLoading = false,
  collapsible = false,
  defaultExpanded = true,
}: FilterShellProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <Card className="border border-border/60 shadow-none bg-card overflow-hidden">
      {collapsible && (
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/10 cursor-pointer hover:bg-muted/20 select-none"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="size-4 text-muted-foreground" />
            Bộ lọc tìm kiếm
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer shadow-none">
            {isExpanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      )}

      {isExpanded && (
        <CardContent className="md:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {children}
          </div>

          {(onSearch || onReset) && (
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
              {onReset && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  disabled={isLoading}
                  className="cursor-pointer border-border hover:bg-muted text-muted-foreground text-xs gap-1.5 h-8.5"
                >
                  <RotateCcw className="size-3.5" />
                  Đặt lại
                </Button>
              )}
              {onSearch && (
                <Button
                  type="button"
                  size="sm"
                  onClick={onSearch}
                  disabled={isLoading}
                  className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 h-8.5"
                >
                  <Filter className="size-3.5" />
                  Tìm kiếm
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
