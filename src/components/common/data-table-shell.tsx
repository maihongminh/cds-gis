'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './empty-state';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';

export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableShellProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  initialPageSize?: number;
  loading?: boolean;
  size?: 'default' | 'sm';
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export function DataTableShell<T>({
  data,
  columns,
  searchPlaceholder = 'Tìm kiếm...',
  searchKeys = [],
  initialPageSize = 10,
  loading = false,
  size = 'default',
}: DataTableShellProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [sortState, setSortState] = React.useState<SortState<T>>({
    key: null,
    direction: null,
  });

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle Search Filtering
  const filteredData = React.useMemo(() => {
    if (!searchQuery || searchKeys.length === 0) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = item[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchKeys]);

  // Handle Sorting
  const sortedData = React.useMemo(() => {
    const { key, direction } = sortState;
    if (!key || !direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return direction === 'asc' ? -1 : 1;
      if (strA > strB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortState]);

  // Handle Pagination
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  // Toggle sorting logic
  const handleSort = (key: keyof T) => {
    setSortState((prev) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
  };

  const renderSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable || !column.accessorKey) return null;
    const isSortedThisColumn = sortState.key === column.accessorKey;

    if (!isSortedThisColumn) {
      return <ArrowUpDown className="size-4 ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />;
    }

    return sortState.direction === 'asc' ? (
      <ArrowUp className="size-4 ml-1.5 text-primary" />
    ) : (
      <ArrowDown className="size-4 ml-1.5 text-primary" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Top action bar: Search */}
      {searchKeys.length > 0 && (
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-sm"
        />
      )}

      {/* Table grid layout with scroll area wrapper */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table size={size}>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                {columns.map((col, idx) => {
                  const alignment = col.align || 'left';
                  return (
                    <TableHead
                      key={idx}
                      className={cn(
                        "h-10 text-xs font-semibold text-muted-foreground whitespace-nowrap",
                        alignment === 'center' && "text-center",
                        alignment === 'right' && "text-right",
                        col.sortable && col.accessorKey && "cursor-pointer select-none hover:text-foreground group"
                      )}
                      onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
                    >
                      <span className="inline-flex items-center">
                        {col.header}
                        {renderSortIcon(col)}
                      </span>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                // Table skeleton loader
                Array.from({ length: pageSize }).map((_, rIdx) => (
                  <TableRow key={rIdx} className="border-b border-border/40">
                    {columns.map((_, cIdx) => (
                      <TableCell key={cIdx} className="p-3">
                        <Skeleton className="h-4 w-full bg-muted/60" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                // Empty state nested in table
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                // Normal data rows
                paginatedData.map((row, rIdx) => (
                  <TableRow key={rIdx} className="hover:bg-muted/30 border-b border-border/40 transition-colors">
                    {columns.map((col, cIdx) => {
                      const alignment = col.align || 'left';
                      return (
                        <TableCell
                          key={cIdx}
                          className={cn(
                            "p-3 text-xs text-foreground font-medium whitespace-nowrap",
                            alignment === 'center' && "text-center",
                            alignment === 'right' && "text-right"
                          )}
                        >
                          {col.render
                            ? col.render(row)
                            : col.accessorKey
                              ? String(row[col.accessorKey] ?? '-')
                              : '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bottom pagination control bar */}
      {!loading && sortedData.length > 0 && (
        <div className="flex items-center justify-between px-1 text-xs max-md:flex-col gap-3">
          <div className="text-muted-foreground font-medium">
            Hiển thị <span className="font-semibold text-foreground">{Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)}</span>
            {'-'}
            <span className="font-semibold text-foreground">{Math.min(sortedData.length, currentPage * pageSize)}</span>
            {' trên tổng số '}
            <span className="font-semibold text-foreground">{sortedData.length}</span> kết quả
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 bg-card border-border hover:bg-muted cursor-pointer shadow-none disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Trang trước</span>
            </Button>

            <div className="text-muted-foreground font-medium px-2">
              Trang <span className="font-semibold text-foreground">{currentPage}</span> / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 bg-card border-border hover:bg-muted cursor-pointer shadow-none disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Trang sau</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
