import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, Bell, Camera, GraduationCap, Video } from 'lucide-react';
import { useScreenings } from '../context/ScreeningContext';
import { weeklyTrend } from '../data/mock';
import { ConfidenceRing, StatusBadge, Thumb } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../lib';

const cameras = [
  { name: 'Cam 1', room: 'Fruiting room A', live: true },
  { name: 'Cam 2', room: 'Incubation', live: true },
  { name: 'Cam 3', room: 'Spawn run', live: false }
];

export default function Dashboard() {
  const { screenings } = useScreenings();
  const { user } = useAuth();
  const s = useMemo(() => {
    const total = screenings.length;
    const healthy = screenings.filter((x) => x.status === 'healthy').length;
    return { total, healthy, alerts: screenings.filter((x) => x.status === 'critical').length, pct: (healthy / total) * 100 };
  }, [screenings]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-medium sm:text-5xl">Home</h1>
          <p className="mt-1 text-bark-600">Hello, {user?.name}. Here is how your batches are doing.</p>
        </div>
        <button aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-bark-100">
          <Bell size={20} />{s.alerts > 0 && <i className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-alert" />}
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-2xl">System overview</h2>
        <div className="grid grid-cols-3 gap-3">
          {[{ to: '/capture', icon: Camera, label: 'Capture image' }, { to: '/results', icon: BarChart3, label: 'Recent results' }, { to: '/training', icon: GraduationCap, label: 'Model training' }].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="card flex flex-col items-center gap-2 p-4 text-center text-sm font-medium transition hover:-translate-y-0.5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-50 text-forest-600"><Icon size={22} /></span>{label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl">Recent health status</h2>
        <div className="card flex items-center justify-around gap-4 p-5">
          <ConfidenceRing value={s.pct} status="healthy" size={120} label="healthy" />
          <div className="space-y-4">
            <div><div className="font-display text-4xl">{s.healthy}</div><div className="text-sm text-bark-500">healthy of {s.total} screenings</div></div>
            <div><div className="font-display text-4xl text-alert">{s.alerts}</div><div className="text-sm text-bark-500">contamination alerts</div></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl">Active cameras</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {cameras.map((c) => (
            <div key={c.name} className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-stone-600 to-stone-900 p-3 text-white">
              <span className={`inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium`}><i className={`h-2 w-2 rounded-full ${c.live ? 'bg-emerald-400' : 'bg-stone-400'}`} />{c.live ? 'Live' : 'Offline'}</span>
              <Video className="absolute right-3 top-3 opacity-40" size={18} />
              <div className="absolute bottom-3 left-3"><div className="font-semibold">{c.name}</div><div className="text-xs text-stone-300">{c.room}</div></div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-bark-500">Camera feeds are placeholders in this demo.</p>
      </section>

      <section className="card p-6">
        <h2 className="text-2xl">Screenings this week</h2>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3d7352" stopOpacity={0.35} /><stop offset="100%" stopColor="#3d7352" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#ece8df" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#867660', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#867660', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ece8df' }} />
              <Area type="monotone" dataKey="healthy" name="Healthy" stroke="#3d7352" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="issues" name="Issues" stroke="#c8923b" strokeWidth={2.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between"><h2 className="text-2xl">Recent screenings</h2><Link to="/data" className="text-sm font-semibold text-forest-700 hover:underline">View all</Link></div>
        <ul className="mt-4 divide-y divide-bark-100">
          {screenings.slice(0, 5).map((x) => (
            <li key={x.id}>
              <Link to={`/results/${x.id}`} className="flex items-center gap-4 rounded-xl py-3 transition hover:bg-bark-50 sm:px-2">
                <Thumb src={x.imageUrl} status={x.status} />
                <div className="min-w-0 flex-1"><div className="truncate font-semibold">{x.condition}</div><div className="text-sm text-bark-500">Batch {x.batch} · {timeAgo(x.date)}</div></div>
                <StatusBadge status={x.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
