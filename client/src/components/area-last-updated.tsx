import { Calendar } from "lucide-react";

interface AreaLastUpdatedProps {
  /** ISO-8601 date string, e.g. "2025-04-28" */
  date: string;
  /** Optional display label. Defaults to "Page last reviewed" */
  label?: string;
}

/**
 * Small "last reviewed" attribution badge shown near the foot of every area page.
 * Uses a <time> element for semantic HTML and schema.org dateModified signal.
 */
export default function AreaLastUpdated({ date, label = "Page last reviewed" }: AreaLastUpdatedProps) {
  const displayDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-2">
      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
      <span>
        {label}:{" "}
        <time dateTime={date} itemProp="dateModified">
          {displayDate}
        </time>
      </span>
    </div>
  );
}
