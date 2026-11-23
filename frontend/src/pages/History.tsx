import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { useScreenings } from '../context/ScreeningContext';
import { StatusBadge, Thumb } from '../components/ui';
import { formatDate } from '../lib';
import type { HealthStatus } from '../types';

const filters: { key: 'all' | HealthStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'warning', label: 'Needs attention' },
  { key: 'critical', label: 'Contaminated' }
];

export default function History() {
  const { screenings } = useScreenings();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | HealthStatus>('all');

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return screenings.filter(
      (s) => (filter === 'all' || s.status === filter) && (!term || [s.id, s.condition, s.batch, formatDate(s.date)].some((v) => v.toLowerCase().includes(term)))
    );
  }, [screenings, q, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-medium sm:text-5xl">Screening data</h1>
        <p className="mt-2 text-bark-600">Search your screenings by ID, condition, batch or date.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bark-400" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search screenings"
            className="w-full rounded-xl border border-bark-200 bg-white py-2.5 pl-10 pr-3 placeholder:text-bark-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === f.key ? 'bg-forest-700 text-white' : 'bg-white text-forest-800 ring-1 ring-bark-200 hover:bg-bark-50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <div className="grid place-items-center px-6 py-16 text-center">
            <SearchX size={32} className="text-bark-400" />
            <p className="mt-3 text-lg font-semibold">No screenings match</p>
            <p className="text-sm text-bark-500">Try a different search term or clear the filter.</p>
          </div>
        ) : (
          <ul className="divide-y divide-bark-100">
            {rows.map((s) => (
              <li key={s.id}>
                <Link to={`/results/${s.id}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition hover:bg-bark-50 md:grid-cols-[auto_1fr_8rem_6rem_auto]">
                  <Thumb src={s.imageUrl} status={s.status} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{s.condition}</div>
                    <div className="text-sm text-bark-500">{s.id} · Batch {s.batch}</div>
                  </div>
                  <div className="hidden text-sm text-bark-600 md:block">{formatDate(s.date)}</div>
                  <div className="hidden text-sm text-bark-600 md:block">{s.confidence.toFixed(1)}%</div>
                  <StatusBadge status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
