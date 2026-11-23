import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

/**
 * Mock auth: nothing is verified and no password is stored. Replace signIn/register
 * with real API calls. Only the display profile is kept in localStorage.
 */
interface AuthCtx {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  register: (u: User & { password: string }) => Promise<void>;
  signOut: () => void;
}
const KEY = 'mycoshield.session';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  });
  const persist = (u: User | null) => {
    setUser(u);
    try { u ? localStorage.setItem(KEY, JSON.stringify(u)) : localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
  };
  const signIn: AuthCtx['signIn'] = async (email, password) => {
    await wait(700);
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    persist({ name: email.split('@')[0], email });
  };
  const register: AuthCtx['register'] = async ({ name, email, farm, password }) => {
    await wait(900);
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    persist({ name, email, farm });
  };
  return <Ctx.Provider value={{ user, signIn, register, signOut: () => persist(null) }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
