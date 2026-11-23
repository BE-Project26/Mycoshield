import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, LogOut, Map, Minus, Video, Bell, LineChart, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-4xl font-medium sm:text-5xl">Profile</h1>
      <div className="card flex items-center gap-4 p-5">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-forest-700 font-display text-2xl text-white">{user?.name.charAt(0).toUpperCase()}</span>
        <div className="min-w-0"><div className="text-lg font-semibold">{user?.name}</div><div className="truncate text-sm text-bark-500">{user?.email}</div>{user?.farm && <div className="text-sm text-bark-600">{user.farm}</div>}</div>
      </div>
      <Link to="/roadmap" className="card flex items-center gap-3 p-5 transition hover:bg-bark-50"><Map className="text-forest-600" size={20} /><span className="flex-1 font-semibold">Comparison and roadmap</span><ChevronRight size={18} className="text-bark-400" /></Link>
      <button onClick={() => { signOut(); nav('/signin', { replace: true }); }} className="btn-ghost w-full !text-alert"><LogOut size={17} /> Sign out</button>
    </div>
  );
}

const rows: [string, boolean, boolean][] = [
  ['Photo-based screening', false, true], ['Early contamination detection', false, true], ['Confidence score per sample', false, true],
  ['Same result for every staff member', false, true], ['Searchable screening history', false, true], ['Works with phone photos', true, true]
];
const planned = [{ icon: Video, t: 'Live camera feeds' }, { icon: Bell, t: 'SMS and email alerts' }, { icon: LineChart, t: 'Batch trend forecasts' }, { icon: Cpu, t: 'On-device model' }];

export function Roadmap() {
  const Mark = ({ ok }: { ok: boolean }) => (ok ? <Check size={18} className="mx-auto text-forest-600" /> : <Minus size={18} className="mx-auto text-bark-300" />);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-4xl font-medium sm:text-5xl">Comparison and future</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-bark-50 text-left"><th className="px-4 py-3">Feature</th><th className="px-4 py-3 text-center">Manual checks</th><th className="bg-forest-700 px-4 py-3 text-center text-white">MycoShield</th></tr></thead>
          <tbody>{rows.map(([f, a, b]) => <tr key={f} className="border-t border-bark-100"><td className="px-4 py-3">{f}</td><td className="px-4 py-3"><Mark ok={a} /></td><td className="bg-forest-50 px-4 py-3"><Mark ok={b} /></td></tr>)}</tbody>
        </table>
      </div>
      <h2 className="text-2xl">Future roadmap</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {planned.map(({ icon: Icon, t }) => <div key={t} className="card flex flex-col items-center gap-2 p-4 text-center text-sm font-medium"><Icon className="text-forest-600" size={24} />{t}</div>)}
      </div>
    </div>
  );
}
