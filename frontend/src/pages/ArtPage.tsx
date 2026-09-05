import { useState } from "react";

export function ArtPage() {
  const [creditVisible, setCreditVisible] = useState(false);
  return (
    <main className="museum-page">
      <header className="museum-header">
        <span>Framing our past to create our future</span>
        <h1>The Harlem Renaissance</h1>
        <p>A special presentation of James Weldon Johnson by Laura Wheeler Waring</p>
      </header>
      <article className="museum-card">
        <p className="museum-date">Wednesday, December 17, 2025</p>
        <h2>The Portrait of a Visionary</h2>
        <img src="/assets/images/portrait.png" alt="Portrait of James Weldon Johnson" />
        <p>Join us at <strong>The Metropolitan Museum of Art</strong> for an exclusive viewing of Laura Wheeler Waring’s masterpiece. Explore the intersection of Harlem Renaissance art and African American cultural history through this iconic portrait.</p>
        <aside>
          <h3>Reserve your entry</h3>
          <p>Timed-entry tickets are not required. Standard admission: $0.</p>
          <button type="button" onClick={() => setCreditVisible(true)}>Get tickets now</button>
          {creditVisible && <p className="museum-credit" role="status">Made by Olgierd, because going above and beyond is no barrier.</p>}
        </aside>
      </article>
    </main>
  );
}
