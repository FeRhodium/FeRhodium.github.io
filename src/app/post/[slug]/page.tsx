import { notFound } from "next/navigation";
import { IconCalendar, IconRefresh } from "@tabler/icons-react";

import { LocalDateTime } from "@/components/local-date-time";
import { MarkdownContent } from "@/components/markdown-content";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight">{post.title}</h2>
      <div className="flex flex-wrap gap-2">
        {post.tags.length === 0 && <Badge variant="outline">untagged</Badge>}
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-2">
          <IconCalendar className="size-4" stroke={1.75} />
          <span>Created</span>
          <LocalDateTime className="font-medium text-foreground" value={post.createdAt} />
        </p>
        <p className="inline-flex items-center gap-2">
          <IconRefresh className="size-4" stroke={1.75} />
          <span>Updated</span>
          <LocalDateTime className="font-medium text-foreground" value={post.updatedAt} />
        </p>
      </div>
      <MarkdownContent html={post.html} />
    </section>
  );
}
