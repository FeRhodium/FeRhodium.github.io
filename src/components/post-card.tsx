import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type PostMeta } from "@/lib/posts";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          <Link className="hover:underline" href={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.summary || "No summary"}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2">
        {post.tags.length === 0 && <Badge variant="outline">untagged</Badge>}
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
