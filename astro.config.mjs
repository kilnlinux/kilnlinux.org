// @ts-check
import { spawn } from 'node:child_process';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * The docs are a separate site in docs/, served at https://docs.kilnlinux.org.
 * In dev, start the docs dev server (port 4322) alongside this one, so one command runs both.
 * A /docs proxy doesn't work: Astro's dev server ignores `base` for Vite's internal module URLs.
 * @returns {import('astro').AstroIntegration}
 */
function docsInDev() {
  /** @type {import('node:child_process').ChildProcess | undefined} */
  let docs;
  return {
    name: 'kiln-docs-in-dev',
    hooks: {
      'astro:server:setup': () => {
        docs = spawn('npm', ['run', 'dev', '-w', 'docs'], { stdio: 'inherit' });
        process.on('exit', () => docs?.kill());
      },
      'astro:server:done': () => { docs?.kill(); },
    },
  };
}

export default defineConfig({
  site: 'https://kilnlinux.org',
  trailingSlash: 'ignore',
  // Keep source line breaks as spaces: compression drops them before inline <code>.
  compressHTML: false,
  integrations: [
    sitemap({
      // search.kilnlinux.org/search is canonical for the package page, so leave its kilnlinux.org copy out.
      filter: (page) => !/^\/(?:404|search)(?:\/|\.html)?$/.test(new URL(page).pathname),
      serialize: (item) => ({ ...item, url: new URL(item.url).pathname === '/' ? item.url : item.url.replace(/\/+$/, '') }),
    }),
    docsInDev(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
