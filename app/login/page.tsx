import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;
  const sent = params?.sent === "true";
  const error = params?.error;
  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <nav className="mb-8">
        <Link href="/" className="text-base font-semibold text-white/70 hover:text-white transition-colors flex w-fit items-center gap-2 py-2">
          <span className="text-xl leading-none">←</span> Back to Home
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
            {error && <p className="text-red-400 text-sm mb-4">Something went wrong. Please try again.</p>}
            <p className="text-white/60 text-sm mb-8">Enter your email to receive a magic sign-in link.</p>
            <form action="/api/auth/login" method="POST" className="space-y-4">
              <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40" />
              <button type="submit" className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">Send magic link</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
