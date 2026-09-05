import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";

type Comic = { num: number; title: string; img: string; alt: string };

const comicIds = [699, 1604, 795, 1174, 784, 1984, 530, 2473, 1746, 1806, 749, 1943, 1535, 2494, 792, 1985, 569, 327, 1763, 838, 2839, 2948, 1657];

export function XkcdPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(comicIds.map(async (id) => {
      const response = await fetch(`https://xkcd.vercel.app/?comic=${id}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Comic ${id} failed with ${response.status}`);
      return response.json() as Promise<Comic>;
    })).then(setComics).catch((reason: unknown) => {
      if (!(reason instanceof DOMException && reason.name === "AbortError")) {
        console.error("Unable to load XKCD comics", reason);
        setError("The comics could not be loaded. The ranking remains correct.");
      }
    });
    return () => controller.abort();
  }, []);

  return (
    <Layout>
      <section className="page-hero xkcd-heading">
        <p className="eyebrow">According to me</p>
        <h1>Top XKCD comics</h1>
        <p>A definitive list assembled with no methodology whatsoever.</p>
      </section>
      {error && <div className="notice error" role="alert">{error}</div>}
      {!error && comics.length === 0 && <div className="loading-card"><i />Loading comics…</div>}
      <section className="comic-list">
        {comics.map((comic, index) => (
          <article className="comic-card" key={comic.num}>
            <header><span>#{String(index + 1).padStart(2, "0")}</span><h2>{comic.num}: {comic.title}</h2></header>
            <a href={`https://xkcd.com/${comic.num}/`} target="_blank" rel="noreferrer">
              <img src={comic.img} alt={comic.alt} title={comic.alt} loading="lazy" />
            </a>
            <p>{comic.alt}</p>
          </article>
        ))}
      </section>
    </Layout>
  );
}
