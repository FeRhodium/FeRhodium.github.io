type MarkdownContentProps = {
  html: string;
};

export function MarkdownContent({ html }: MarkdownContentProps) {
  return <article className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
