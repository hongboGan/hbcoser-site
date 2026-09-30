// Minimal, dependency-free Markdown renderer for article bodies.
// Supports: ## and ### headings, "- " lists, "> " pull quotes, paragraphs,
// **bold**, *italic* and [text](url) links. Anything richer belongs in a component.
//
// Article bodies are hard-wrapped at about 100 columns so the source stays readable, so
// consecutive lines inside a paragraph, a list item or a quote are soft wraps and have to be
// joined. Rendering line by line instead breaks every sentence at the wrap point and splits a
// list item in half, which is how all four original posts were rendering.
import { Link } from 'react-router-dom';

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text, keyPrefix) {
  return String(text)
    .split(INLINE)
    .filter(Boolean)
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      // Recurse so emphasis can wrap other inline syntax. Without this, a link written
      // inside **bold** renders as the literal text "[label](/path)" instead of an anchor.
      if (/^\*\*[^*]+\*\*$/.test(part))
        return <strong key={key}>{renderInline(part.slice(2, -2), key)}</strong>;
      if (/^\*[^*]+\*$/.test(part)) return <em key={key}>{renderInline(part.slice(1, -1), key)}</em>;

      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        return href.startsWith('/') ? (
          <Link key={key} to={href}>
            {label}
          </Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return <span key={key}>{part}</span>;
    });
}

// Group lines into blocks first, then render. One block is one heading, one list, one quote or
// one paragraph, and it holds whole sentences rather than single source lines.
function parseBlocks(text) {
  const blocks = [];
  let current = null;

  const flush = () => {
    if (current) blocks.push(current);
    current = null;
  };

  String(text || '')
    .split('\n')
    .forEach((raw) => {
      const line = raw.trim();

      // A blank line is the only thing that ends a block.
      if (!line) {
        flush();
        return;
      }

      if (line.startsWith('### ')) {
        flush();
        blocks.push({ type: 'h3', text: line.slice(4) });
        return;
      }

      if (line.startsWith('## ')) {
        flush();
        blocks.push({ type: 'h2', text: line.slice(3) });
        return;
      }

      if (line.startsWith('- ')) {
        if (current && current.type === 'ul') current.items.push(line.slice(2));
        else {
          flush();
          current = { type: 'ul', items: [line.slice(2)] };
        }
        return;
      }

      if (line.startsWith('> ')) {
        if (current && current.type === 'quote') current.text += ` ${line.slice(2)}`;
        else {
          flush();
          current = { type: 'quote', text: line.slice(2) };
        }
        return;
      }

      // A line that opens no new block continues the open one: the next line of a paragraph,
      // a wrapped list item, or a lazy quote continuation.
      if (current) {
        if (current.type === 'ul') current.items[current.items.length - 1] += ` ${line}`;
        else current.text += ` ${line}`;
        return;
      }

      current = { type: 'paragraph', text: line };
    });

  flush();
  return blocks;
}

export function Markdown({ text }) {
  const blocks = parseBlocks(text).map((block, i) => {
    const key = `b${i}`;
    if (block.type === 'h2') return <h2 key={key}>{renderInline(block.text, key)}</h2>;
    if (block.type === 'h3') return <h3 key={key}>{renderInline(block.text, key)}</h3>;
    if (block.type === 'quote') return <blockquote key={key}>{renderInline(block.text, key)}</blockquote>;
    if (block.type === 'ul') {
      return (
        <ul key={key}>
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item, `${key}-${j}`)}</li>
          ))}
        </ul>
      );
    }
    return <p key={key}>{renderInline(block.text, key)}</p>;
  });

  return <div className="prose">{blocks}</div>;
}
