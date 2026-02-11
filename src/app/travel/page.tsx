import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { getTravelPosts } from "@/lib/posts";

function formatTravelDate(value: string): string {
  const localDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (localDateMatch) {
    const [, year, month, day] = localDateMatch;
    const localDate = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(localDate);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatTravelPeriod(start?: string, end?: string): string {
  if (!start && !end) {
    return "-";
  }

  if (start && end) {
    return `${formatTravelDate(start)} ~ ${formatTravelDate(end)}`;
  }

  return start ? formatTravelDate(start) : end ? formatTravelDate(end) : "-";
}

export default function TravelPage() {
  const travelPosts = getTravelPosts();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Travel</h2>
      {travelPosts.length === 0 ? (
        <p className="text-muted-foreground">
          No travel posts yet. Add tag <span className="font-mono">travel</span> with location and travelDate fields.
        </p>
      ) : (
        <Table>
          <TableBody>
            {travelPosts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell className="max-w-xs truncate font-medium">
                  <Link className="hover:underline" href={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>{post.location.length > 0 ? post.location.join(", ") : "-"}</TableCell>
                <TableCell>{formatTravelPeriod(post.travelStart, post.travelEnd)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
