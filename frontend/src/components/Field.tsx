import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  label: string; value: string; onChange: (v: string) => void;
  type?: 'text' | 'email' | 'password'; placeholder?: string; autoComplete?: string; error?: string;
}

export default function Field({ label, value, onChange, type = 'text', placeholder, autoComplete, error }: Props) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="relative">
        <input
          id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
          type={isPw && show ? 'text' : type} aria-invalid={!!error}
          className={`w-full rounded-xl border bg-bark-50 px-4 py-3 placeholder:text-bark-400 ${error ? 'border-alert' : 'border-bark-100'} ${isPw ? 'pr-12' : ''}`}
        />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-bark-500 hover:text-forest-700">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-alert">{error}</p>}
    </div>
  );
}
