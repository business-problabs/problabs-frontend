export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-gray-200 p-8">
          <h1 className="text-4xl font-semibold tracking-tight">ProbLabs</h1>
          <p className="mt-2 text-lg text-gray-600">
            AI-Powered Lottery Intelligence.
          </p>

          <div className="mt-6 space-y-3 text-base text-gray-700">
            <p>
              We’re building a data-driven analytics platform for Florida Lottery
              games:
              <span className="font-medium"> Fantasy 5</span>,{" "}
              <span className="font-medium">Pick 3</span>,{" "}
              <span className="font-medium">Pick 4</span>, and{" "}
              <span className="font-medium">Cash Pop</span>.
            </p>
            <p className="text-gray-500">Launching soon.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
