import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  iconClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = '', inputClassName = '', iconClassName = '', placeholder = 'Tìm kiếm...', ...props }, ref) => {
    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <Search className={`absolute left-3 w-4 h-4 text-muted-foreground/60 pointer-events-none z-10 ${iconClassName}`} />
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={`w-full pl-9 h-9 text-xs bg-card border-border rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-ring transition shadow-none border ${inputClassName}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
