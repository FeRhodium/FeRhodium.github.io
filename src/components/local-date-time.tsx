"use client";

import { useEffect, useState } from "react";

type LocalDateTimeProps = {
  value: string;
  className?: string;
};

function formatLocalDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

export function LocalDateTime({ value, className }: LocalDateTimeProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(formatLocalDateTime(value));
  }, [value]);

  return (
    <time className={className} dateTime={value} suppressHydrationWarning>
      {formatted}
    </time>
  );
}
