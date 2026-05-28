import { env, featureFlags } from "@/lib/env";
import { cacheKeys, ttlSeconds } from "@/lib/cache/keys";
import { withCache } from "@/lib/cache/redis";
import { getRssSignals } from "@/lib/providers/rss";
import type { NewsSignal } from "@/types/domain";

interface NewsApiResponse {
  status: string;
  articles: Array<{ title: string; description?: string | null }>;
}

function scoreFromHeadline(text: string) {
  const lowered = text.toLowerCase();
  if (/(injury|ruled out|doubt|suspended)/.test(lowered)) return -0.2;
  if (/(returns|fit|back in training|available)/.test(lowered)) return 0.1;
  return 0;
}

async function getNewsApiSignals(teamName: string): Promise<NewsSignal[]> {
  if (!featureFlags.hasNewsApiKey) return [];

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", `"${teamName}" AND (injury OR squad OR team news)`);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "8");

  const res = await fetch(url, {
    headers: { "X-Api-Key": env.NEWSAPI_KEY! },
    next: { revalidate: ttlSeconds.news },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as NewsApiResponse;
  if (data.status !== "ok") return [];

  return data.articles
    .map((article) => {
      const title = article.title ?? "";
      const description = article.description ?? "";
      const combined = `${title} ${description}`.trim();
      return {
        teamName,
        scoreImpact: scoreFromHeadline(combined),
        summary: title,
        source: "newsapi" as const,
      };
    })
    .filter((x) => x.summary);
}

export async function getNewsSignals(teamName: string): Promise<NewsSignal[]> {
  return withCache(cacheKeys.news(teamName), ttlSeconds.news, async () => {
    const [newsApiSignals, rssSignals] = await Promise.all([
      getNewsApiSignals(teamName),
      getRssSignals(teamName),
    ]);

    return [...newsApiSignals, ...rssSignals].slice(0, 8);
  });
}
