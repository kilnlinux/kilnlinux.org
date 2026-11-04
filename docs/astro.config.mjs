// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// In dev the main site's dev server starts this one and links to it (see ../astro.config.mjs).
const dev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://docs.kilnlinux.org',
  // The main site links to this exact port in dev, so fail rather than drift to another one.
  vite: { server: { strictPort: true } },
  integrations: [
    starlight({
      title: 'Kiln Linux',
      description: 'Documentation for Kiln Linux, a minimal distribution based on Arch Linux.',
      logo: { src: './src/assets/mark.svg', alt: 'Kiln Linux' },
      favicon: '/favicon.svg',
      expressiveCode: {
        themes: ['github-light'],
        defaultProps: { frame: 'none' },
        styleOverrides: { borderRadius: '4px', borderColor: '#c9c4bc', codeBackground: '#f6f4f1' },
      },
      customCss: ['./src/styles/docs.css'],
      components: {
        ThemeProvider: './src/starlight/ThemeProvider.astro',
        ThemeSelect: './src/starlight/ThemeSelect.astro',
      },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://kilnlinux.org/og.png' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Kiln Linux documentation' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://kilnlinux.org/og.png' } },
      ],
      sidebar: [
        { label: 'Start here', items: [{ label: 'Overview', link: '/' }, 'status'] },
        { label: 'Using Kiln', items: ['installation', 'desktops', 'configuration', 'package-management', 'troubleshooting'] },
        { label: 'Contributing', items: ['contributing', 'development'] },
        { label: 'kilnlinux.org', link: dev ? 'http://localhost:4321/' : 'https://kilnlinux.org' },
      ],
    }),
  ],
});
