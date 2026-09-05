import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const page = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: page("./index.html"),
        aneesh: page("./pages/aneesh-raghavan.html"),
        art: page("./pages/art-project.html"),
        cal: page("./pages/cal-simulator.html"),
        cast: page("./pages/cast.html"),
        chat: page("./pages/chatroom.html"),
        max: page("./pages/max-shi.html"),
        minesweeper: page("./pages/minesweeper/minesweeper.html"),
        olgierd: page("./pages/olgierd-matusiewicz.html"),
        poleand: page("./pages/poleand_game.html"),
        qinzhao: page("./pages/qinzhao-li.html"),
        rohan: page("./pages/rohan-nadkarni.html"),
        sharvil: page("./pages/sharvil.html"),
        news: page("./pages/news.html"),
        xkcd: page("./pages/xkcd.html"),
        blogOne: page("./pages/blog-files/post-1/post-1.html"),
        blogTwo: page("./pages/blog-files/post-2/post-2.html"),
      },
    },
  },
});
