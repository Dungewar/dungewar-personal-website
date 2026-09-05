import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../api";
import { Layout } from "../components/Layout";
import { newsMarkdownToHtml } from "../newsMarkdown";

type NewsItem = {
  id?: number | string;
  title?: string;
  headline?: string;
  content?: string;
  body?: string;
  text?: string;
  author?: string;
  tags?: string[] | string;
  category?: string;
  createdAt?: string | number;
  timestamp?: string | number;
};

type NewsResponse = { data?: NewsItem | NewsItem[] };
type Sort = "newest" | "oldest";

const bodyOf = (item: NewsItem): string => item.content ?? item.body ?? item.text ?? "";
const titleOf = (item: NewsItem): string => item.title?.trim() || item.headline?.trim() || bodyOf(item).match(/^\s*#\s+([^\n]+)/)?.[1]?.trim() || `MAO Bulletin #${item.id ?? "Update"}`;
const tagsOf = (item: NewsItem): string[] => {
  const tags = Array.isArray(item.tags) ? item.tags : item.tags?.trim() ? [item.tags.trim()] : [];
  return item.category && !tags.includes(item.category) ? [item.category, ...tags] : tags;
};
const dateOf = (item: NewsItem): Date | null => {
  const value = item.createdAt ?? item.timestamp;
  if (value === undefined) return null;
  const normalized = typeof value === "number" && value < 1_000_000_000_000 ? value * 1000 : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};
const dateLabel = (item: NewsItem): string => dateOf(item)?.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) ?? "Recently";

function NewsBody({ item }: { item: NewsItem }) {
  return <div className="news-body" dangerouslySetInnerHTML={{ __html: newsMarkdownToHtml(bodyOf(item)) }} />;
}

function NewsCard({ item, featured, onOpen, onTag }: { item: NewsItem; featured?: boolean; onOpen: () => void; onTag: (tag: string) => void }) {
  return (
    <article className={featured ? "news-card featured" : "news-card"}>
      {featured && <span className="latest-label">Latest headline</span>}
      <div className="news-meta"><span>#{item.id ?? "—"}</span><time>{dateLabel(item)}</time></div>
      <h2><button type="button" onClick={onOpen}>{titleOf(item)}</button></h2>
      <p className="news-author">By <strong>{item.author ?? "MAO News Desk"}</strong></p>
      <div className="news-tags">{tagsOf(item).map((tag) => <button type="button" onClick={() => onTag(tag)} key={tag}>#{tag}</button>)}</div>
      <NewsBody item={item} />
      <button className="news-open" type="button" onClick={onOpen}>Direct story view →</button>
    </article>
  );
}

export function NewsPage() {
  const params = new URLSearchParams(window.location.search);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [sort, setSort] = useState<Sort>(params.get("sort") === "oldest" ? "oldest" : "newest");
  const [query, setQuery] = useState(params.get("q") ?? params.get("search") ?? "");
  const [tag, setTag] = useState(params.get("tag") ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadNews = async (signal?: AbortSignal) => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${apiUrl("/news")}?sort=${sort}`, { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json() as NewsResponse;
      const news = Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
      setItems(news);
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === "AbortError")) {
        console.error("Unable to load MAO News", reason);
        setError("Could not connect to the MAO News service.");
      }
    } finally { if (!signal?.aborted) setLoading(false); }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadNews(controller.signal);
    return () => controller.abort();
  }, [sort]);

  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const controller = new AbortController();
    fetch(`${apiUrl("/news")}/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json() as Promise<NewsResponse>; })
      .then((result) => { if (result.data && !Array.isArray(result.data)) setSelected(result.data); })
      .catch((reason: unknown) => { if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(`News item #${id} could not be loaded.`); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    tag ? url.searchParams.set("tag", tag) : url.searchParams.delete("tag");
    sort === "oldest" ? url.searchParams.set("sort", sort) : url.searchParams.delete("sort");
    window.history.replaceState({}, "", url);
  }, [query, tag, sort]);

  const filtered = useMemo(() => items.filter((item) => {
    const haystack = [titleOf(item), bodyOf(item), item.author ?? "", tagsOf(item).join(" "), String(item.id ?? "")].join(" ").toLowerCase();
    return (!tag || tagsOf(item).some((value) => value.toLowerCase() === tag.toLowerCase())) && (!query || haystack.includes(query.toLowerCase()));
  }), [items, query, tag]);
  const allTags = useMemo(() => [...new Set(items.flatMap(tagsOf))].sort(), [items]);

  const openStory = (item: NewsItem) => {
    setSelected(item);
    const url = new URL(window.location.href); url.searchParams.set("id", String(item.id ?? "")); window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeStory = () => {
    setSelected(null);
    const url = new URL(window.location.href); url.searchParams.delete("id"); window.history.pushState({}, "", url);
  };
  const specialStory = async (which: "latest" | "random") => {
    try {
      const response = await fetch(`${apiUrl("/news")}/${which}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json() as NewsResponse;
      if (result.data && !Array.isArray(result.data)) openStory(result.data);
    } catch { setError(`The ${which} story could not be loaded.`); }
  };
  const share = async () => {
    if (!selected) return;
    const url = new URL(window.location.href); url.searchParams.set("id", String(selected.id ?? ""));
    try { await navigator.clipboard.writeText(url.toString()); setToast("Story link copied."); }
    catch { setToast(url.toString()); }
    window.setTimeout(() => setToast(""), 2500);
  };

  if (selected) return (
    <Layout>
      <button className="news-back" type="button" onClick={closeStory}>← Back to all news</button>
      <article className="news-single">
        <div className="news-meta"><span>#{selected.id ?? "—"}</span><time>{dateLabel(selected)}</time></div>
        <h1>{titleOf(selected)}</h1>
        <p className="news-author">By <strong>{selected.author ?? "MAO News Desk"}</strong></p>
        <div className="news-tags">{tagsOf(selected).map((value) => <button type="button" onClick={() => { setTag(value); closeStory(); }} key={value}>#{value}</button>)}</div>
        <NewsBody item={selected} />
        <button className="button" type="button" onClick={share}>Copy direct link</button>
      </article>
      {toast && <div className="copy-toast">{toast}</div>}
    </Layout>
  );

  return (
    <Layout>
      <section className="page-hero news-heading"><p className="eyebrow">Live bulletins</p><h1>MAO News</h1><p>Announcements, events, and dispatches from the MAO News Desk.</p><span className={error ? "news-status error" : "news-status"}><i />{error ? "Connection error" : loading ? "Connecting…" : `${items.length} bulletins live`}</span></section>
      <section className="news-toolbar">
        <input type="search" aria-label="Search news" placeholder="Search title, content, author, tag…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select aria-label="Sort news" value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>
        <button type="button" onClick={() => void specialStory("latest")}>Latest</button><button type="button" onClick={() => void specialStory("random")}>Random</button><button type="button" onClick={() => void loadNews()}>Refresh</button>
      </section>
      {allTags.length > 0 && <div className="news-tag-cloud"><span>Tags</span>{allTags.map((value) => <button className={tag === value ? "active" : ""} type="button" onClick={() => setTag(tag === value ? "" : value)} key={value}>#{value}</button>)}</div>}
      {(query || tag) && <div className="filter-note"><span>{filtered.length} matching bulletin{filtered.length === 1 ? "" : "s"}</span><button type="button" onClick={() => { setQuery(""); setTag(""); }}>Clear filters</button></div>}
      {error && <div className="notice error" role="alert">{error}</div>}
      {loading && <div className="loading-card"><i />Fetching the latest bulletins…</div>}
      {!loading && !error && filtered.length === 0 && <div className="loading-card">No news matched those filters.</div>}
      <section className="news-feed">{filtered.map((item, index) => <NewsCard item={item} featured={index === 0 && !query && !tag && sort === "newest"} onOpen={() => openStory(item)} onTag={setTag} key={String(item.id ?? index)} />)}</section>
      <details className="api-reference"><summary>MAO News API reference</summary><p>Public news data is available at <code>https://api.dungewar.com/news</code>, with <code>/latest</code>, <code>/random</code>, and <code>/:id</code> endpoints.</p></details>
    </Layout>
  );
}
