import { useState } from "react";

const primaryLinks = [
  ["Home", "/index.html"],
  ["MAO News", "/pages/news.html"],
  ["Minesweeper", "/pages/minesweeper/minesweeper.html"],
  ["Poleand", "/pages/poleand_game.html"],
  ["XKCD", "/pages/xkcd.html"],
  // ["Cast", "/pages/cast.html"],
  // ["Chatroom", "/pages/chatroom.html"],
] as const;

const blogLinks = [
  ["Cheese 1 — Backend Debugging", "/pages/blog-files/post-1/post-1.html"],
  ["Cheese 2 — Making the Server", "/pages/blog-files/post-2/post-2.html"],
] as const;

export function Navbar() {
  const [blogOpen, setBlogOpen] = useState(false);
  const current = window.location.pathname;

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="wordmark" href="/index.html" aria-label="Dungewar home">
          <span className="wordmark-mark" aria-hidden="true">D</span>
          <span>Dungewar</span>
        </a>
        <div className="nav-links">
          {primaryLinks.slice(1).map(([label, href]) => (
            <a key={href} className={current === href ? "active" : ""} href={href}>{label}</a>
          ))}
          <div className="nav-menu">
            <button
              type="button"
              aria-expanded={blogOpen}
              aria-controls="blog-menu"
              onClick={() => setBlogOpen((open) => !open)}
            >
              Field notes <span aria-hidden="true">{blogOpen ? "↑" : "↓"}</span>
            </button>
            {blogOpen && (
              <div id="blog-menu" className="nav-dropdown">
                {blogLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
