import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ImagePlus, Loader2, RotateCcw, ScanSearch } from 'lucide-react';
import { useScreenings } from '../context/ScreeningContext';

const Slider = ({ label, value, set, min = 0, max = 100, step = 1, busy }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; step?: number; busy: boolean }) => (
  <label className="block text-sm font-medium text-bark-700">{label}
    <input type="range" min={min} max={max} step={step} value={value} disabled={busy} onChange={(e) => set(+e.target.value)} className="mt-1 w-full accent-forest-600" />
  </label>
);


export default function Capture() {
  const { runScreening } = useScreenings();
  const nav = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [px, setPx] = useState(50);
  const [py, setPy] = useState(50);
  const [batch, setBatch] = useState('B-214');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('That file is not an image. Choose a JPG, PNG or WebP photo.');
    if (f.size > 10 * 1024 * 1024) return setError('That image is larger than 10 MB. Choose a smaller photo.');
    setError('');
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => { img.current = im; setZoom(1); setPx(50); setPy(50); setReady(true); URL.revokeObjectURL(url); };
    im.onerror = () => setError('That image could not be read. Try another photo.');
    im.src = url;
  };

  // Draw the square crop. The same canvas is what gets screened.
  useEffect(() => {
    const im = img.current, c = canvas.current;
    if (!ready || !im || !c) return;
    const side = Math.min(im.width, im.height) / zoom;
    c.getContext('2d')?.drawImage(im, ((im.width - side) * px) / 100, ((im.height - side) * py) / 100, side, side, 0, 0, c.width, c.height);
  }, [ready, zoom, px, py]);

  const reset = () => { img.current = null; setReady(false); if (input.current) input.current.value = ''; };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]); };

  const submit = async () => {
    const c = canvas.current;
    if (!c) return;
    setBusy(true);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.92));
    if (!blob) { setBusy(false); return setError('Could not prepare the cropped image. Try again.'); }
    const result = await runScreening(new File([blob], 'crop.jpg', { type: 'image/jpeg' }), batch);
    nav(`/results/${result.id}`);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-4xl font-medium sm:text-5xl">{ready ? 'Crop and screen' : 'Image capture'}</h1>
        <p className="mt-2 text-bark-600">{ready ? 'Frame the mushrooms or substrate you want screened.' : 'Take a photo or upload one. Use even light and fill the frame.'}</p>
      </div>

      <div className="card p-5">
        {!ready ? (
          <div
            role="button" tabIndex={0} onClick={() => input.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
            className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${dragging ? 'border-forest-500 bg-forest-50' : 'border-bark-200 hover:border-forest-300 hover:bg-bark-50'}`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-50 text-forest-600"><Camera size={26} /></span>
            <p className="mt-4 text-lg font-semibold">Take a photo or choose one</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-bark-500"><ImagePlus size={15} /> Drop an image here · JPG, PNG, WebP · up to 10 MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-forest-950">
              <canvas ref={canvas} width={640} height={640} className="aspect-square w-full" />
              <div className="pointer-events-none absolute inset-3 rounded-lg border-2 border-white/70" />
              {busy && <div className="pointer-events-none absolute inset-0 bg-forest-900/30"><div className="absolute inset-x-0 h-0.5 animate-scan bg-forest-300 shadow-[0_0_18px_4px_rgba(147,182,155,.8)]" /></div>}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Slider busy={busy} label="Zoom" value={zoom} set={setZoom} min={1} max={3} step={0.05} />
              <Slider busy={busy} label="Move left / right" value={px} set={setPx} />
              <Slider busy={busy} label="Move up / down" value={py} set={setPy} />
            </div>
          </div>
        )}
        <input ref={input} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pick(e.target.files?.[0])} />
        {error && <p role="alert" className="mt-3 text-sm font-medium text-alert">{error}</p>}

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="min-w-[8rem] flex-1 text-sm font-medium text-bark-700">Batch
            <select value={batch} onChange={(e) => setBatch(e.target.value)} disabled={busy} className="mt-1.5 w-full rounded-xl border border-bark-200 bg-white px-3.5 py-2.5 text-forest-900">
              {['B-214', 'B-212', 'B-211', 'B-210', 'B-209', 'B-207'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          {ready && <button onClick={reset} disabled={busy} className="btn-ghost"><RotateCcw size={16} /> Retake</button>}
          <button onClick={submit} disabled={!ready || busy} className="btn-primary">
            {busy ? <><Loader2 size={17} className="animate-spin" /> Screening…</> : <><ScanSearch size={17} /> Run screening</>}
          </button>
        </div>
      </div>
    </div>
  );
}
