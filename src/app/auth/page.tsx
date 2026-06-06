'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabaseClient';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });
        if (signUpError) throw signUpError;
        setSuccess('Account creato! Controlla la tua email per verificare.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        const pendingPrompt = sessionStorage.getItem('pendingPrompt');
        sessionStorage.removeItem('pendingPrompt');

        if (pendingPrompt) {
          router.push(`/workspace/new?prompt=${encodeURIComponent(pendingPrompt)}`);
        } else {
          router.push('/');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla home
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Emergent</h1>
          <p className="text-neutral-500 text-sm">
            {mode === 'login' ? 'Accedi al tuo account' : 'Crea un nuovo account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
          {/* Mode Toggle */}
          <div className="flex p-1 bg-neutral-800 rounded-xl mb-6">
            {(['login', 'register'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                  mode === m
                    ? 'bg-white text-neutral-900 shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                {m === 'login' ? 'Accedi' : 'Registrati'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="il_tuo_nome"
                  required={mode === 'register'}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tua@email.com"
                required
                className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-gold rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Accedi' : 'Crea Account'}
            </button>
          </form>

          <p className="text-center text-xs text-neutral-600 mt-4">
            Continuando, accetti i{' '}
            <span className="text-neutral-400 cursor-pointer hover:underline">Termini di Servizio</span>
          </p>
        </div>

        {/* Credits Note */}
        <p className="text-center text-xs text-neutral-600 mt-6">
          Ogni nuovo account riceve{' '}
          <span className="text-yellow-500 font-medium">🪙 10.00 crediti</span> gratuiti
        </p>
      </div>
    </div>
  );
}
