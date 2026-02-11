import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import { BlogTabs } from "@/components/blog-tabs";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import "./globals.css";
import "katex/dist/katex.min.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "Markdown blog generated from posts folder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.variable} antialiased`}>
        <ThemeProvider>
          <div className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold tracking-tight">My Blog</h1>
                <ThemeToggle />
              </div>
              <BlogTabs />
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
