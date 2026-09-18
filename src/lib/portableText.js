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
// blockquote, list styles bullet/number, marks strong/em/link, plus tables
// (the `table` object type from the @sanity/table Studio plugin) and
// `videoEmbed` (a YouTube/Vimeo URL — see renderVideo() below). Extend here
// if the Sanity schema grows further (e.g. inline images, code blocks) —
// mirroring whatever `portableTextComponents` in the old BlogPost.jsx would
// have needed to add.

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

// Renders an @sanity/table value ({ rows: [{ cells: [string, ...] }, ...] } —
// plain strings only, no marks/formatting inside cells, per that plugin's own
// schema). No explicit header flag exists on the type, so the first row is
// treated as the header — the common convention for an editor building a
// table top-down, and the only signal this shape gives us.
function renderTable(block) {
  const rows = block.rows || [];
  if (!rows.length) return '';
  const cellsHtml = (cells) => (cells || []).map((c) => '<td>' + escapeHtml(c) + '</td>').join('');
  const headHtml = (cells) => (cells || []).map((c) => '<th>' + escapeHtml(c) + '</th>').join('');
  const [head, ...body] = rows;
  const bodyHtml = body.map((row) => '<tr>' + cellsHtml(row.cells) + '</tr>').join('');
  return (
    '<div class="post-table-wrap"><table class="post-table"><thead><tr>' +
    headHtml(head.cells) +
    '</tr></thead><tbody>' +
    bodyHtml +
    '</tbody></table></div>'
  );
}

// Matches a YouTube or Vimeo URL and pulls out its video id. YouTube ids are
// always 11 chars (watch?v=, youtu.be/, embed/, and shorts/ links all end in
// one); Vimeo ids are plain digits, optionally after extra path segments
// (channel/group links).
const YOUTUBE_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_RE = /vimeo\.com\/(?:.*\/)?(\d+)/i;

function parseVideoUrl(url) {
  const yt = (url || '').match(YOUTUBE_RE);
  if (yt) return { provider: 'youtube', id: yt[1] };
  const vm = (url || '').match(VIMEO_RE);
  if (vm) return { provider: 'vimeo', id: vm[1] };
  return null;
}

// Renders a `videoEmbed` block. This is the actual "web performance" lever for
// video: neither provider's media is ever stored in Sanity (no file-asset
// transcoding to pay for), and YouTube — whose iframe embed is one of the
// heaviest common page-weight regressions — gets a click-to-play facade
// instead of an eager iframe: a static `i.ytimg.com` thumbnail + play button,
// with the real iframe (and YouTube's own embed JS) only created on click, via
// the small shared script in blog/[slug].astro. Vimeo has no equivalent
// API-free static thumbnail, so it falls back to a plain `loading="lazy"`
// iframe, which still defers its subresources until it's near the viewport.
function renderVideo(block) {
  const parsed = parseVideoUrl(block.url);
  if (!parsed) return '';
  const captionHtml = block.caption
    ? '<figcaption class="post-video-caption">' + escapeHtml(block.caption) + '</figcaption>'
    : '';
  if (parsed.provider === 'youtube') {
    const embedSrc = 'https://www.youtube-nocookie.com/embed/' + parsed.id + '?autoplay=1';
    const thumbSrc = 'https://i.ytimg.com/vi/' + parsed.id + '/hqdefault.jpg';
    return (
      '<figure class="post-video">' +
      '<div class="post-video-frame post-video-facade" role="button" tabindex="0" ' +
      'aria-label="Play video" data-embed-src="' +
      escapeHtml(embedSrc) +
      '" style="background-image: url(\'' +
      escapeHtml(thumbSrc) +
      '\')">' +
      '<span class="post-video-play" aria-hidden="true"></span>' +
      '</div>' +
      captionHtml +
      '</figure>'
    );
  }
  const embedSrc = 'https://player.vimeo.com/video/' + parsed.id;
  return (
    '<figure class="post-video">' +
    '<div class="post-video-frame">' +
    '<iframe src="' +
    escapeHtml(embedSrc) +
    '" loading="lazy" title="Embedded video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>' +
    '</div>' +
    captionHtml +
    '</figure>'
  );
}

export function portableTextToHtml(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return '';
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block._type === 'table') {
      out.push(renderTable(block));
      i++;
      continue;
    }
    if (block._type === 'videoEmbed') {
      out.push(renderVideo(block));
      i++;
      continue;
    }
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
