import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  if (!content) return null;

  // Process text that may contain $...$ or $$...$$ or LaTeX tags
  const renderFormattedContent = () => {
    // If the text contains math delimiters $...$ or $$...$$
    if (content.includes('$')) {
      const parts: React.ReactNode[] = [];
      const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(content)) !== null) {
        // Plain text before match
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${lastIndex}`}>
              {content.substring(lastIndex, match.index)}
            </span>
          );
        }

        const rawMath = match[0];
        const isBlock = rawMath.startsWith('$$');
        const mathExpr = isBlock
          ? rawMath.slice(2, -2).trim()
          : rawMath.slice(1, -1).trim();

        try {
          const html = katex.renderToString(mathExpr, {
            displayMode: isBlock,
            throwOnError: false,
          });
          parts.push(
            <span
              key={`math-${match.index}`}
              className={isBlock ? "block my-2 overflow-x-auto py-1" : "inline-block px-0.5"}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          parts.push(<code key={`err-${match.index}`} className="font-mono text-xs">{mathExpr}</code>);
        }

        lastIndex = regex.lastIndex;
      }

      // Remaining plain text
      if (lastIndex < content.length) {
        parts.push(
          <span key={`text-end`}>{content.substring(lastIndex)}</span>
        );
      }

      return parts;
    }

    // If pure LaTeX equation without $
    if (content.startsWith('\\') || content.includes('^') || content.includes('_') || content.includes('\\frac')) {
      try {
        const html = katex.renderToString(content, {
          displayMode: !inline,
          throwOnError: false,
        });
        return (
          <span
            className={!inline ? "block my-2 overflow-x-auto py-1" : "inline-block px-0.5"}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span>{content}</span>;
      }
    }

    // Plain text with line breaks preserved
    return (
      <span>
        {content.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return <div className={`leading-relaxed ${className}`}>{renderFormattedContent()}</div>;
};
