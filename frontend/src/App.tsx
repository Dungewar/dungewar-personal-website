import { useEffect } from "react";
import { ArtPage } from "./pages/ArtPage";
import { BlogPage } from "./pages/BlogPage";
import { CalPage } from "./pages/CalPage";
import { CastPage } from "./pages/CastPage";
import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { AneeshPage } from "./pages/AneeshPage";
import { MaxPage, OlgierdPage, QinzhaoPage, RohanPage } from "./pages/PeoplePages";
import { MinesweeperPage } from "./pages/MinesweeperPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PoleandPage } from "./pages/PoleandPage";
import { SharvilPage } from "./pages/SharvilPage";
import { XkcdPage } from "./pages/XkcdPage";
import postOne from "./content/post-1.md?raw";
import postTwo from "./content/post-2.md?raw";

type Route = {
  title: string;
  element: React.ReactNode;
};

const routes: Record<string, Route> = {
  "/": { title: "Dungewar", element: <HomePage /> },
  "/index.html": { title: "Dungewar", element: <HomePage /> },
  "/pages/aneesh-raghavan.html": { title: "Aneesh Raghavan", element: <AneeshPage /> },
  "/pages/art-project.html": { title: "Harlem Renaissance Exhibit", element: <ArtPage /> },
  "/pages/cal-simulator.html": { title: "CAL Simulator", element: <CalPage /> },
  "/pages/cast.html": { title: "The Cast", element: <CastPage /> },
  "/pages/chatroom.html": { title: "Talk Room", element: <ChatPage /> },
  "/pages/max-shi.html": { title: "Max Shi", element: <MaxPage /> },
  "/pages/minesweeper/minesweeper.html": { title: "Minesweeper", element: <MinesweeperPage /> },
  "/pages/olgierd-matusiewicz.html": { title: "Olgierd Matusiewicz", element: <OlgierdPage /> },
  "/pages/poleand_game.html": { title: "Poleand Game", element: <PoleandPage /> },
  "/pages/qinzhao-li.html": { title: "Qinzhao Li", element: <QinzhaoPage /> },
  "/pages/rohan-nadkarni.html": { title: "Rohan Nadkarni", element: <RohanPage /> },
  "/pages/sharvil.html": { title: "Sharvil", element: <SharvilPage /> },
  "/pages/news.html": { title: "MAO News", element: <NewsPage /> },
  "/pages/xkcd.html": { title: "Top XKCD Comics", element: <XkcdPage /> },
  "/pages/blog-files/post-1/post-1.html": {
    title: "Cheese 1 — Backend Debugging",
    element: <BlogPage markdown={postOne} assetBase="/assets/blog/post-1/" />,
  },
  "/pages/blog-files/post-2/post-2.html": {
    title: "Cheese 2 — Making the Server",
    element: <BlogPage markdown={postTwo} assetBase="/assets/blog/post-2/" />,
  },
};

export function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const route = routes[path];

  useEffect(() => {
    document.title = route?.title ?? "Page not found — Dungewar";
  }, [route]);

  return route?.element ?? <NotFoundPage />;
}
