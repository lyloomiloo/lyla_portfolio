import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://lylahuang.com',
  integrations: [sitemap()],
  output: 'static',
  adapter: vercel(),
  vite: {
    server: {
      watch: {
        ignored: ['**/public/images/**/*.mp4', '**/public/images/**/*.mov'],
      },
    },
  },
});
