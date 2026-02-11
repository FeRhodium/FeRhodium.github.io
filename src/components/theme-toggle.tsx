"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label="Toggle dark mode"
      className="w-24"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="sm"
      type="button"
      variant="outline"
    >
      {mounted && isDark ? <IconSun className="size-4" stroke={1.75} /> : <IconMoon className="size-4" stroke={1.75} />}
      <span>{mounted && isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
