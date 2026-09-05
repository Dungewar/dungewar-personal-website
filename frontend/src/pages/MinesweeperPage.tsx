import { MouseEvent, useMemo, useState } from "react";
import { Layout } from "../components/Layout";

type Cell = { bomb: boolean; revealed: boolean; flagged: boolean };
type GameState = "ready" | "playing" | "won" | "lost";

const SIZE = 12;
const BOMB_COUNT = 22;

const blankBoard = (): Cell[] => Array.from({ length: SIZE * SIZE }, () => ({ bomb: false, revealed: false, flagged: false }));
const rowOf = (index: number) => Math.floor(index / SIZE);
const colOf = (index: number) => index % SIZE;

function neighbors(index: number): number[] {
  const row = rowOf(index);
  const col = colOf(index);
  const result: number[] = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if ((rowOffset || colOffset) && nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE) {
        result.push(nextRow * SIZE + nextCol);
      }
    }
  }
  return result;
}

function addBombs(cells: Cell[], safeIndex: number): Cell[] {
  const excluded = new Set([safeIndex, ...neighbors(safeIndex)]);
  const candidates = cells.map((_, index) => index).filter((index) => !excluded.has(index));
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [candidates[index], candidates[randomIndex]] = [candidates[randomIndex], candidates[index]];
  }
  const next = cells.map((cell) => ({ ...cell }));
  candidates.slice(0, BOMB_COUNT).forEach((index) => { next[index].bomb = true; });
  return next;
}

function adjacentBombs(cells: Cell[], index: number): number {
  return neighbors(index).filter((neighbor) => cells[neighbor].bomb).length;
}

function revealArea(cells: Cell[], start: number): Cell[] {
  const next = cells.map((cell) => ({ ...cell }));
  const queue = [start];
  const visited = new Set<number>();
  while (queue.length) {
    const index = queue.shift();
    if (index === undefined || visited.has(index)) continue;
    visited.add(index);
    if (next[index].flagged) continue;
    next[index].revealed = true;
    if (!next[index].bomb && adjacentBombs(next, index) === 0) {
      queue.push(...neighbors(index).filter((neighbor) => !next[neighbor].revealed));
    }
  }
  return next;
}

export function MinesweeperPage() {
  const [cells, setCells] = useState<Cell[]>(blankBoard);
  const [state, setState] = useState<GameState>("ready");
  const flags = useMemo(() => cells.filter((cell) => cell.flagged).length, [cells]);

  const reset = () => {
    setCells(blankBoard());
    setState("ready");
  };

  const reveal = (index: number) => {
    if (state === "lost" || state === "won" || cells[index].flagged || cells[index].revealed) return;
    const seeded = state === "ready" ? addBombs(cells, index) : cells;
    if (seeded[index].bomb) {
      setCells(seeded.map((cell) => cell.bomb ? { ...cell, revealed: true } : cell));
      setState("lost");
      return;
    }
    const next = revealArea(seeded, index);
    const won = next.every((cell) => cell.bomb || cell.revealed);
    setCells(won ? next.map((cell) => cell.bomb ? { ...cell, flagged: true } : cell) : next);
    setState(won ? "won" : "playing");
  };

  const toggleFlag = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    if (state === "lost" || state === "won" || cells[index].revealed) return;
    setCells((current) => current.map((cell, cellIndex) => cellIndex === index ? { ...cell, flagged: !cell.flagged } : cell));
  };

  return (
    <Layout wide>
      <section className="page-hero compact game-heading">
        <div><p className="eyebrow">React edition</p><h1>Minesweeper</h1></div>
        <div className="mine-stats"><span>{BOMB_COUNT - flags} mines</span><button type="button" onClick={reset}>New board</button></div>
      </section>
      <section className="mine-wrap">
        <p className={`game-message ${state}`}>
          {state === "ready" && "Pick a square. The first click is always safe."}
          {state === "playing" && "Left-click to dig. Right-click to flag."}
          {state === "won" && "Board cleared. Suspiciously competent."}
          {state === "lost" && "That one was, unfortunately, a mine."}
        </p>
        <div className="mine-board" role="grid" aria-label="Minesweeper board">
          {cells.map((cell, index) => {
            const count = cell.revealed && !cell.bomb ? adjacentBombs(cells, index) : 0;
            const content = cell.flagged ? "⚑" : cell.revealed && cell.bomb ? "✹" : count || "";
            return (
              <button
                type="button"
                role="gridcell"
                className={`mine-cell ${cell.revealed ? "revealed" : ""} n${count}`}
                aria-label={`Row ${rowOf(index) + 1}, column ${colOf(index) + 1}${cell.flagged ? ", flagged" : ""}`}
                key={index}
                onClick={() => reveal(index)}
                onContextMenu={(event) => toggleFlag(event, index)}
              >{content}</button>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
