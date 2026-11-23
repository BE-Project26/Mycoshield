import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { BarChart3, Camera, Database, GraduationCap, Home, User } from 'lucide-react';
import { Logo } from './ui';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/data', label: 'Data', icon: Database },
  { to: '/training', label: 'Training', icon: GraduationCap },
  { to: '/results', label: 'Results', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function Layout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-forest-900 p-6 text-forest-100 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 text-white"><Logo size={34} /><span className="font-display text-2xl">MycoShield</span></Link>
        <Link to="/capture" className="btn-primary mt-8 !bg-forest-500 hover:!bg-forest-400"><Camera size={17} /> Capture image</Link>
        <nav className="mt-6 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-forest-700 text-white' : 'text-forest-200 hover:bg-forest-800 hover:text-white'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-forest-800 p-4 text-sm">
          <div className="font-semibold text-white">{user?.name}</div>
          <div className="truncate text-forest-300">{user?.email}</div>
        </div>
      </aside>

      <div className="min-w-0">
        <main key={pathname} className="mx-auto max-w-6xl animate-rise px-4 pb-32 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
        {pathname !== '/capture' && (
          <Link to="/capture" aria-label="Capture image" className="fixed bottom-20 right-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-forest-600 text-white shadow-lg hover:bg-forest-700 lg:hidden"><Camera size={24} /></Link>
        )}
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-bark-100 bg-white/95 backdrop-blur lg:hidden">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-forest-700' : 'text-bark-500'}`}>
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
