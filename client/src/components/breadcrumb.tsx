import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="px-4 py-3 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800"
      data-testid="breadcrumb-nav"
    >
      <ol className="flex items-center gap-2 max-w-7xl mx-auto text-sm">
        <li>
          <Link href="/">
            <a 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              data-testid="breadcrumb-home"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </a>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-600" />
            {item.current ? (
              <span 
                className="text-gray-700 dark:text-slate-300"
                data-testid={`breadcrumb-current-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href || "#"}>
                <a 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  data-testid={`breadcrumb-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
