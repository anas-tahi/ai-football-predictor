import { cacheKeys, ttlSeconds } from "@/lib/cache/keys";
import { withCache } from "@/lib/cache/redis";
import type { NewsSignal } from "@/types/domain";

const RSS_FEEDS = [
  "https://www.skysports.com/rss/12040",
  "https://feeds.bbci.co.uk/sport/football/rss.xml",
];

function scoreFromTitle(title: string) {
  const lowered = title.toLowerCase();
  if (/(injury|sidelined|out for|doubt|setback)/.test(lowered)) return -0.2;
  if (/(returns|fit again|available|boost)/.test(lowered)) return 0.1;
  return 0;
}

export async function getRssSignals(teamName: string): Promise<NewsSignal[]> {
  return withCache(cacheKeys.news(teamName), ttlSeconds.news, async () => {
    const signals: NewsSignal[] = [];
    await Promise.all(
      RSS_FEEDS.map(async (feed) => {
        try {
          const res = await fetch(feed, { next: { revalidate: ttlSeconds.news } });
          if (!res.ok) return;
          const xml = await res.text();
          const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 20);
          for (const item of itemMatches) {
            const block = item[1];
            const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ??
              block.match(/<title>(.*?)<\/title>/)?.[1] ??
              "") as string;
            if (!title.toLowerCase().includes(teamName.toLowerCase())) continue;
            signals.push({
              teamName,
              scoreImpact: scoreFromTitle(title),
              summary: title.replace(/<[^>]+>/g, "").trim(),
              source: "rss",
            });
          }
        } catch {
          return;
        }
      }),
    );
    return signals.slice(0, 5);
  });
}
