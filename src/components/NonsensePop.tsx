"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PixelIcon } from "./Art";

const PHRASES = [
  "Muskaan, please stop being so annoying.",
  "Muskaan, the drama is exhausting.",
  "Muskaan, your attitude needs a boarding pass.",
  "Muskaan, nobody ordered this turbulence.",
  "Muskaan, please keep your unsolicited opinions in cabin baggage.",
  "Muskaan, ₹500 budget, unlimited complaints.",
  "Muskaan, even the bubble needs a break from you.",
  "Muskaan, this is your sign to log off.",
  "Muskaan, please land the attitude.",
  "Muskaan, you are the delay in everyone’s day.",
  "camaraderie",
  "CAPS AND NO CAPS",
  "proofread before sending the final cards?",
  "Just one small change.",
  "Quick meeting?",
  "Make it pop.",
  "FINAL_final_v29",
  "Unsolicited opinions.",
  "Can you do it today?",
];
const initialBubbles = () =>
  Array.from({ length: 6 }, (_, id) => ({ id, phrase: id, readyAt: 0, earned: 0 }));
export default function NonsensePop({
  onComplete,
  sound,
}: {
  onComplete: () => void;
  sound: () => void;
}) {
  const [phase, setPhase] = useState<"ready" | "playing" | "paused" | "done">(
    "ready",
  );
  const [bubbles, setBubbles] = useState(initialBubbles);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [combo, setCombo] = useState(1);
  const [feedback, setFeedback] = useState(
    "Six bubbles. Thirty seconds. Absolutely no useful outcomes.",
  );
  const model = useRef({
    elapsed: 0,
    score: 0,
    count: 0,
    combo: 0,
    lastPop: -10,
    bubbles: initialBubbles(),
  });
  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    const pause = () => setPhase((p) => (p === "playing" ? "paused" : p));
    const hide = () => {
      if (document.hidden) pause();
    };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  useEffect(() => {
    if (phase !== "playing") return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const m = model.current;
      m.elapsed += Math.min((now - last) / 1000, 0.25);
      last = now;
      setTime(Math.max(0, Math.ceil(30 - m.elapsed)));
      if (m.elapsed - m.lastPop > 1.5) {
        m.combo = 0;
        setCombo(1);
      }
      let changed = false;
      m.bubbles = m.bubbles.map((b) => {
        if (b.readyAt > 0 && b.readyAt <= m.elapsed) {
          changed = true;
          return { ...b, readyAt: 0, phrase: (b.phrase + 3) % PHRASES.length };
        }
        return b;
      });
      if (changed) setBubbles([...m.bubbles]);
      if (m.elapsed >= 30) {
        setPhase("done");
        completeRef.current();
      }
    }, 100);
    return () => clearInterval(timer);
  }, [phase]);
  const start = () => {
    model.current = {
      elapsed: 0,
      score: 0,
      count: 0,
      combo: 0,
      lastPop: -10,
      bubbles: initialBubbles(),
    };
    setBubbles(initialBubbles());
    setTime(30);
    setScore(0);
    setCount(0);
    setCombo(1);
    setFeedback("Pop quickly to build a combo. Up to 5× glorious nonsense.");
    setPhase("playing");
  };
  const pop = (id: number) => {
    const m = model.current;
    if (phase !== "playing" || m.bubbles[id].readyAt > 0) return;
    m.combo = m.elapsed - m.lastPop <= 1.5 ? Math.min(5, m.combo + 1) : 1;
    m.lastPop = m.elapsed;
    m.score += 10 * m.combo;
    m.count++;
    m.bubbles = m.bubbles.map((b) =>
      b.id === id ? { ...b, readyAt: m.elapsed + 0.7, earned: 10 * m.combo } : b,
    );
    setBubbles([...m.bubbles]);
    setScore(m.score);
    setCount(m.count);
    setCombo(m.combo);
    sound();
    setFeedback(
      [
        "Request successfully deleted from the universe.",
        "That meeting is now a small noise.",
        "Poof. A deeply professional response.",
        "Your feedback has been converted into confetti.",
      ][m.count % 4],
    );
  };
  return (
    <div className="pop-game">
      <div className="arcade-hud">
        <span>
          NONSENSE DELETED <b>{score} pts</b>
        </span>
        <span className={time < 10 ? "time-low" : ""}>{time}s</span>
        <button
          className="icon-button"
          aria-label={phase === "playing" ? "Pause popping" : "Resume popping"}
          disabled={phase === "ready" || phase === "done"}
          onClick={() =>
            setPhase((p) => (p === "playing" ? "paused" : "playing"))
          }
        >
          {phase === "playing" ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
      <div className={`pop-arena ${phase !== "playing" ? "pop-still" : ""}`}>
        <div className="pop-grid">
          {bubbles.map((bubble, i) => (
            <button
              key={bubble.id}
              className={`nonsense-bubble bubble-${i % 3} ${PHRASES[bubble.phrase].length > 50 ? "long-phrase" : ""} ${bubble.readyAt ? "popped" : ""}`}
              aria-label={`Pop ${PHRASES[bubble.phrase]}`}
              disabled={phase !== "playing" || bubble.readyAt > 0}
              onClick={() => pop(bubble.id)}
              style={{ animationDelay: `${i * -0.4}s` }}
            >
              <span className="bubble-shine" aria-hidden="true" />
              {bubble.readyAt ? (
                <span className="pop-splat">
                  POP!<small>+{bubble.earned}</small>
                </span>
              ) : (
                <>
                  <span>{PHRASES[bubble.phrase]}</span>
                  <small>POP ME</small>
                </>
              )}
            </button>
          ))}
        </div>
        {phase !== "playing" && (
          <div className="arcade-overlay pop-overlay">
            <PixelIcon type="star" />
            <h3>
              {phase === "ready"
                ? "Pop the nonsense."
                : phase === "paused"
                  ? "Rage break."
                  : "Nonsense: demolished."}
            </h3>
            <p>
              {phase === "ready"
                ? "Tap the bubbles. Stack your combo. Turn irritating phrases into tiny pixel explosions."
                : phase === "paused"
                  ? "Your bubbles can wait. Your score is safe."
                  : `${count} bubbles popped. ${score} points. Zero meetings attended.`}
            </p>
            {phase === "done" && count >= 15 && (
              <span className="pop-badge">★ CERTIFIED NONSENSE POPPER</span>
            )}
            <button
              className="primary"
              onClick={() =>
                phase === "paused" ? setPhase("playing") : start()
              }
            >
              {phase === "done" && <RotateCcw size={16} />}{" "}
              {phase === "ready"
                ? "Start popping"
                : phase === "paused"
                  ? "Resume popping"
                  : "Pop another round"}{" "}
              →
            </button>
          </div>
        )}
      </div>
      <div className="pop-stats">
        <span>{count} POPPED</span>
        <span>COMBO ×{combo}</span>
        <span>15 POPS = SECRET BADGE</span>
      </div>
      <p className="pop-feedback" role="status">
        {feedback}
      </p>
      <p className="small-note">
        Tap or click. Keyboard: Tab, then Enter or Space. Pauses when you leave
        the tab.
      </p>
    </div>
  );
}
