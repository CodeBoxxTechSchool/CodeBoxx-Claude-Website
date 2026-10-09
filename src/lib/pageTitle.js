// The <title> (and og:/twitter:title) of a page: its title plus " | CodeBoxx" when that still
// fits. Bing flags titles over 70 characters and search results cut them around there, so a
// long title goes out as is rather than pushing the brand past the cut.
export const SITE_NAME = 'CodeBoxx';
export const MAX_TITLE = 70;

export function pageTitle(title) {
  if (title.includes(SITE_NAME)) return title;
  const withBrand = title + ' | ' + SITE_NAME;
  return withBrand.length <= MAX_TITLE ? withBrand : title;
}
