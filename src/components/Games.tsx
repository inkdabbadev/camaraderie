"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Muffy, PixelIcon } from "./Art";
import { BAD, catches, GOOD, HAZARDS, MAZE, TOKENS } from "@/lib/game";
type Props = { onComplete: () => void; sound: () => void; boop: () => void };
export function Shredder({ onComplete, sound }: Props) {
  const slips = [
    "camaraderie",
    "CAPS AND NO CAPS",
    "proofread before sending the final cards?",
    "Can we make the logo bigger?",
    "Just one small change.",
    "Quick 7:30 PM meeting?",
    "Please find attached FINAL_v17.",
    "Can we make it pop?",
    "This will take only five minutes.",
    "Unsolicited opinions.",
  ];
  const [used, setUsed] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(
    "Drag a slip into the slot. Or select a slip and press ‘Shred this slip’.",
  );
  const target = useRef<HTMLButtonElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const selectSlip = (i: number) => {
    setSelected(i);
    setFeedback("Slip selected. Press ‘Shred this slip’ or tap the machine.");
  };
  const shred = (i: number) => {
    if (used.includes(i)) return;
    const next = [...used, i];
    setUsed(next);
    setSelected(null);
    sound();
    setFeedback(
      [
        "This meeting could have been confetti.",
        "Your request has been forwarded to absolutely nobody.",
        "Now that’s what we call a paper trail.",
      ][next.length % 3],
    );
    if (next.length >= 5) onComplete();
  };
  return (
    <div className="shred-layout">
      <div className="paper-pile">
        {slips.map(
          (s, i) =>
            !used.includes(i) && (
              <motion.button
                key={i}
                drag
                dragSnapToOrigin
                onPointerDown={(event) => {
                  pointerStart.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerUp={(event) => {
                  const start = pointerStart.current;
                  pointerStart.current = null;
                  // A tap must still select immediately after a drag, even
                  // while Motion is suppressing its synthetic click event.
                  if (
                    start &&
                    Math.hypot(
                      event.clientX - start.x,
                      event.clientY - start.y,
                    ) < 8
                  )
                    selectSlip(i);
                }}
                onDragEnd={(event) => {
                  const r = target.current?.getBoundingClientRect();
                  // Both pointer and target must use viewport coordinates,
                  // including when the document has scrolled during a drag.
                  const pointer =
                    "changedTouches" in event ? event.changedTouches[0] : event;
                  if (
                    r &&
                    pointer &&
                    pointer.clientX >= r.left &&
                    pointer.clientX <= r.right &&
                    pointer.clientY >= r.top &&
                    pointer.clientY <= r.bottom
                  )
                    shred(i);
                }}
                onClick={() => selectSlip(i)}
                className={`paper-slip ${selected === i ? "selected" : ""}`}
                style={{ rotate: `${i % 2 ? 3 : -3}deg` }}
                aria-pressed={selected === i}
              >
                {s}
                <span>URGENT-ISH ↗</span>
              </motion.button>
            ),
        )}
        <p className="shred-queue">
          {slips.length - used.length} slips waiting.{" "}
          <span>More appear as you shred.</span>
        </p>
      </div>
      <div className="shred-station">
        <span className="handwritten">insert nonsense here ↓</span>
        <button
          className="primary shred-action"
          disabled={selected === null}
          onClick={() => selected !== null && shred(selected)}
        >
          {selected === null ? "Select a paper slip" : "Shred this slip"}
        </button>
        <button
          ref={target}
          className="shredder"
          onClick={() =>
            selected !== null
              ? shred(selected)
              : setFeedback(
                  "Select a paper slip first, then tap here to shred it.",
                )
          }
          aria-label="Shred selected paper"
        >
          <div className="shred-slot" />
          <span>
            THE NONSENSE
            <br />
            DISPOSAL UNIT
          </span>
          <small>
            EST. JUST NOW <i />
          </small>
          <div className="shred-window">
            {used.map((id) => (
              <div className="strips" key={id}>
                {Array.from({ length: 9 }, (_, j) => (
                  <i
                    key={j}
                    style={{
                      animationDelay: `${j * 0.04}s`,
                      rotate: `${j * 7 - 28}deg`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </button>
        <p className="status" aria-live="polite">
          {feedback}
        </p>
        <span className="pill">
          {used.length} shredded · {Math.max(0, 5 - used.length)} more to
          complete
        </span>
      </div>
    </div>
  );
}
export function Maze({ onComplete, sound, boop }: Props) {
  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [collected, setCollected] = useState<number[]>([]);
  const [dialogue, setDialogue] = useState(
    "Agent Muffy reporting for duty. Human morale appears suspiciously low. Deploying paws.",
  );
  const move = useCallback(
    (dx: number, dy: number) => {
      if (collected.length === 3) return;
      const next = { x: pos.x + dx, y: pos.y + dy };
      if (MAZE[next.y]?.[next.x] !== ".") return;
      const hazard = HAZARDS.find((h) => h.x === next.x && h.y === next.y);
      if (hazard) {
        setDialogue(
          `${hazard.label} detected. Tactical retreat! Your tokens are safe.`,
        );
        setPos({ x: 1, y: 1 });
        return;
      }
      setPos(next);
      const token = TOKENS.findIndex((t) => t.x === next.x && t.y === next.y);
      if (token !== -1 && !collected.includes(token)) {
        const nextCollected = [...collected, token];
        setCollected(nextCollected);
        sound();
        setDialogue(
          nextCollected.length === 3
            ? "Mission successful. Agent Muffy requests payment in treats and unconditional admiration."
            : "Happiness located. Definitely edible. Probably.",
        );
        if (nextCollected.length === 3) onComplete();
      }
    },
    [collected, pos, sound, onComplete],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const dirs: Record<string, number[]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0],
      };
      if (
        dirs[e.key] &&
        !(e.target instanceof HTMLButtonElement && !e.key.startsWith("Arrow"))
      ) {
        e.preventDefault();
        move(dirs[e.key][0], dirs[e.key][1]);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [move]);
  return (
    <div className="maze-layout">
      <div>
        <div
          className="maze"
          role="img"
          aria-label={`Muffy is at column ${pos.x}, row ${pos.y}. ${collected.length} of 3 tokens rescued.`}
        >
          {MAZE.flatMap((row, y) =>
            [...row].map((cell, x) => {
              const token = TOKENS.findIndex((t) => t.x === x && t.y === y);
              const hazard = HAZARDS.find((h) => h.x === x && h.y === y);
              return (
                <div
                  key={`${x}-${y}`}
                  className={cell === "#" ? "hedge" : "path"}
                >
                  {pos.x === x && pos.y === y ? (
                    <Muffy />
                  ) : token !== -1 && !collected.includes(token) ? (
                    TOKENS[token].icon
                  ) : hazard ? (
                    <span title={hazard.label}>☁</span>
                  ) : null}
                </div>
              );
            }),
          )}
        </div>
        <div className="dpad">
          <button aria-label="Move up" onClick={() => move(0, -1)}>
            <ArrowUp />
          </button>
          <div>
            <button aria-label="Move left" onClick={() => move(-1, 0)}>
              <ArrowLeft />
            </button>
            <button aria-label="Move down" onClick={() => move(0, 1)}>
              <ArrowDown />
            </button>
            <button aria-label="Move right" onClick={() => move(1, 0)}>
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
      <div className="agent-panel">
        <button
          className="muffy-boop"
          onClick={boop}
          aria-label="Boop Muffy’s nose"
        >
          <Muffy />
        </button>
        <span className="pill">AGENT MUFFY · GOOD BOY DIVISION</span>
        <p className="dialogue" aria-live="polite">
          “{dialogue}”
        </p>
        <div className="tokens">
          {TOKENS.map((t, i) => (
            <span className={collected.includes(i) ? "found" : ""} key={i}>
              {t.icon}
              {collected.includes(i) && <Check size={13} />}
            </span>
          ))}
        </div>
        <small>
          Arrow keys / WASD or the paw-friendly buttons.
          <br />
          Clouds send Muffy back. Boops are encouraged.
        </small>
      </div>
    </div>
  );
}
type Drop = { id: number; x: number; y: number; good: boolean; text: string };
export function Arcade({ onComplete, sound }: Props) {
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [basket, setBasket] = useState(50);
  const basketRef = useRef(50);
  const state = useRef({
    remaining: 30,
    score: 0,
    drops: [] as Drop[],
    spawn: 0,
    id: 0,
  });
  const field = useRef<HTMLDivElement>(null);
  const keys = useRef(new Set<string>());
  const callbacks = useRef({ onComplete, sound });
  useEffect(() => {
    callbacks.current = { onComplete, sound };
  }, [onComplete, sound]);
  const move = useCallback((x: number) => {
    basketRef.current = Math.max(12, Math.min(88, x));
    setBasket(basketRef.current);
  }, []);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        setRunning(false);
        keys.current.clear();
      }
    };
    const blur = () => {
      setRunning(false);
      keys.current.clear();
    };
    const down = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
        e.preventDefault();
        keys.current.add(e.key);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", blur);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("blur", blur);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = state.current;
      s.remaining = Math.max(0, s.remaining - dt);
      if (keys.current.has("ArrowLeft") || keys.current.has("a"))
        move(basketRef.current - dt * 65);
      if (keys.current.has("ArrowRight") || keys.current.has("d"))
        move(basketRef.current + dt * 65);
      s.spawn += dt;
      if (s.spawn > 0.72) {
        s.spawn = 0;
        const good = Math.random() > 0.28;
        const words = good ? GOOD : BAD;
        s.drops.push({
          id: s.id++,
          x: 15 + Math.random() * 70,
          y: -5,
          good,
          text: words[Math.floor(Math.random() * words.length)],
        });
      }
      s.drops = s.drops.filter((drop) => {
        drop.y += dt * 23;
        if (catches(drop.x, drop.y, basketRef.current)) {
          s.score += drop.good ? 10 : -5;
          callbacks.current.sound();
          return false;
        }
        return drop.y < 103;
      });
      setDrops([...s.drops]);
      setTime(Math.ceil(s.remaining));
      setScore(s.score);
      if (s.remaining <= 0) {
        setRunning(false);
        setDone(true);
        callbacks.current.onComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, move]);
  const start = () => {
    state.current = { remaining: 30, score: 0, drops: [], spawn: 0, id: 0 };
    setScore(0);
    setTime(30);
    setDrops([]);
    setDone(false);
    setStarted(true);
    setRunning(true);
  };
  return (
    <div className="arcade-wrap">
      <div className="arcade-hud">
        <span>
          COMPLIMENT FUND <b>{score} pts</b>
        </span>
        <span className={time < 10 ? "time-low" : ""}>{time}s</span>
        <button
          className="icon-button"
          aria-label={running ? "Pause game" : "Resume game"}
          disabled={!started || done}
          onClick={() => setRunning(!running)}
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
      <div
        ref={field}
        className="arcade-field"
        onPointerDown={(e) => {
          if (!running || (e.target as HTMLElement).closest("button")) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const r = e.currentTarget.getBoundingClientRect();
          move(((e.clientX - r.left) / r.width) * 100);
        }}
        onPointerMove={(e) => {
          if (!running) return;
          if (e.pointerType === "mouse" || e.buttons) {
            const r = e.currentTarget.getBoundingClientRect();
            move(((e.clientX - r.left) / r.width) * 100);
          }
        }}
      >
        {drops.map((d) => (
          <span
            className={`drop ${d.good ? "good" : "bad"}`}
            key={d.id}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.good ? "✦" : "×"} {d.text}
          </span>
        ))}
        <div className="basket" style={{ left: `${basket}%` }}>
          <span>♡</span>
          <small>GOOD STUFF ONLY</small>
        </div>
        {!running && (
          <div className="arcade-overlay">
            {done ? (
              <>
                <PixelIcon type="trophy" />
                <h3>Officially pretty wonderful.</h3>
                <p>
                  {score} points, according to our completely unreliable
                  calculations.
                </p>
                <button className="primary" onClick={start}>
                  <RotateCcw size={16} /> Another round
                </button>
              </>
            ) : (
              <>
                <Sparkles size={36} />
                <h3>
                  {started ? "Nonsense on hold." : "A little ego boost?"}{" "}
                </h3>
                <p>
                  Catch the green compliments (+10).
                  <br />
                  Dodge the pink nonsense (−5).
                </p>
                <button
                  className="primary"
                  onClick={() => (started ? setRunning(true) : start())}
                >
                  {started ? "Resume the chaos" : "Let it rain compliments"} →
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <p className="small-note">
        Move your finger or mouse. Keyboard: ← →. Your game pauses when you
        leave the tab.
      </p>
    </div>
  );
}
export function Awards({ onComplete, sound }: Props) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const awards = [
    "Best Creative Brain in the Room",
    "Most Likely to Be Judged by a Labrador",
    "Lifetime Achievement in Tolerating an Extremely Annoying Intern",
  ];
  return (
    <>
      <div className="award-cards">
        {awards.map((name, i) => (
          <button
            className={`award-card ${revealed.includes(i) ? "revealed" : ""}`}
            key={name}
            onClick={() => {
              if (revealed.includes(i)) return;
              const next = [...revealed, i];
              setRevealed(next);
              sound();
              if (next.length === 3) onComplete();
            }}
            aria-label={revealed.includes(i) ? name : `Reveal award ${i + 1}`}
          >
            <span className="eyebrow">AWARD 0{i + 1}</span>
            <motion.div
              animate={{ rotateY: revealed.includes(i) ? 360 : 0 }}
              transition={{ duration: 0.65 }}
            >
              <PixelIcon type="trophy" />
            </motion.div>
            <h3>{revealed.includes(i) ? name : "And the award goes to…"}</h3>
            <span className="award-caption">
              {revealed.includes(i)
                ? [
                    "“I’d like to thank my 47 open tabs.”",
                    "“The jury requests a biscuit.”",
                    "“Honestly, where is my cash prize?”",
                  ][i]
                : "tap to reveal ↗"}
            </span>
          </button>
        ))}
      </div>
      <p className="small-note">
        The jury was extremely biased. No appeals will be entertained.
      </p>
    </>
  );
}
