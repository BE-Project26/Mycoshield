import { useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, ScanSearch, X } from 'lucide-react';
import { useScreenings } from '../context/ScreeningContext';

export default function Upload() {
  const { runScreening } = useScreenings();
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [batch, setBatch] = useState('B-214');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('That file is not an image. Choose a JPG, PNG or WebP photo.');
    if (f.size > 10 * 1024 * 1024) return setError('That image is larger than 10 MB. Choose a smaller photo.');
    setError('');
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (input.current) input.current.value = '';
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    const result = await runScreening(file, batch);
    navigate(`/results/${result.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-4xl font-medium sm:text-5xl">Screen a sample</h1>
        <p className="mt-2 text-bark-600">Upload a clear, well-lit photo of the mushrooms or substrate. Results appear in a few seconds.</p>
      </div>

      <div className="card p-5 sm:p-6">
        {!preview ? (
          <div
            role="button" tabIndex={0}
            onClick={() => input.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition ${dragging ? 'border-forest-500 bg-forest-50' : 'border-bark-200 hover:border-forest-300 hover:bg-bark-50'}`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-50 text-forest-600"><ImagePlus size={26} /></span>
            <p className="mt-4 text-lg font-semibold">Drop a photo here, or click to browse</p>
            <p className="mt-1 text-sm text-bark-500">JPG, PNG or WebP · up to 10 MB</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-forest-950">
            <img src={preview} alt="Selected sample" className="max-h-[26rem] w-full object-contain" />
            {busy && (
              <div className="pointer-events-none absolute inset-0 bg-forest-900/30">
                <div className="absolute inset-x-0 h-0.5 animate-scan bg-forest-300 shadow-[0_0_18px_4px_rgba(147,182,155,.8)]" />
              </div>
            )}
            {!busy && (
              <button onClick={clear} aria-label="Remove image" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-forest-900 hover:bg-white">
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        {error && <p role="alert" className="mt-3 text-sm font-medium text-alert">{error}</p>}

        <div className="mt-5 flex flex-wrap items-end gap-4">
          <label className="flex-1 text-sm font-medium text-bark-700">
            Batch
            <select value={batch} onChange={(e) => setBatch(e.target.value)} disabled={busy} className="mt-1.5 w-full rounded-xl border border-bark-200 bg-white px-3.5 py-2.5 text-forest-900">
              {['B-214', 'B-212', 'B-211', 'B-210', 'B-209', 'B-207'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <button onClick={submit} disabled={!file || busy} className="btn-primary w-full sm:w-auto">
            {busy ? <><Loader2 size={17} className="animate-spin" /> Screening…</> : <><ScanSearch size={17} /> Run screening</>}
          </button>
        </div>
      </div>

      <ul className="grid gap-3 text-sm text-bark-600 sm:grid-cols-3">
        {['Use natural, even light', 'Fill the frame with the cap or block', 'Avoid blur and heavy shadows'].map((t) => (
          <li key={t} className="rounded-xl bg-white px-4 py-3 ring-1 ring-bark-100">{t}</li>
        ))}
      </ul>
    </div>
  );
}
