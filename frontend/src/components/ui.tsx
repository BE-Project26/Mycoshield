import { CheckCircle2, AlertTriangle, ShieldAlert, Sprout } from 'lucide-react';
import type { HealthStatus } from '../types';

export const STATUS = {
  healthy: { label: 'Healthy', cls: 'bg-forest-50 text-forest-700 ring-forest-200', icon: CheckCircle2, color: '#3d7352' },
  warning: { label: 'Needs attention', cls: 'bg-amber-50 text-amber-800 ring-amber-200', icon: AlertTriangle, color: '#c8923b' },
  critical: { label: 'Contaminated', cls: 'bg-red-50 text-alert ring-red-200', icon: ShieldAlert, color: '#b4483a' }
} as const;

export function StatusBadge({ status }: { status: HealthStatus }) {
  const s = STATUS[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.cls}`}>
      <Icon size={13} /> {s.label}
    </span>
  );
}

export function Thumb({ src, status, className = 'h-12 w-12' }: { src?: string; status: HealthStatus; className?: string }) {
  const tint = status === 'healthy' ? 'from-forest-100 to-forest-200 text-forest-600' : status === 'warning' ? 'from-amber-50 to-amber-100 text-amberlt' : 'from-red-50 to-red-100 text-alert';
  return src ? (
    <img src={src} alt="" className={`${className} shrink-0 rounded-xl object-cover`} />
  ) : (
    <div className={`${className} grid shrink-0 place-items-center rounded-xl bg-gradient-to-br ${tint}`}>
      <Sprout size={20} />
    </div>
  );
}

export function ConfidenceRing({ value, status, size = 132, label = 'confidence' }: { value: number; status: HealthStatus; size?: number; label?: string }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ece8df" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={STATUS[status].color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-3xl font-medium">{value.toFixed(1)}%</div>
        <div className="text-xs text-bark-500">{label}</div>
      </div>
    </div>
  );
}

export function Logo({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path d="M32 4 8 12v18c0 15 10 25 24 30 14-5 24-15 24-30V12L32 4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 34c0-9 6-15 14-15s14 6 14 15H18Z" fill="currentColor" />
      <path d="M28 34v12a4 4 0 0 0 8 0V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
