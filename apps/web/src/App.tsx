import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type HealthResponse = {
  ok: boolean;
  service: string;
  port: number;
  message: string;
  timestamp?: string;
};

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ ok: false, service: 'unavailable', port: 0, message: 'API unavailable' }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 antialiased">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/60">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">WebUI template</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Vite + Hono + shadcn</h1>
          <p className="mt-4 max-w-xl text-base text-slate-300">
            Frontend runs in an isolated Vite project, backend uses Hono, and the dev server proxies API requests to the local service.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="default">System ready</Button>
            <Button variant="secondary">API: {health?.service ?? 'loading'}</Button>
          </div>

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
            {health ? (
              <div className="space-y-2 text-sm text-slate-200">
                <p>
                  <span className="font-medium text-cyan-400">Status:</span> {health.message}
                </p>
                <p>
                  <span className="font-medium text-cyan-400">Port:</span> {health.port}
                </p>
                <p>
                  <span className="font-medium text-cyan-400">Timestamp:</span> {health.timestamp ?? 'n/a'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-300">Loading health status…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
