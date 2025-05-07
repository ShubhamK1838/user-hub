
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export function Breadcrumbs({ segments, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4 text-sm text-muted-foreground', className)}>
      <ol className="flex items-center space-x-1.5">
        {segments.map((segment, index) => (
          <li key={segment.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {segment.href ? (
              <Link
                href={segment.href}
                className="hover:text-primary transition-colors"
              >
                {segment.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{segment.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
