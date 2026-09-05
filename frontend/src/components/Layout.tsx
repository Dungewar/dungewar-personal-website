import { ReactNode } from "react";
import { Navbar } from "./Navbar";

type LayoutProps = {
  children: ReactNode;
  wide?: boolean;
};

export function Layout({ children, wide = false }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className={wide ? "page-shell page-shell-wide" : "page-shell"}>{children}</main>
      <footer className="site-footer">
        <span>Built by Olgierd Matusiewicz</span>
        <span>Games, experiments, and field notes</span>
      </footer>
    </>
  );
}
