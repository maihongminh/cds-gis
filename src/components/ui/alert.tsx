import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Alert({
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function AlertTitle({
  children,
  className,
  ...props
}: AlertTitleProps) {
  return (
    <h5
      className={cn("mb-1 font-bold leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  );
}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AlertDescription({
  children,
  className,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={cn("text-xs [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
}
