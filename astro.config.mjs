import { defineConfig } from 'astro/config';

// ![Caption](/media/piece/file.png) becomes a captioned figure. The image's
// alt text doubles as the caption; a quoted title picks the style variant:
// default = framed on the grey surface, "bare" = no frame.
function remarkFigures() {
  const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (
          child.type === 'paragraph' &&
          child.children?.length === 1 &&
          child.children[0].type === 'image'
        ) {
          const img = child.children[0];
          const cls = img.title ? `media ${esc(img.title)}` : 'media';
          const alt = img.alt || '';
          return {
            type: 'html',
            value:
              `<figure class="${cls}">` +
              `<span class="media-frame"><img src="${esc(img.url)}" alt="${esc(alt)}" loading="lazy" /></span>` +
              (alt ? `<figcaption>${esc(alt)}</figcaption>` : '') +
              `</figure>`,
          };
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://www.elliottsrosenberg.com',
  devToolbar: { enabled: false },
  markdown: {
    remarkPlugins: [remarkFigures],
  },
});
