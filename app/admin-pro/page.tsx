import "server-only";
import { listUsers, type AdminUser } from "@/lib/adminApi";
import GrantProForm from "./GrantProForm";

export const dynamic = "force-dynamic";

function badge(user: AdminUser) {
  if (user.pro_gifted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
        🎁 Gifted
      </span>
    );
  }
  if (user.effective_pro) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
        ✓ Pro
      </span>
    );
  }
  if (user.is_pro && user.subscription_ends_at) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
        ⏳ Cancelling
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
      Free
    </span>
  );
}

function fmt(dateStr: string | null) {
  if (!dateStr) return "—";
  return dateStr.slice(0, 10);
}

export default async function AdminProPage() {
  let data: Awaited<ReturnType<typeof listUsers>> | null = null;
  let error: string | null = null;

  try {
    data = await listUsers(200);
  } catch (e: any) {
    error = e?.message ?? "Failed to load users.";
  }

  const users = data?.items ?? [];
  const proCount = users.filter((u) => u.effective_pro).length;
  const giftedCount = users.filter((u) => u.pro_gifted).length;
  const paidCount = proCount - giftedCount;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Pro Gift Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Grant or revoke free Pro access to any user. Admin key never reaches
          the browser.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: form */}
        <div className="lg:col-span-1">
          <GrantProForm />

          {/* Quick stats */}
          {data && (
            <div className="mt-6 rounded-2xl border p-5 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Summary
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Total users</dt>
                  <dd className="font-semibold text-gray-900">{data.total}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Active Pro</dt>
                  <dd className="font-semibold text-gray-900">{proCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Admin gifted</dt>
                  <dd className="font-semibold text-purple-700">{giftedCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Paid (Square)</dt>
                  <dd className="font-semibold text-blue-700">{paidCount}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-400">
            <a href="/admin-stats" className="underline hover:text-gray-600">
              ← Back to Admin Stats
            </a>
          </div>
        </div>

        {/* Right: users table */}
        <div className="lg:col-span-2">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="font-medium">Couldn't load users</div>
              <div className="mt-1 opacity-90">{error}</div>
            </div>
          ) : (
            <div className="rounded-2xl border shadow-sm overflow-hidden bg-white">
              <div className="px-5 py-4 border-b">
                <h2 className="text-sm font-semibold text-gray-700">
                  All users{" "}
                  <span className="text-gray-400 font-normal">
                    ({data?.total ?? 0} total)
                  </span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Note</th>
                      <th className="px-4 py-3 text-left font-medium">Expires</th>
                      <th className="px-4 py-3 text-left font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-400"
                        >
                          No users yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                            {user.email}
                          </td>
                          <td className="px-4 py-3">{badge(user)}</td>
                          <td className="px-4 py-3 text-gray-400 max-w-[140px] truncate">
                            {user.pro_gifted_note ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 tabular-nums">
                            {user.subscription_ends_at
                              ? fmt(user.subscription_ends_at)
                              : user.effective_pro
                              ? "∞"
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-400 tabular-nums">
                            {fmt(user.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
