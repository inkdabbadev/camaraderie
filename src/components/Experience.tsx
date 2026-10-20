"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  Flower2,
  Gift as GiftIcon,
  Heart,
  PawPrint,
  ShieldAlert,
  X,
} from "lucide-react";
import { Gift, Muffy, PixelIcon } from "./Art";
import { Arcade, Awards, Maze, Shredder } from "./Games";
import NonsensePop from "./NonsensePop";
const missions = [
  {
    name: "The Nonsense Shredder",
    tag: "A LITTLE DESTRUCTION",
    title: "Some things are better left shredded.",
    desc: "A safe space for unsafe amounts of fictional workplace nonsense.",
    color: "peach",
    icon: "✂",
  },
  {
    name: "Agent Muffy’s Rescue",
    tag: "A VERY GOOD BOY",
    title: "A very important Labrador has been deployed.",
    desc: "Three missing happiness tokens. Four paws. Absolutely no qualifications.",
    color: "mint",
    icon: "♧",
  },
  {
    name: "Pop the Nonsense",
    tag: "FRUSTRATION: DEFLATED",
    title: "Big feelings. Tiny bubbles. POP.",
    desc: "Thirty seconds to turn irritating phrases into deeply satisfying pixel explosions.",
    color: "yellow",
    icon: "♨",
  },
  {
    name: "Compliment Chaos",
    tag: "AN EGO BOOST, PROBABLY",
    title: "Catch compliments. Dodge nonsense.",
    desc: "Thirty seconds of highly biased positive reinforcement.",
    color: "lavender",
    icon: "✦",
  },
  {
    name: "The Excellence Awards",
    tag: "RIGGED IN YOUR FAVOUR",
    title: "The results are in. The jury was extremely biased.",
    desc: "An evening of outstanding achievements, held at whatever time it is.",
    color: "pink",
    icon: "♛",
  },
];
const messages = [
  "Breaking news: Local designer continues to be iconic.",
  "Your presence has been rated 11/10 by an extremely biased Labrador.",
  "Congratulations. You have survived another interaction with humanity.",
  "Creative genius detected. Agent Muffy has been notified.",
];
function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 38 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            background: ["#ff2b9e", "#a2ff00", "#7855ff", "#fff400"][i % 4],
            animationDelay: `${(i % 9) * 0.08}s`,
            transform: `rotate(${i * 13}deg)`,
          }}
        />
      ))}
    </div>
  );
}
function certificate() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, 1600, 1100);
  ctx.strokeStyle = "#ff2b9e";
  ctx.lineWidth = 5;
  ctx.strokeRect(45, 45, 1510, 1010);
  ctx.strokeRect(63, 63, 1474, 974);
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff400";
  ctx.font = "22px Pixel";
  ctx.fillText("THE MADAM JI BOX™", 800, 150);
  ctx.font = "48px Pixel";
  ctx.fillText("Official Madam Ji", 800, 280);
  ctx.fillText("Certificate of Excellence", 800, 355);
  ctx.fillStyle = "#ff2b9e";
  ctx.font = "82px Pixel";
  ctx.fillText("Aarushi", 800, 510);
  ctx.fillStyle = "#f5f5e8";
  ctx.font = "40px Terminal";
  ctx.fillText("For outstanding services to creativity, matcha,", 800, 610);
  ctx.fillText("and tolerating an extremely annoying intern.", 800, 660);
  ctx.font = "34px Terminal";
  ctx.fillText(
    "All five missions completed. All nonsense thoroughly investigated.",
    800,
    765,
  );
  ctx.fillText("Signed: Bhuvi, Extremely Overqualified Intern", 800, 880);
  ctx.fillStyle = "#a2ff00";
  ctx.font = "32px Terminal";
  ctx.fillText("Countersigned by Agent Muffy (with a paw).", 800, 930);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Madam-Ji-Certificate-of-Excellence.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, "image/png");
}
export default function Experience() {
  const [scene, setScene] = useState(-1);
  const [alert, setAlert] = useState(false);
  const [suspicious, setSuspicious] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [celebrate, setCelebrate] = useState(0);
  const [opened, setOpened] = useState(false);
  const [unwrapping, setUnwrapping] = useState(false);
  useEffect(() => {
    if (!unwrapping) return;
    const timer = setTimeout(() => {
      setOpened(true);
      setUnwrapping(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [unwrapping]);
  const logoClicks = useRef(0);
  const boops = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("madam-ji-v1") || "null");
      if (data) {
        if (Array.isArray(data.completed))
          setCompleted([
            ...new Set<number>(
              data.completed.filter(
                (x: unknown) =>
                  typeof x === "number" &&
                  Number.isInteger(x) &&
                  x >= 0 &&
                  x < 5 &&
                  (x !== 2 || data.missionSet === "pop-v1"),
              ),
            ),
          ]);
        if (Number.isInteger(data.scene) && data.scene >= -1 && data.scene <= 5)
          setScene(data.scene);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "madam-ji-v1",
          JSON.stringify({ completed, scene, missionSet: "pop-v1" }),
        );
      } catch {}
  }, [completed, scene, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast, celebrate]);
  useEffect(() => {
    if (ready) heading.current?.focus({ preventScroll: true });
  }, [scene, ready]);
  // Keep the shared game feedback callback silent.
  const sound = useCallback(() => {}, []);
  const happiness = () => {
    setCelebrate((n) => n + 1);
    setToast(messages[Math.floor(Math.random() * messages.length)]);
    sound();
  };
  const boop = () => {
    boops.current++;
    sound();
    setToast(
      boops.current % 3 === 0
        ? "TRIPLE BOOP ACHIEVED. Muffy has activated maximum wiggle."
        : "Boop received. Your application for best human is progressing.",
    );
    if (boops.current % 3 === 0) setCelebrate((n) => n + 1);
  };
  const complete = useCallback(() => {
    setCompleted((prev) => (prev.includes(scene) ? prev : [...prev, scene]));
  }, [scene]);
  const go = (n: number) => {
    setScene(n);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const Games = [Shredder, Maze, NonsensePop, Arcade, Awards];
  const Game = Games[scene];
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <header className="site-header">
          <button
            className="brand"
            onClick={() => {
              go(-1);
              logoClicks.current++;
              if (logoClicks.current % 5 === 0) {
                setToast(
                  "CONFIDENTIAL: The intern spent far too long on this. Please act surprised.",
                );
                setCelebrate((n) => n + 1);
              }
            }}
            aria-label="The Madam Ji Box logo"
            title="Back to the first page"
          >
            <GiftIcon size={23} />
            <span>
              THE MADAM JI BOX<sup>™</sup>
            </span>
          </button>
          <div className="header-right">
            <span className="edition">PLAYER 01 / AARUSHI</span>
          </div>
        </header>
        <div className="console-bar">
          <span>
            <i /> MADAM JI OS <b>v.01</b>
          </span>
          <span>PRODUCTIVITY: DISABLED</span>
          <span className="console-lives" aria-label="Three lives">
            ♥ ♥ ♥
          </span>
        </div>
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() =>
                heading.current?.focus({ preventScroll: true })
              }
            >
              {scene === -1 ? (
                <>
                  <section className="hero">
                    <div className="window-title">
                      <span>SYSTEM / HAPPINESS.EXE</span>
                      <span aria-hidden="true">− □ ×</span>
                    </div>
                    <div className="hero-copy">
                      <div className="eyebrow">
                        <span className="live-dot" /> INCOMING TRANSMISSION FOR
                        PLAYER 01
                      </div>
                      <h1 ref={heading} tabIndex={-1}>
                        Hello,
                        <br />
                        <em>Madam Ji.</em>
                        <span className="title-flower" aria-hidden="true">
                          <PixelIcon type="star" />
                        </span>
                      </h1>
                      <p className="hero-lead">
                        Your regularly scheduled overthinking has been
                        interrupted by an <em>extremely unserious website.</em>
                      </p>
                      <p className="hero-fine">
                        We apologise for the inconvenience. Your thoughts will
                        be returned to you shortly. Probably.
                      </p>
                      <div className="hero-actions">
                        <motion.button
                          animate={suspicious ? { rotate: [0, -2, 2, 0] } : {}}
                          className="primary"
                          onClick={() => {
                            setAlert(true);
                            sound();
                          }}
                        >
                          Fine, what now? <ArrowRight size={18} />
                        </motion.button>
                        <button
                          className="suspicious"
                          onClick={() => setSuspicious(!suspicious)}
                        >
                          I’m suspicious. <span>↗</span>
                        </button>
                      </div>
                      {suspicious && (
                        <p className="suspicious-answer" role="status">
                          Valid concern. This website has absolutely no
                          qualifications to improve your day.
                        </p>
                      )}
                      <div className="hero-meta">
                        <span>
                          <Heart size={13} /> MADE EXCLUSIVELY FOR AARUSHI
                        </span>
                        <span>5–8 MIN OF ABSOLUTELY NOTHING USEFUL</span>
                      </div>
                    </div>
                    <div className="hero-art">
                      <div className="sprite-hud">
                        <span>ITEM 001</span>
                        <span>ULTRA RARE</span>
                      </div>
                      <div className="art-orbit" />
                      <span className="handwritten gift-aside">
                        LOOT BOX DETECTED
                      </span>
                      <div className="main-gift">
                        <Gift />
                      </div>
                      <span className="gift-stamp">
                        +100
                        <br />
                        NONSENSE
                      </span>
                      <div className="muffy-peek">
                        <button aria-label="Boop Muffy’s nose" onClick={boop}>
                          <Muffy />
                        </button>
                        <span className="handwritten">
                          AGENT MUFFY
                          <br />
                          STATUS: GOOD BOY
                        </span>
                      </div>
                      <span className="art-label">
                        PRESS START. OVERTHINK LATER.
                      </span>
                    </div>
                  </section>
                  <section className="inside-section">
                    <div className="section-heading">
                      <div>
                        <span className="eyebrow">
                          SELECT YOUR STAGE / 05 MISSIONS LOADED
                        </span>
                        <h2>
                          Small missions. <em>Big nonsense.</em>
                        </h2>
                      </div>
                      <span className="handwritten">ALL STAGES UNLOCKED ↓</span>
                    </div>
                    <div className="mission-teasers">
                      {missions.map((m, i) => (
                        <button
                          key={m.name}
                          className={`teaser ${m.color}`}
                          onClick={() => {
                            go(i);
                            sound();
                          }}
                        >
                          <span className="teaser-top">
                            0{i + 1}
                            <span>↗</span>
                          </span>
                          <div className="teaser-illustration">
                            {i === 1 ? (
                              <Muffy />
                            ) : i === 2 ? (
                              <span className="pop-preview" aria-hidden="true">
                                POP!
                              </span>
                            ) : i === 0 ? (
                              <PixelIcon type="shred" />
                            ) : i === 3 ? (
                              <PixelIcon type="star" />
                            ) : (
                              <PixelIcon type="trophy" />
                            )}
                          </div>
                          <h3>{m.name}</h3>
                          <p>{m.tag}</p>
                          <span className="stage-enter">
                            {completed.includes(i) ? "✓ CLEARED" : "PLAY STAGE"}{" "}
                            <span>▶</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                  <div className="bottom-note">
                    <Flower2 size={19} />
                    <span>
                      No life lessons. No pressure. Just a tiny break from
                      everything.
                    </span>
                    <Flower2 size={19} />
                  </div>
                </>
              ) : scene < 5 ? (
                <section className="mission-scene">
                  <div className="mission-nav">
                    <button className="text-button" onClick={() => go(-1)}>
                      <ArrowLeft size={15} /> Back to the box
                    </button>
                    <span>{completed.length} / 5 LITTLE JOYS COLLECTED</span>
                  </div>
                  <nav className="progress-track" aria-label="Missions">
                    {missions.map((m, i) => (
                      <button
                        key={i}
                        className={`${scene === i ? "active" : ""} ${completed.includes(i) ? "complete" : ""}`}
                        aria-label={`Mission ${i + 1}: ${m.name}${completed.includes(i) ? ", complete" : ""}`}
                        aria-current={scene === i ? "step" : undefined}
                        onClick={() => go(i)}
                      >
                        <span>
                          {completed.includes(i) ? (
                            <Check size={14} />
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </span>
                        <small>{m.name}</small>
                      </button>
                    ))}
                  </nav>
                  <div className="mission-heading">
                    <span className="eyebrow">
                      MISSION 0{scene + 1} / {missions[scene].tag}
                    </span>
                    <h1 ref={heading} tabIndex={-1}>
                      {missions[scene].title}
                    </h1>
                    <p>{missions[scene].desc}</p>
                  </div>
                  <div className={`game-panel ${missions[scene].color}`}>
                    <Game onComplete={complete} sound={sound} boop={boop} />
                  </div>
                  <div className="mission-bottom">
                    {completed.includes(scene) ? (
                      <>
                        <p>
                          <Check size={17} />
                          {scene === 0
                            ? "Congratulations. You have successfully accomplished absolutely nothing. We’re proud of you."
                            : "A little joy, successfully collected."}
                        </p>
                        <button
                          className="primary"
                          onClick={() => go(scene + 1)}
                        >
                          {scene === 4
                            ? "Open the final gift"
                            : "Proceed to more nonsense"}{" "}
                          <ArrowRight size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span>No pressure. Even the fun is optional.</span>
                        <button
                          className="text-button"
                          onClick={() => go(scene + 1)}
                        >
                          {scene === 4
                            ? "Skip to the tiny note"
                            : "Skip this mission"}{" "}
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </section>
              ) : (
                <section className="final-scene">
                  <span className="eyebrow">ONE LAST UNNECESSARY THING</span>
                  <h1 ref={heading} tabIndex={-1}>
                    A tiny note.
                    <br />
                    <em>Just for you.</em>
                  </h1>
                  {!opened ? (
                    <>
                      <button
                        className="final-gift"
                        disabled={unwrapping}
                        onClick={() => {
                          setUnwrapping(true);
                          setCelebrate((n) => n + 1);
                          sound();
                        }}
                        aria-label="Open your final gift"
                      >
                        <Gift open={unwrapping} />
                      </button>
                      <p className="handwritten">
                        tap to unwrap the last bit of nonsense ↑
                      </p>
                    </>
                  ) : (
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="letter"
                    >
                      <span className="letter-flower">✳</span>
                      <p>
                        Hey madam ji, I’m so sorry I went into diplomatic,
                        problem-solving mode when what you needed was for me to
                        fully trash Muskaan with you 😭
                      </p>
                      <p>
                        But seriously, you’ve evolved so much since the last
                        time something like this happened. You’re so much more
                        mindful now, and you already know what feels right. So
                        please don’t overthink yourself into a spiral, okay?
                      </p>
                      <p>
                        And hey: <strong>MUSKAAN IS AN ASSHOLE.</strong>
                      </p>
                      <p>
                        What she did doesn’t define you, and it definitely
                        doesn’t define Ru Collective. You’re still you, you’re
                        still brilliant, and Ru is still very much <em>your</em>{" "}
                        thing. Now drink some water, take one deep breath, and
                        let Madame Ji’s very unofficial emotional-support
                        department handle the rest 🫡
                      </p>
                      <p>
                        And I really miss you, dude! Sending you the biggest hug
                        🫂 Hold onto Muffy for me until I see you. xoxo
                      </p>
                      <p>
                        <strong>With questionable professionalism,</strong>
                      </p>
                      <p>
                        Your extremely overqualified intern,
                        <br />
                        <span className="signature">Bhuvi.</span>
                      </p>
                      <p className="ps">
                        P.S. This website has absolutely no business existing.
                        Much like half the meetings we attend.
                      </p>
                    </motion.article>
                  )}
                  {opened && (
                    <a
                      className="primary whatsapp-link"
                      href={`https://wa.me/919940183984?text=${encodeURIComponent("BHUVI YOU ARE THE BEST")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Talk to Bhuvi about the site? (opens WhatsApp in a new tab)"
                    >
                      Talk to Bhuvi about the site?
                      <span>OPEN IN WHATSAPP</span>
                    </a>
                  )}
                  <p className="small-note">
                    No reply required. This website will now return to being
                    completely unnecessary.
                  </p>
                  <div className="final-actions">
                    <button className="primary" onClick={boop}>
                      <PawPrint size={17} /> Boop Muffy one last time
                    </button>
                    <button
                      className="text-button"
                      onClick={() => {
                        setOpened(false);
                        go(-1);
                      }}
                    >
                      Replay the nonsense ↻
                    </button>
                  </div>
                  {completed.length === 5 ? (
                    <button className="certificate" onClick={certificate}>
                      <Download size={18} /> Download your Official Certificate
                      of Excellence
                    </button>
                  ) : (
                    <button
                      className="text-button"
                      onClick={() =>
                        go(
                          [0, 1, 2, 3, 4].find((i) => !completed.includes(i)) ??
                            0,
                        )
                      }
                    >
                      Complete all five missions to unlock your certificate →
                    </button>
                  )}
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="console-power">
          <span>JOY COLLECTION</span>
          <div
            className="pixel-battery"
            role="progressbar"
            aria-label="Completed missions"
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={completed.length}
          >
            <i style={{ width: `${completed.length * 20}%` }} />
          </div>
          <span>{completed.length} / 5</span>
        </div>
        <footer>
          <span>
            Made with questionable professionalism and excessive affection.
          </span>
          <span>
            BY BHUVI, YOUR EXTREMELY OVERQUALIFIED INTERN <Heart size={12} />
          </span>
        </footer>
        <button
          className="emergency"
          onClick={happiness}
          aria-label="Emergency happiness button"
        >
          <PawPrint size={22} />
          <span>
            EMERGENCY
            <br />
            HAPPINESS
          </span>
        </button>
        <AnimatePresence>
          {toast && (
            <motion.div
              className="happiness-toast"
              role="status"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div key={celebrate} className={celebrate ? "dancing-muffy" : ""}>
                <Muffy />
              </div>
              <p>{toast}</p>
              <button
                className="icon-button"
                aria-label="Dismiss message"
                onClick={() => setToast("")}
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {celebrate > 0 && <Confetti key={celebrate} />}
        {alert && (
          <div className="modal-backdrop">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="alert-title"
              className="system-alert"
              onKeyDown={(e) => {
                if (e.key === "Escape") setAlert(false);
                if (e.key === "Tab") e.preventDefault();
              }}
            >
              <ShieldAlert size={40} />
              <span className="eyebrow">
                DEPARTMENT OF UNNECESSARY INTERVENTIONS
              </span>
              <h2 id="alert-title">System alert!</h2>
              <p>Madam Ji has entered a strictly no-overthinking zone.</p>
              <p className="small-note">
                Any attempts to be productive will be reported to Agent Muffy.
              </p>
              <button
                autoFocus
                className="primary"
                onClick={() => {
                  setAlert(false);
                  go(0);
                }}
              >
                Accept my fate <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
