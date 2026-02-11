import { MarkdownContent } from "@/components/markdown-content";
import { getAboutPost } from "@/lib/posts";

export default async function AboutPage() {
  const aboutPost = await getAboutPost();

  if (!aboutPost) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">About Me</h2>
        <p className="text-muted-foreground">
          About post not found. Create <span className="font-mono">posts/about-me.md</span>.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">About Me</h2>
      <MarkdownContent html={aboutPost.html} />
    </section>
  );
}
