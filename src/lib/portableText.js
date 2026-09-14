// Server-side Portable Text -> HTML string renderer, used only by
// src/pages/blog/[slug].astro and its /fr/blogue counterpart.
//
// The old BlogPost.jsx rendered a post's `content` with @portabletext/react (a
// React component) — fine for a CSR SPA, but wrong here: shipping a React island
// just to render the post body would put us right back in "content requires JS to
// exist" territory, the exact bug this migration exists to fix. So this walks the
// same Portable Text JSON by hand and returns a plain HTML string that Astro
// inlines directly (via `set:html`) into the prerendered page — zero JS for the
// post body, same visual output.
//
// Scope matches the schema as documented in readme.md ("headings, bold/italic,
// links, lists, quotes — no inline images yet"): block styles normal/h1-h4/
// blockquote, list styles bullet/number, marks strong/em/link. Extend here if the
// Sanity schema grows (e.g. inline images, code blocks) — mirroring whatever
// `portableTextComponents` in the old BlogPost.jsx would have needed to add.

const BLOCK_TAG = {
  normal: 'p',
  h1: 'h2', // same downgrade the old React renderer did — h1 is the page's own <h1>
  h2: 'h2',
  h3: 'h3',
  h4: 'h3',
  blockquote: 'blockquote',
};

const BLOCK_CLASS = {
  normal: 'pbody',
  h1: 'h2',
  h2: 'h2',
  h3: 'ptitle',
  h4: 'ptitle',
  blockquote: 'post-blockquote',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Renders one span's text with its marks (strong/em, plus link marks resolved
// against the block's `markDefs`) as nested HTML, innermost mark last-applied —
// matches Portable Text's documented mark order (a mark closer to the front of
// `marks` wraps closer to the text).
function renderSpan(span, markDefs) {
  let html = escapeHtml(span.text).replace(/\n/g, '<br />');
  const marks = span.marks || [];
  for (let i = marks.length - 1; i >= 0; i--) {
    const mark = marks[i];
    if (mark === 'strong') html = '<strong>' + html + '</strong>';
    else if (mark === 'em') html = '<em>' + html + '</em>';
    else if (mark === 'code') html = '<code>' + html + '</code>';
    else if (mark === 'underline') html = '<u>' + html + '</u>';
    else if (mark === 'strike-through') html = '<s>' + html + '</s>';
    else {
      const def = (markDefs || []).find((d) => d._key === mark);
      if (def && def._type === 'link' && def.href) {
        html =
          '<a href="' +
          escapeHtml(def.href) +
          '" target="_blank" rel="noopener noreferrer">' +
          html +
          '</a>';
      }
      // Unknown mark: leave text unwrapped rather than dropping it.
    }
  }
  return html;
}

function renderBlockChildren(block) {
  return (block.children || []).map((span) => renderSpan(span, block.markDefs)).join('');
}

// Groups consecutive listItem blocks of the same listItem type ("bullet"/"number")
// into one <ul>/<ol>, matching how Portable Text's flat block array represents
// lists (each list item is its own top-level block, not nested).
function renderList(blocks, startIndex) {
  const listType = blocks[startIndex].listItem;
  const tag = listType === 'number' ? 'ol' : 'ul';
  const items = [];
  let i = startIndex;
  while (i < blocks.length && blocks[i]._type === 'block' && blocks[i].listItem === listType) {
    items.push('<li>' + renderBlockChildren(blocks[i]) + '</li>');
    i++;
  }
  return {
    html: '<' + tag + ' class="post-list">' + items.join('') + '</' + tag + '>',
    nextIndex: i,
  };
}

export function portableTextToHtml(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return '';
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block._type !== 'block') {
      i++; // unsupported block type (e.g. a future inline image) — skip, don't crash
      continue;
    }
    if (block.listItem) {
      const { html, nextIndex } = renderList(blocks, i);
      out.push(html);
      i = nextIndex;
      continue;
    }
    const tag = BLOCK_TAG[block.style] || 'p';
    const cls = BLOCK_CLASS[block.style] || 'pbody';
    out.push('<' + tag + ' class="' + cls + '">' + renderBlockChildren(block) + '</' + tag + '>');
    i++;
  }
  return out.join('\n');
}
