import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                // @ts-ignore
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-muted px-1 py-0.5 rounded text-sm" {...rest}>
                {children}
              </code>
            );
          },
          p(props) {
            return <p className="mb-2 last:mb-0">{props.children}</p>;
          },
          ul(props) {
            return <ul className="list-disc pl-4 mb-2">{props.children}</ul>;
          },
          ol(props) {
            return <ol className="list-decimal pl-4 mb-2">{props.children}</ol>;
          },
          li(props) {
            return <li className="mb-1">{props.children}</li>;
          },
          a(props) {
            return (
              <a
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {props.children}
              </a>
            );
          },
          h1(props) {
            return <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{props.children}</h1>;
          },
          h2(props) {
            return <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{props.children}</h2>;
          },
          h3(props) {
            return <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{props.children}</h3>;
          },
          blockquote(props) {
            return (
              <blockquote className="border-l-4 border-muted pl-4 italic my-2">
                {props.children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

