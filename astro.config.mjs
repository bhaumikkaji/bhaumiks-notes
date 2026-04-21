import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://notes.bhaumikkaji.com',
  output: 'static',
  devToolbar: { enabled: false },
  server: { host: true },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});