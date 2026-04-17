"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  subscriptionStatus: "active" | "cancelling" | "inactive";
  subscriptionEndsAt: string | null;
};

export default function CancelSubscriptionButton({
  subscriptionStatus,
  subscriptionEndsAt,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (subscriptionStatus === "inactive") return null;

  if (subscriptionStatus === "cancelling" && subscriptionEndsAt) {
    const endsDate = new Date(subscriptionEndsAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <p className="text-xs text-white/40 mt-3">
        Subscription cancelled — Pro access ends{" "}
        <span className="text-white/60 font-medium">{endsDate}</span>.
      </p>
    );
  }

  async function handleConfirmCancel() {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/square/cancel", { method: "POST" });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Cancellation failed. Please try again.");
        setLoading(false);
        return;
      }
      setShowModal(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs text-white/30 hover:text-white/60 transition-colors mt-3 underline underline-offset-2"
      >
        Cancel subscription
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !loading && setShowModal(false)}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Cancel your subscription?
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Your Pro access will continue until the end of your current billing
              period. After that, you'll be moved to the free plan.
            </p>
            {error && (
              <p className="text-xs text-red-400 mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Keep subscription
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600/80 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
