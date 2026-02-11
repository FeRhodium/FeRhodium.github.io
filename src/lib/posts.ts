import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

import matter from "gray-matter";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { visit } from "unist-util-visit";
import type { Node } from "unist";

const POSTS_DIR = path.join(process.cwd(), "posts");
const CALLOUT_DIRECTIVES = new Set(["note", "tip", "info", "warning", "danger"]);

type DirectiveNode = {
  type?: string;
  name?: string;
  label?: string;
  attributes?: Record<string, string | undefined>;
  children?: unknown[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

type ElementNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: unknown[];
};

type TravelDateInput =
  | {
      start?: string;
      end?: string;
    }
  | string;

type Frontmatter = {
  title?: string;
  summary?: string;
  tags?: string[] | string;
  about?: boolean;
  location?: string[] | string;
  travelDate?: TravelDateInput;
  created?: string | Date;
  updated?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  about: boolean;
  location: string[];
  travelStart?: string;
  travelEnd?: string;
  createdAt: string;
  updatedAt: string;
};

export type PostDetail = PostMeta & {
  content: string;
  html: string;
};

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => /\.mdx?$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b));
}

function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.mdx?$/i, "");
}

function normalizeArray(value: string[] | string | undefined): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTravelDate(travelDate: TravelDateInput | undefined): {
  start?: string;
  end?: string;
} {
  if (!travelDate) {
    return {};
  }

  if (typeof travelDate === "string") {
    const [start, end] = travelDate
      .split(/\s*(?:~|to|\/)\s*/i)
      .map((entry) => entry.trim())
      .filter(Boolean);

    return { start, end };
  }

  return {
    start: travelDate.start,
    end: travelDate.end,
  };
}

function getGitTimestamps(filePath: string): { createdAt: string; updatedAt: string } {
  const fallback = fs.statSync(filePath).mtime.toISOString();

  try {
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
    const history = execSync(`git log --follow --format=%cI -- "${relativePath}"`, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (history.length > 0) {
      return {
        updatedAt: history[0],
        createdAt: history[history.length - 1],
      };
    }
  } catch {
    // Fallback to filesystem timestamp when git history is unavailable.
  }

  return {
    createdAt: fallback,
    updatedAt: fallback,
  };
}

function normalizeFrontmatterTimestamp(value: string | Date | undefined): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? undefined : value.toISOString();
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.valueOf()) ? trimmed : parsed.toISOString();
}

function toTimeValue(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? 0 : parsed.valueOf();
}

function toTitleCase(value: string): string {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}

function toClassList(className: unknown): string[] {
  if (Array.isArray(className)) {
    return className.filter((item): item is string => typeof item === "string");
  }

  if (typeof className === "string") {
    return className.split(/\s+/).filter(Boolean);
  }

  return [];
}

function remarkCalloutDirective() {
  return (tree: unknown) => {
    visit(tree as Node, (node) => {
      const directive = node as DirectiveNode;
      if (
        directive.type !== "containerDirective" &&
        directive.type !== "leafDirective" &&
        directive.type !== "textDirective"
      ) {
        return;
      }

      const name = directive.name?.toLowerCase();
      if (!name || !CALLOUT_DIRECTIVES.has(name)) {
        return;
      }

      const data = directive.data || (directive.data = {});
      data.hName = directive.type === "textDirective" ? "span" : "aside";
      data.hProperties = {
        ...(data.hProperties ?? {}),
        className: ["callout", `callout-${name}`],
      };

      if (directive.type !== "containerDirective") {
        return;
      }

      const titleFromAttr = directive.attributes?.title?.trim();
      const title = titleFromAttr || directive.label || toTitleCase(name);
      directive.children = [
        {
          type: "paragraph",
          data: {
            hName: "p",
            hProperties: { className: ["callout-title"] },
          },
          children: [{ type: "text", value: title }],
        },
        ...(directive.children ?? []),
      ];
    });
  };
}

function createFootnoteBackrefIcon(): ElementNode {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: ["footnote-backref-icon"],
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: { d: "M9 14l-4-4 4-4" },
        children: [],
      },
      {
        type: "element",
        tagName: "path",
        properties: { d: "M5 10h9a5 5 0 0 1 5 5v3" },
        children: [],
      },
    ],
  };
}

function rehypeFootnoteBackrefIcon() {
  return (tree: unknown) => {
    visit(tree as Node, "element", (node) => {
      const element = node as ElementNode;
      if (element.tagName !== "a") {
        return;
      }

      const properties = element.properties;
      const classList = toClassList(properties?.className);
      const hasBackrefAttribute = properties
        ? "dataFootnoteBackref" in properties || "data-footnote-backref" in properties
        : false;
      if (!hasBackrefAttribute && !classList.includes("data-footnote-backref")) {
        return;
      }

      element.properties = {
        ...(properties ?? {}),
        className: Array.from(new Set([...classList, "footnote-backref"])),
      };
      element.children = [createFootnoteBackrefIcon()];
    });
  };
}

function parsePostFile(fileName: string): {
  meta: PostMeta;
  content: string;
} {
  const filePath = path.join(POSTS_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;

  const slug = slugFromFileName(fileName);
  const tags = normalizeArray(frontmatter.tags);
  const location = normalizeArray(frontmatter.location);
  const travelDate = normalizeTravelDate(frontmatter.travelDate);
  const configuredCreatedAt = normalizeFrontmatterTimestamp(frontmatter.createdAt ?? frontmatter.created);
  const configuredUpdatedAt = normalizeFrontmatterTimestamp(frontmatter.updatedAt ?? frontmatter.updated);
  const gitTimestamps =
    configuredCreatedAt && configuredUpdatedAt ? null : getGitTimestamps(filePath);
  const createdAt = configuredCreatedAt ?? gitTimestamps?.createdAt;
  const updatedAt = configuredUpdatedAt ?? gitTimestamps?.updatedAt ?? createdAt;

  return {
    content,
    meta: {
      slug,
      title: frontmatter.title?.trim() || slug,
      summary: frontmatter.summary?.trim() || "",
      tags,
      about: frontmatter.about === true || slug === "about-me",
      location,
      travelStart: travelDate.start,
      travelEnd: travelDate.end,
      createdAt: createdAt ?? "",
      updatedAt: updatedAt ?? "",
    },
  };
}

export function getAllPosts(): PostMeta[] {
  return listPostFiles()
    .map((fileName) => parsePostFile(fileName).meta)
    .sort((a, b) => toTimeValue(b.updatedAt) - toTimeValue(a.updatedAt));
}

export function getPublicPosts(): PostMeta[] {
  return getAllPosts().filter((post) => !post.about);
}

export function getTravelPosts(): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.tags.some((tag) => tag.toLowerCase() === "travel"))
    .sort((a, b) => {
      const leftDate = a.travelStart ?? a.updatedAt;
      const rightDate = b.travelStart ?? b.updatedAt;
      return toTimeValue(rightDate) - toTimeValue(leftDate);
    });
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const matchedFile = listPostFiles().find((fileName) => slugFromFileName(fileName) === slug);
  if (!matchedFile) {
    return null;
  }

  const parsed = parsePostFile(matchedFile);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkToc, {
      heading: "table[ -]of[ -]contents|toc",
      tight: true,
    })
    .use(remarkDirective)
    .use(remarkCalloutDirective)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .use(rehypeFootnoteBackrefIcon)
    .use(rehypeStringify)
    .process(parsed.content);

  return {
    ...parsed.meta,
    content: parsed.content,
    html: processed.toString(),
  };
}

export async function getAboutPost(): Promise<PostDetail | null> {
  const allPosts = getAllPosts();
  const candidate =
    allPosts.find((post) => post.slug === "about-me") ??
    allPosts.find((post) => post.about) ??
    allPosts.find((post) => post.tags.some((tag) => tag.toLowerCase() === "about"));

  if (!candidate) {
    return null;
  }

  return getPostBySlug(candidate.slug);
}
