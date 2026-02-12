"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { label: "Post", href: "/", value: "/" },
  { label: "Travel", href: "/travel", value: "/travel" },
  { label: "Event", href: "/event", value: "/event" },
  { label: "About Me", href: "/about", value: "/about" },
] as const;

function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/travel")) {
    return "/travel";
  }

  if (pathname.startsWith("/event")) {
    return "/event";
  }

  if (pathname.startsWith("/about")) {
    return "/about";
  }

  return "/";
}

export function BlogTabs() {
  const pathname = usePathname();

  return (
    <Tabs value={getActiveTab(pathname)} className="gap-0">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            asChild
            className="h-10 flex-none rounded-none border-0 px-0 pb-2 pt-1 text-sm text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none after:bg-primary after:bottom-[-1px]"
          >
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
