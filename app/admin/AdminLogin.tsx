'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/basepath';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch(asset('/api/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) router.refresh();
    else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || 'Přihlášení selhalo.');
    }
    setBusy(false);
  }

  return (
    <section className="mx-auto max-w-[420px] px-6 py-24">
      <div className="glass rounded-3xl p-8">
        <h1 className="serif italic text-4xl text-ink mb-6">Admin</h1>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.18em] text-ink/60 mb-1.5">Heslo</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full px-4 py-2.5 rounded-full bg-white/70 border border-white/60 focus:outline-none focus:ring-2 focus:ring-dusty-300"
            />
          </label>
          {err && <p className="text-sm text-dusty-500">{err}</p>}
          <button
            disabled={busy}
            className="w-full py-3 rounded-full bg-ink text-beige-50 disabled:opacity-50 hover:bg-ink/85"
          >
            {busy ? 'Ověřuji…' : 'Přihlásit'}
          </button>
        </form>
      </div>
    </section>
  );
}
