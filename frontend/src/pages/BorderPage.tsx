import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../api";
import { Layout } from "../components/Layout";

type BorderRecord = {
  id: number;
  old_size: number;
  new_size: number;
  duration: number;
  created_at: number;
};

type BorderResponse = { latest_borders: BorderRecord[] };

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor(seconds % 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
}

export function BorderPage() {
  const [border, setBorder] = useState<BorderRecord | null>(null);
  const [now, setNow] = useState(() => Date.now() / 1000);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let timeout: number | undefined;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(apiUrl("/api/mc-world-border"), { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const data = await response.json() as BorderResponse;
        if (active) {
          setBorder(data.latest_borders[0] ?? null);
          setError(data.latest_borders.length ? "" : "The API returned no border history.");
        }
      } catch (reason) {
        if (active && !(reason instanceof DOMException && reason.name === "AbortError")) {
          console.error("Unable to load border data", reason);
          setError("Live border data is temporarily unavailable.");
        }
      } finally {
        if (active) timeout = window.setTimeout(load, 5000);
      }
    };

    void load();
    return () => {
      active = false;
      controller.abort();
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    if (!border) return null;
    const elapsed = Math.max(0, now - border.created_at);
    const progress = border.duration > 0 ? Math.min(elapsed / border.duration, 1) : 1;
    return {
      current: Math.round(border.old_size + (border.new_size - border.old_size) * progress),
      target: Math.round(border.new_size),
      previous: Math.round(border.old_size),
      remaining: formatDuration(Math.max(0, border.duration - elapsed)),
      progress: Math.round(progress * 100),
    };
  }, [border, now]);

  return (
    <Layout>
      <section className="page-hero compact">
        <p className="eyebrow">Minecraft · live telemetry</p>
        <h1>World border</h1>
        <p>Monitoring the slow squeeze, directly from api.dungewar.com.</p>
      </section>
      {error && <div className="notice error" role="alert">{error}</div>}
      <section className="telemetry-card" aria-busy={!stats}>
        <div className="telemetry-primary">
          <span>Current size</span>
          <strong>{stats?.current.toLocaleString() ?? "—"}</strong>
          <small>blocks</small>
        </div>
        <div className="telemetry-grid">
          <div><span>Target</span><strong>{stats?.target.toLocaleString() ?? "—"}</strong></div>
          <div><span>Previous</span><strong>{stats?.previous.toLocaleString() ?? "—"}</strong></div>
          <div><span>Remaining</span><strong>{stats?.remaining ?? "Loading"}</strong></div>
        </div>
        <div className="progress-track" aria-label={`${stats?.progress ?? 0}% complete`}>
          <span style={{ width: `${stats?.progress ?? 0}%` }} />
        </div>
      </section>
    </Layout>
  );
}
