"use client";
import { useState } from "react";
export default function UpgradeButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/square/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await resp.json();
      if (data.checkout_url) { window.location.href = data.checkout_url; }
      else { setError("Could not start checkout. Please try again."); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }
  return (
    <div>
      <button onClick={handleUpgrade} disabled={loading} style={{ background: "#000", color: "#fff", padding: "12px 24px", borderRadius: "8px", border: "none", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Loading..." : "Upgrade to Pro — $9.99/mo"}
      </button>
      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </div>
  );
}
