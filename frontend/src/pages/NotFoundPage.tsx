import { Layout } from "../components/Layout";

export function NotFoundPage() {
  return <Layout><section className="empty-state"><span className="eyebrow">404</span><h1>Nothing lives here.</h1><p>The requested experiment may have escaped.</p><a className="button" href="/index.html">Return home</a></section></Layout>;
}
