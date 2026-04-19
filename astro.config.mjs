import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://notes.bhaumikkaji.com',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});