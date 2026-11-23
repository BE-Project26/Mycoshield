import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Eye, ScanSearch, Sprout } from 'lucide-react';
import { useScreenings } from '../context/ScreeningContext';
import { ConfidenceRing, STATUS, StatusBadge } from '../components/ui';
import { formatDate } from '../lib';

export function LatestResult() {
  const { screenings } = useScreenings();
  return <Navigate to={`/results/${screenings[0].id}`} replace />;
}

export default function Result() {
  const { id } = useParams();
  const { screenings } = useScreenings();
  const [boxes, setBoxes] = useState(true);
  const s = screenings.find((x) => x.id === id);

  if (!s)
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <h1 className="text-3xl">Result not found</h1>
        <p className="mt-2 text-bark-600">This screening is not in your data. Start a new one or browse past records.</p>
        <div className="mt-6 flex justify-center gap-3"><Link to="/capture" className="btn-primary">New screening</Link><Link to="/data" className="btn-ghost">View data</Link></div>
      </div>
    );

  const color = STATUS[s.status].color;
  return (
    <div className="space-y-6">
      <Link to="/data" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:underline"><ArrowLeft size={16} /> Back to data</Link>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-xl">Detection</h2>
            <button role="switch" aria-checked={boxes} onClick={() => setBoxes((b) => !b)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${boxes ? 'bg-forest-700 text-white' : 'bg-bark-100 text-bark-700'}`}>{boxes ? 'Boxes on' : 'Boxes off'}</button>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-forest-100 to-forest-200">
            {s.imageUrl ? <img src={s.imageUrl} alt="Screened sample" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-forest-500"><Sprout size={56} /></div>}
            {boxes && s.detections.map((d, i) => (
              <div key={i} className="absolute rounded-md border-2" style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%`, borderColor: color }}>
                <span className="absolute -top-0.5 left-0 max-w-full -translate-y-full truncate rounded-t px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ background: color }}>{d.label} {d.score}%</span>
              </div>
            ))}
          </div>
          {!s.imageUrl && <p className="mt-2 text-xs text-bark-500">Sample records have no photo. Boxes show where the model would mark findings.</p>}
        </div>

        <div className="card flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-3">
          <div>
            <StatusBadge status={s.status} />
            <h1 className="mt-3 text-4xl font-medium sm:text-5xl">{s.condition}</h1>
            <p className="mt-2 text-sm text-bark-500">Screening {s.id} · Batch {s.batch} · {formatDate(s.date)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <ConfidenceRing value={s.confidence} status={s.status} />
            <p className="max-w-xs text-bark-600">
              {s.status === 'healthy' ? 'No signs of disease or contamination were found in this sample.' : s.status === 'warning' ? 'Early signs of a problem were found. Act soon and re-screen to confirm.' : 'Signs of serious contamination were found. Isolate this sample first.'}
            </p>
          </div>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="text-2xl">Classification results</h2>
        <ul className="mt-4 space-y-3">
          {s.scores.map((c, i) => (
            <li key={c.label} className="grid grid-cols-[minmax(0,10rem)_1fr_3.5rem] items-center gap-3 text-sm sm:grid-cols-[12rem_1fr_3.5rem]">
              <span className="truncate">{c.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-bark-100"><i className="block h-full rounded-full" style={{ width: `${c.value}%`, background: i === 0 ? color : '#bfb299' }} /></span>
              <span className="text-right font-medium">{c.value.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-2xl"><Eye size={20} className="text-forest-600" /> What we found</h2>
          <ul className="mt-4 space-y-3">{s.findings.map((f) => <li key={f} className="flex gap-3"><i className="mt-2 h-2 w-2 shrink-0 rounded-full bg-forest-500" />{f}</li>)}</ul>
        </section>
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-2xl"><ClipboardList size={20} className="text-forest-600" /> What to do next</h2>
          <ul className="mt-4 space-y-3">{s.recommendations.map((r) => <li key={r} className="flex gap-3"><i className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amberlt" />{r}</li>)}</ul>
        </section>
      </div>

      <div className="flex flex-wrap gap-3"><Link to="/capture" className="btn-primary"><ScanSearch size={17} /> Screen another image</Link><Link to="/" className="btn-ghost">Go home</Link></div>
      <p className="text-xs text-bark-500">This is a simulated result for demonstration. It is not a diagnosis.</p>
    </div>
  );
}
