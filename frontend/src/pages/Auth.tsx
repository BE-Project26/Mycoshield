import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Cpu, LineChart, ScanSearch, ShieldCheck, Loader2, MailCheck } from 'lucide-react';
import Field from '../components/Field';
import { Logo } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v);

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-white px-6 py-10">
      <div className="w-full max-w-sm animate-rise">
        <div className="flex flex-col items-center">
          <Logo className="text-forest-600" />
          <div className="mt-3 font-display text-3xl font-semibold">MycoShield</div>
        </div>
        <h1 className="mt-8 text-2xl font-medium">{title}</h1>
        <p className="mt-1 text-sm text-bark-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

const Submit = ({ busy, children }: { busy: boolean; children: ReactNode }) => (
  <button type="submit" disabled={busy} className="btn-primary w-full !rounded-full !py-3.5">
    {busy ? <Loader2 size={18} className="animate-spin" /> : children}
  </button>
);

export function Intro() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const slides = [
    { icon: ShieldCheck, title: 'Intelligent mushroom health', text: 'Screen oyster mushroom batches for disease and contamination from a single photo.' },
    { icon: ScanSearch, title: 'Capture, crop, screen', text: 'Take or upload a photo, crop to the area that matters, and get a result in seconds.' },
    { icon: LineChart, title: 'Track every batch', text: 'See health trends, contamination alerts and past screenings in one place.' },
    { icon: Cpu, title: 'Built to grow with you', text: 'Connect your own trained model as it improves. Screening runs on simulated data for now.' }
  ];
  const S = slides[i];
  const finish = () => { try { localStorage.setItem('mycoshield.intro', '1'); } catch { /* ignore */ } nav('/signin', { replace: true }); };
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-forest-500 to-forest-800 px-8 py-10 text-white">
      <button onClick={finish} className="self-end text-sm font-medium text-forest-100 hover:text-white">Skip</button>
      <div key={i} className="flex flex-1 animate-rise flex-col items-center justify-center text-center">
        <div className="grid h-44 w-44 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"><S.icon size={72} strokeWidth={1.4} /></div>
        <h1 className="mt-10 text-3xl font-medium">{S.title}</h1>
        <p className="mt-3 max-w-xs text-forest-100">{S.text}</p>
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex gap-2">{slides.map((_, n) => <i key={n} className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />)}</div>
        <button onClick={() => (i === slides.length - 1 ? finish() : setI(i + 1))} className="w-full rounded-full bg-white py-3.5 font-semibold text-forest-800 hover:bg-forest-50">
          {i === slides.length - 1 ? 'Get started' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export function SignIn() {
  const { signIn, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) return setErr('Enter a valid email address.');
    setErr(''); setBusy(true);
    try { await signIn(email, pw); nav('/', { replace: true }); }
    catch (x) { setErr((x as Error).message); setBusy(false); }
  };
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your batches and screenings.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@farm.com" autoComplete="email" />
        <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="Password" autoComplete="current-password" error={err} />
        <Submit busy={busy}>Sign in</Submit>
      </form>
      <div className="mt-5 space-y-3 text-center text-sm">
        <Link to="/forgot" className="font-semibold text-forest-600 hover:underline">Forgot your password?</Link>
        <p className="text-bark-500">New to MycoShield? <Link to="/register" className="font-semibold text-forest-600 hover:underline">Create an account</Link></p>
      </div>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', farm: '', email: '', pw: '', pw2: '' });
  const [agree, setAgree] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!f.name.trim()) x.name = 'Enter your name.';
    if (!emailOk(f.email)) x.email = 'Enter a valid email address.';
    if (f.pw.length < 8) x.pw = 'Use at least 8 characters.';
    if (f.pw2 !== f.pw) x.pw2 = 'Passwords do not match.';
    if (!agree) x.agree = 'Accept the terms to continue.';
    setErrs(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    try { await register({ name: f.name.trim(), farm: f.farm.trim() || undefined, email: f.email, password: f.pw }); nav('/', { replace: true }); }
    catch (er) { setErrs({ pw: (er as Error).message }); setBusy(false); }
  };
  return (
    <AuthShell title="Create your account" subtitle="Start screening your oyster mushroom batches.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" value={f.name} onChange={set('name')} placeholder="Your name" autoComplete="name" error={errs.name} />
        <Field label="Farm or company (optional)" value={f.farm} onChange={set('farm')} placeholder="Farm name" autoComplete="organization" />
        <Field label="Email" type="email" value={f.email} onChange={set('email')} placeholder="you@farm.com" autoComplete="email" error={errs.email} />
        <Field label="Password" type="password" value={f.pw} onChange={set('pw')} placeholder="At least 8 characters" autoComplete="new-password" error={errs.pw} />
        <Field label="Confirm password" type="password" value={f.pw2} onChange={set('pw2')} placeholder="Repeat password" autoComplete="new-password" error={errs.pw2} />
        <div>
          <label className="flex items-start gap-2.5 text-sm text-bark-600">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-forest-600" />
            I agree to the terms of use and privacy policy.
          </label>
          {errs.agree && <p role="alert" className="mt-1 text-xs font-medium text-alert">{errs.agree}</p>}
        </div>
        <Submit busy={busy}>Create account</Submit>
      </form>
      <p className="mt-5 text-center text-sm text-bark-500">Already have an account? <Link to="/signin" className="font-semibold text-forest-600 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}

export function Forgot() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); emailOk(email) ? setSent(true) : setErr('Enter a valid email address.'); };
  return (
    <AuthShell title="Reset your password" subtitle="We will email you a link to choose a new one.">
      {sent ? (
        <div className="rounded-2xl bg-forest-50 p-5 text-center">
          <MailCheck className="mx-auto text-forest-600" size={30} />
          <p className="mt-3 font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-bark-600">If an account exists for {email}, a reset link is on its way. (Demo: no email is sent.)</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@farm.com" autoComplete="email" error={err} />
          <Submit busy={false}>Send reset link</Submit>
        </form>
      )}
      <p className="mt-5 text-center text-sm"><Link to="/signin" className="font-semibold text-forest-600 hover:underline">Back to sign in</Link></p>
    </AuthShell>
  );
}
