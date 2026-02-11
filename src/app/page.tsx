import { PostCard } from "@/components/post-card";
import { getPublicPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getPublicPosts();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Post</h2>
      {posts.length === 0 && (
        <p className="text-muted-foreground">No posts found. Add markdown files under the posts folder.</p>
      )}
      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
