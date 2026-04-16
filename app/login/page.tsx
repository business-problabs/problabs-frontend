'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <nav className="mb-8">
        <Link href="/" className="text-xl font-bold text-blue-400 hover:text-blue-200 transition-colors flex w-fit items-center gap-2 py-2">
          <span className="text-3xl leading-none">←</span> Back to Home
        </Link>
      </nav>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Sign in</h1>
        {sent ? (
          <div className="mt-4 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
            <p className="text-green-400 text-sm font-semibold">Magic link sent!</p>
            <p className="text-white/60 text-sm mt-1">Check your email and click the link to sign in. It expires in 15 minutes.</p>
          </div>
        ) : (
          <>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <p className="text-white/60 text-sm mb-8">Enter your email to receive a magic sign-in link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40" />
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors disabled:opacity-50">
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
