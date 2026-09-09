"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Brain,
  Gamepad2,
  MousePointerClick,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";

type GameId = "reaction" | "clickrush" | "memory";

const GAMES: { id: GameId; label: string; icon: typeof Zap; blurb: string }[] = [
  { id: "reaction", label: "Reaction Time", icon: Zap, blurb: "How fast are your reflexes?" },
  { id: "clickrush", label: "Click Rush", icon: MousePointerClick, blurb: "Most clicks in 5 seconds." },
  { id: "memory", label: "Memory Sequence", icon: Brain, blurb: "Repeat the growing pattern." },
];

export function FunArcade() {
  const [active, setActive] = useState<GameId>("reaction");

  return (
    <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
      <div className="mb-8 flex flex-wrap gap-3">
        {GAMES.map((game) => {
          const Icon = game.icon;
          const selected = game.id === active;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setActive(game.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                  : "border-white/10 bg-white/5 text-silver-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {game.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-900/40 p-6 shadow-2xl shadow-black/30 sm:p-10">
        {active === "reaction" && <ReactionGame />}
        {active === "clickrush" && <ClickRushGame />}
        {active === "memory" && <MemoryGame />}
      </div>
    </section>
  );
}

function GameHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Zap;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-silver-400">{subtitle}</p>
    </div>
  );
}

function BestBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold text-amber-300">
      <Trophy className="h-4 w-4" />
      {label}: {value}
    </div>
  );
}

type ReactionState = "idle" | "waiting" | "ready" | "result" | "tooSoon";

function ReactionGame() {
  const [state, setState] = useState<ReactionState>("idle");
  const [reaction, setReaction] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef<number>(0);

  const clearPending = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearPending, [clearPending]);

  const arm = useCallback(() => {
    clearPending();
    setReaction(null);
    setState("waiting");
    const delay = 1200 + Math.random() * 2800;
    timeoutRef.current = setTimeout(() => {
      startedAtRef.current = performance.now();
      setState("ready");
    }, delay);
  }, [clearPending]);

  const handleClick = useCallback(() => {
    if (state === "idle" || state === "result" || state === "tooSoon") {
      arm();
      return;
    }
    if (state === "waiting") {
      clearPending();
      setState("tooSoon");
      return;
    }
    if (state === "ready") {
      const elapsed = Math.round(performance.now() - startedAtRef.current);
      setReaction(elapsed);
      setBest((prev) => (prev === null ? elapsed : Math.min(prev, elapsed)));
      setState("result");
    }
  }, [state, arm, clearPending]);

  const surface = {
    idle: { className: "bg-navy-800 hover:bg-navy-700", text: "Click to start" },
    waiting: { className: "bg-rose-600", text: "Wait for green..." },
    ready: { className: "bg-emerald-500", text: "CLICK NOW!" },
    result: {
      className: "bg-accent hover:bg-accent-hover",
      text: `${reaction} ms - click to try again`,
    },
    tooSoon: {
      className: "bg-amber-500 hover:bg-amber-400",
      text: "Too soon! Click to retry",
    },
  }[state];

  return (
    <div>
      <GameHeader
        icon={Zap}
        title="Reaction Time"
        subtitle="Wait for the panel to turn green, then click as fast as you can."
      />
      <button
        type="button"
        onClick={handleClick}
        aria-label="Reaction game panel"
        className={`flex h-64 w-full select-none items-center justify-center rounded-2xl text-xl font-bold text-white transition-colors ${surface.className}`}
      >
        {surface.text}
      </button>
      <div className="mt-6 flex items-center justify-center">
        {best !== null ? (
          <BestBadge label="Best" value={`${best} ms`} />
        ) : (
          <p className="text-sm text-silver-400">No score yet - give it a go!</p>
        )}
      </div>
    </div>
  );
}

type RushState = "idle" | "running" | "done";
const RUSH_SECONDS = 5;

function ClickRushGame() {
  const [state, setState] = useState<RushState>("idle");
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RUSH_SECONDS);
  const [best, setBest] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  const start = useCallback(() => {
    stopTimer();
    setCount(0);
    setTimeLeft(RUSH_SECONDS);
    setState("running");
    const endAt = performance.now() + RUSH_SECONDS * 1000;
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, endAt - performance.now());
      setTimeLeft(remaining / 1000);
      if (remaining <= 0) {
        stopTimer();
        setState("done");
        setCount((final) => {
          setBest((prev) => Math.max(prev, final));
          return final;
        });
      }
    }, 50);
  }, [stopTimer]);

  const handleClick = useCallback(() => {
    if (state === "running") {
      setCount((c) => c + 1);
    }
  }, [state]);

  return (
    <div>
      <GameHeader
        icon={MousePointerClick}
        title="Click Rush"
        subtitle={`Rack up as many clicks as you can in ${RUSH_SECONDS} seconds.`}
      />
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-silver-300">
        <span>
          Clicks: <span className="text-lg font-bold text-white">{count}</span>
        </span>
        <span>
          Time:{" "}
          <span className="text-lg font-bold text-accent">
            {timeLeft.toFixed(1)}s
          </span>
        </span>
      </div>
      {state === "running" ? (
        <button
          type="button"
          onClick={handleClick}
          className="h-64 w-full select-none rounded-2xl bg-accent text-2xl font-black text-white transition-transform active:scale-95"
        >
          CLICK!
        </button>
      ) : (
        <button
          type="button"
          onClick={start}
          className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-navy-800 text-xl font-bold text-white transition-colors hover:bg-navy-700"
        >
          <RotateCcw className="h-8 w-8 text-accent" />
          {state === "done" ? `You scored ${count}! Play again` : "Start"}
        </button>
      )}
      <div className="mt-6 flex items-center justify-center">
        {best > 0 ? (
          <BestBadge label="Best" value={`${best} clicks`} />
        ) : (
          <p className="text-sm text-silver-400">No score yet - start clicking!</p>
        )}
      </div>
    </div>
  );
}

type MemoryState = "idle" | "showing" | "input" | "over";
const PADS = [
  { id: 0, base: "bg-emerald-600", lit: "bg-emerald-300" },
  { id: 1, base: "bg-sky-600", lit: "bg-sky-300" },
  { id: 2, base: "bg-amber-600", lit: "bg-amber-300" },
  { id: 3, base: "bg-rose-600", lit: "bg-rose-300" },
];

function MemoryGame() {
  const [state, setState] = useState<MemoryState>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [best, setBest] = useState(0);
  const inputIndexRef = useRef(0);
  const cancelledRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    cancelledRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const wait = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, ms);
      timersRef.current.push(timer);
    });
  }, []);

  const playSequence = useCallback(
    async (seq: number[]) => {
      setState("showing");
      await wait(600);
      for (const pad of seq) {
        if (cancelledRef.current) return;
        setActivePad(pad);
        await wait(420);
        if (cancelledRef.current) return;
        setActivePad(null);
        await wait(180);
      }
      if (cancelledRef.current) return;
      inputIndexRef.current = 0;
      setState("input");
    },
    [wait],
  );

  const startRound = useCallback(
    (seq: number[]) => {
      cancelledRef.current = false;
      timersRef.current = [];
      setLevel(seq.length);
      void playSequence(seq);
    },
    [playSequence],
  );

  const start = useCallback(() => {
    clearTimers();
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    startRound(first);
  }, [clearTimers, startRound]);

  const handlePad = useCallback(
    (padId: number) => {
      if (state !== "input") return;
      const expected = sequence[inputIndexRef.current];
      setActivePad(padId);
      const flash = setTimeout(() => setActivePad(null), 160);
      timersRef.current.push(flash);

      if (padId !== expected) {
        clearTimers();
        cancelledRef.current = false;
        setBest((prev) => Math.max(prev, sequence.length - 1));
        setState("over");
        return;
      }

      inputIndexRef.current += 1;
      if (inputIndexRef.current === sequence.length) {
        const next = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(next);
        startRound(next);
      }
    },
    [state, sequence, clearTimers, startRound],
  );

  const statusText =
    state === "showing"
      ? "Watch the pattern..."
      : state === "input"
        ? "Your turn - repeat it!"
        : state === "over"
          ? `Game over - you reached level ${sequence.length - 1}`
          : "Press Start to play";

  return (
    <div>
      <GameHeader
        icon={Brain}
        title="Memory Sequence"
        subtitle="Watch the pattern light up, then repeat it. It gets one longer each round."
      />
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-silver-300">
        <span>
          Level: <span className="text-lg font-bold text-white">{level}</span>
        </span>
        <span className="text-silver-400">{statusText}</span>
      </div>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            type="button"
            disabled={state !== "input"}
            onClick={() => handlePad(pad.id)}
            aria-label={`Memory pad ${pad.id + 1}`}
            className={`h-28 rounded-2xl transition-colors duration-150 disabled:cursor-not-allowed ${
              activePad === pad.id ? pad.lit : pad.base
            } ${state === "input" ? "hover:opacity-90" : "opacity-80"}`}
          />
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-4">
        {(state === "idle" || state === "over") && (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            <RotateCcw className="h-4 w-4" />
            {state === "over" ? "Play again" : "Start"}
          </button>
        )}
        {best > 0 && <BestBadge label="Best level" value={`${best}`} />}
      </div>
    </div>
  );
}
