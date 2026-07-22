'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Button } from '@/components/ui';

interface ThemeToggleProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={`w-9 h-9 border border-border bg-card ${className}`}
        disabled
      />
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/40 ${className}`}>
        <Button
          type="button"
          variant={theme === 'light' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTheme('light')}
          className="flex-1 gap-2 text-xs h-8 cursor-pointer shadow-none"
        >
          <Sun className="size-4" />
          <span>Sáng</span>
        </Button>
        <Button
          type="button"
          variant={theme === 'dark' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="flex-1 gap-2 text-xs h-8 cursor-pointer shadow-none"
        >
          <Moon className="size-4" />
          <span>Tối</span>
        </Button>
        <Button
          type="button"
          variant={theme === 'system' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTheme('system')}
          className="flex-1 gap-2 text-xs h-8 cursor-pointer shadow-none"
        >
          <Laptop className="size-4" />
          <span>Hệ thống</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`relative w-9 h-9 text-foreground cursor-pointer ${className}`}
      aria-label="Toggle theme"
      title="Chuyển chế độ sáng/tối"
    >
      <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </Button>
  );
}
