import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { defaultLang, ui } from '../i18n/ui';
import { byDateDesc, filterVisible, localeOf, slugOf } from '../lib/content';

export async function GET(context: APIContext) {
  const all = await getCollection('blog');
  const posts = filterVisible(
    all.filter((entry) => localeOf(entry.id) === defaultLang),
    false,
  ).sort(byDateDesc);

  return rss({
    title: ui[defaultLang]['site.title'],
    description: ui[defaultLang]['site.description'],
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${slugOf(post.id)}/`,
    })),
    customData: `<language>ko</language>`,
  });
}
