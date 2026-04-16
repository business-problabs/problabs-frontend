"use client";

import { useState, useTransition } from "react";

const GAMES = [
  { id: "pick-3",    label: "Pick 3",    desc: "3 digits, twice daily" },
  { id: "pick-4",    label: "Pick 4",    desc: "4 digits, twice daily" },
  { id: "pick-5",    label: "Pick 5",    desc: "5 digits, twice daily" },
  { id: "fantasy-5", label: "Fantasy 5", desc: "5 numbers, daily" },
  { id: "cash-pop",  label: "Cash Pop",  desc: "1 number, 5× daily" },
];

interface Props {
  initialSubscribed: string[];
}

export default function AlertToggles({ initialSubscribed }: Props) {
  const [subscribed, setSubscribed] = useState<Set<string>>(
    new Set(initialSubscribed)
  );
  const [pending, setIsPending] = useTransition();
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(game: string) {
    const active = !subscribed.has(game);
    setToggling(game);
    setError(null);

    setIsPending(async () => {
      try {
        const resp = await fetch("/api/alerts/subscriptions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game, active }),
        });

        if (resp.status === 403) {
          setError("Pro subscription required.");
          return;
        }
        if (!resp.ok) {
          setError("Failed to update. Please try again.");
          return;
        }

        setSubscribed((prev) => {
          const next = new Set(prev);
          if (active) next.add(game);
          else next.delete(game);
          return next;
        });
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setToggling(null);
      }
    });
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {GAMES.map((g) => {
          const isOn = subscribed.has(g.id);
          const isLoading = toggling === g.id;

          return (
            <div
              key={g.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-white">{g.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{g.desc}</p>
              </div>
              <button
                onClick={() => toggle(g.id)}
                disabled={isLoading || pending}
                aria-label={`${isOn ? "Disable" : "Enable"} alerts for ${g.label}`}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                  ${isOn ? "bg-blue-500" : "bg-white/20"}
                  ${isLoading || pending ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                    transition duration-200 ease-in-out
                    ${isOn ? "translate-x-5" : "translate-x-0"}
                  `}
                />
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-white/30">
        Alerts are delivered to your account email after each draw is posted.
      </p>
    </div>
  );
}
