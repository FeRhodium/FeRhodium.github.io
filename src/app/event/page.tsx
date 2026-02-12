import Link from "next/link";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getEventPosts } from "@/lib/posts";

type EventRow = ReturnType<typeof getEventPosts>[number];

type EventGroup = {
  slug: string;
  title: string;
  events: EventRow[];
};

function formatEventDate(value: string): string {
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

function isSameDateTime(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }

  const leftParsed = new Date(left);
  const rightParsed = new Date(right);
  if (Number.isNaN(leftParsed.valueOf()) || Number.isNaN(rightParsed.valueOf())) {
    return false;
  }

  return leftParsed.valueOf() === rightParsed.valueOf();
}

function formatEventPeriod(start?: string, end?: string): string {
  if (!start && !end) {
    return "-";
  }

  if (start && end) {
    if (isSameDateTime(start, end)) {
      return formatEventDate(start);
    }

    return `${formatEventDate(start)} ~ ${formatEventDate(end)}`;
  }

  return start ? formatEventDate(start) : end ? formatEventDate(end) : "-";
}

export default function EventPage() {
  const eventPosts = getEventPosts();
  const groupedByPost = new Map<string, EventGroup>();

  for (const event of eventPosts) {
    const group = groupedByPost.get(event.slug);
    if (group) {
      group.events.push(event);
      continue;
    }

    groupedByPost.set(event.slug, {
      slug: event.slug,
      title: event.title,
      events: [event],
    });
  }

  const eventGroups = Array.from(groupedByPost.values());

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Event</h2>
      {eventGroups.length === 0 ? (
        <p className="text-muted-foreground">
          No event posts yet. Add tag <span className="font-mono">event</span> and configure
          <span className="font-mono"> events</span> in frontmatter.
        </p>
      ) : (
        <Table>
          {eventGroups.map((group, groupIndex) => (
            <TableBody
              key={group.slug}
              className={groupIndex < eventGroups.length - 1 ? "[&_tr:last-child]:border-b group/event" : "group/event"}
            >
              {group.events.map((event, index) => (
                <TableRow key={`${group.slug}-${index}`}>
                  {index === 0 ? (
                    <TableCell
                      className="max-w-xs truncate align-top font-medium transition-colors group-hover/event:bg-muted/50"
                      rowSpan={group.events.length}
                    >
                      <Link className="hover:underline" href={`/post/${group.slug}`}>
                        {group.title}
                      </Link>
                    </TableCell>
                  ) : null}
                  <TableCell>{event.eventName || "-"}</TableCell>
                  <TableCell>{event.eventType || "-"}</TableCell>
                  <TableCell>
                    {event.eventLocation.length > 0 ? event.eventLocation.join(", ") : "-"}
                  </TableCell>
                  <TableCell>{formatEventPeriod(event.eventStart, event.eventEnd)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))}
        </Table>
      )}
    </section>
  );
}
