import { useEffect, useState } from 'react';
import { ArrowDown, Play } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const curve = Array.from({ length: 11 }, (_, i) => {
  const t = i * 10;
  const wob = Math.sin(i * 1.7) * 1.8;
  return { t, train: Math.round(91 * (1 - Math.exp(-t / 16)) * 10) / 10, val: Math.round((86 * (1 - Math.exp(-t / 18)) + wob * (i > 2 ? 1 : 0)) * 10) / 10 };
});
const layers = ['Image input', 'Preprocessing and augmentation', 'Convolutional backbone', 'Attention block', 'Classification head', 'Condition and confidence'];

export default function Training() {
  const [progress, setProgress] = useState(70);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setProgress((p) => (p >= 100 ? (setRunning(false), 100) : p + 2)), 120);
    return () => clearInterval(t);
  }, [running]);
  const start = () => { setProgress(0); setRunning(true); };
  const Bar = ({ label, v }: { label: string; v: number }) => (
    <div><div className="flex justify-between text-sm font-semibold"><span>{label}</span><span className="text-forest-700">{v}%</span></div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-bark-100"><i className="block h-full rounded-full bg-forest-600 transition-all" style={{ width: `${v}%` }} /></div></div>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-4xl font-medium sm:text-5xl">Model training</h1><p className="mt-2 text-bark-600">Progress, architecture and accuracy of the screening model. Values are simulated.</p></div>
        <button onClick={start} disabled={running} className="btn-primary"><Play size={16} /> {running ? 'Training…' : 'Start new run'}</button>
      </div>
      <section className="card space-y-5 p-6"><Bar label="Training progress" v={progress} /><Bar label="Dataset labelled" v={82} /></section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-2xl">Model architecture</h2>
          <ol className="mt-4 flex flex-col items-center gap-1">
            {layers.map((l, i) => (
              <li key={l} className="flex w-full max-w-xs flex-col items-center gap-1">
                <span className={`w-full rounded-xl border px-4 py-2.5 text-center text-sm font-medium ${i === 0 || i === layers.length - 1 ? 'border-sky-200 bg-sky-50' : 'border-forest-200 bg-forest-50'}`}>{l}</span>
                {i < layers.length - 1 && <ArrowDown size={16} className="text-bark-400" />}
              </li>
            ))}
          </ol>
        </section>
        <section className="card p-6">
          <h2 className="text-2xl">Performance</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} stroke="#ece8df" />
                <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fill: '#867660', fontSize: 12 }} label={{ value: 'Time (min)', position: 'insideBottom', offset: -2, fill: '#867660', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#867660', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ece8df' }} />
                <Line type="monotone" dataKey="train" name="Training accuracy" stroke="#244a35" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="val" name="Validation accuracy" stroke="#c8923b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
