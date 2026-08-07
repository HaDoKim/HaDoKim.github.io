// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hadokim.github.io',
  integrations: [sitemap()],
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
