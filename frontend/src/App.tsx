import { useEffect } from "react";
import { ArtPage } from "./pages/ArtPage";
import { BlogPage } from "./pages/BlogPage";
import { BorderPage } from "./pages/BorderPage";
import { CalPage } from "./pages/CalPage";
import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { MaxPage, OlgierdPage, QinzhaoPage, RohanPage } from "./pages/PeoplePages";
import { MinesweeperPage } from "./pages/MinesweeperPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PoleandPage } from "./pages/PoleandPage";
import postOne from "./content/post-1.md?raw";
import postTwo from "./content/post-2.md?raw";
import postThree from "./content/post-3.md?raw";

type Route = {
  title: string;
  element: React.ReactNode;
};

const routes: Record<string, Route> = {
  "/": { title: "Dungewar", element: <HomePage /> },
  "/index.html": { title: "Dungewar", element: <HomePage /> },
  "/pages/art-project.html": { title: "Harlem Renaissance Exhibit", element: <ArtPage /> },
  "/pages/border-viewer.html": { title: "MC World Border Viewer", element: <BorderPage /> },
  "/pages/cal-simulator.html": { title: "CAL Simulator", element: <CalPage /> },
  "/pages/chatroom.html": { title: "Talk Room", element: <ChatPage /> },
  "/pages/max-shi.html": { title: "Max Shi", element: <MaxPage /> },
  "/pages/minesweeper/minesweeper.html": { title: "Minesweeper", element: <MinesweeperPage /> },
  "/pages/olgierd-matusiewicz.html": { title: "Olgierd Matusiewicz", element: <OlgierdPage /> },
  "/pages/poleand_game.html": { title: "Poleand Game", element: <PoleandPage /> },
  "/pages/qinzhao-li.html": { title: "Qinzhao Li", element: <QinzhaoPage /> },
  "/pages/rohan-nadkarni.html": { title: "Rohan Nadkarni", element: <RohanPage /> },
  "/pages/blog-files/post-1/post-1.html": {
    title: "Cheese 1 — Backend Debugging",
    element: <BlogPage markdown={postOne} assetBase="/assets/blog/post-1/" />,
  },
  "/pages/blog-files/post-2/post-2.html": {
    title: "Cheese 2 — Making the Server",
    element: <BlogPage markdown={postTwo} assetBase="/assets/blog/post-2/" />,
  },
  "/pages/blog-files/post-3/post-3.html": {
    title: "My Attempt at Physics Simulation",
    element: <BlogPage markdown={postThree} assetBase="/assets/blog/post-3/" />,
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
