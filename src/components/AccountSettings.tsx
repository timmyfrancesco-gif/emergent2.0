'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Gift, User, Globe, Github, MessageCircle, HelpCircle,
  LogOut, Sun, Monitor, Moon, ExternalLink, ChevronRight,
  ArrowLeft, Sparkles
} from 'lucide-react';
import { cn, getInitials, formatCredits } from '@/lib/utils';
import type { Profile } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onLogout: () => void;
}

type Theme = 'light' | 'system' | 'dark';

export default function AccountSettings({ isOpen, onClose, profile, onLogout }: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('dark');

  const displayName = profile?.username ?? 'Utente';
  const email = profile?.email ?? 'nessuna@email.com';
  const credits = profile?.credits ?? 0;

  const menuItems = [
    {
      icon: Gift,
      label: 'Invita e Guadagna $200',
      color: 'text-emerald-400',
      onClick: () => {},
    },
    {
      icon: User,
      label: 'Impostazioni Account',
      onClick: () => router.push('/settings'),
    },
    {
      icon: Globe,
      label: 'Lingua',
      onClick: () => {},
    },
    {
      icon: Github,
      label: 'Connetti a Github',
      external: true,
      onClick: () => {},
    },
    {
      icon: MessageCircle,
      label: 'Comunità',
      external: true,
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Centro Assistenza',
      external: true,
      onClick: () => {},
    },
  ];

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-[60] overlay-backdrop transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[70] max-w-sm mx-auto bottom-sheet',
          isOpen ? 'open' : ''
        )}
      >
        <div className="bg-[#111111] border border-neutral-800/80 rounded-t-3xl overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-neutral-700" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800/60">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-400" />
            </button>
            <span className="text-sm text-neutral-400">{email}</span>
          </div>

          <div className="px-5 py-4 max-h-[80vh] overflow-y-auto">
            {/* Project Box */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/40 mb-4">
              <div>
                <div className="font-semibold text-white text-sm">
                  {displayName}&apos;s Project
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">Proprietario • 1 membro</div>
              </div>
              <button className="w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </button>
            </div>

            {/* Credits Panel */}
            <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/40 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-neutral-300">Crediti</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400">🪙</span>
                  <span className="text-white font-bold">{formatCredits(credits)}</span>
                </div>
              </div>
              <button className="w-full py-3 btn-gold rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Aggiorna
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-1 mb-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-neutral-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        item.color ?? 'text-neutral-400 group-hover:text-neutral-200'
                      )}
                    />
                    <span className={cn('text-sm font-medium', item.color ?? 'text-neutral-200')}>
                      {item.label}
                    </span>
                  </div>
                  {item.external && (
                    <ExternalLink className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60">
              {/* Logout */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Esci
              </button>

              {/* Theme Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-800 border border-neutral-700/50">
                {(['light', 'system', 'dark'] as Theme[]).map((t) => {
                  const Icon = t === 'light' ? Sun : t === 'system' ? Monitor : Moon;
                  return (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        theme === t
                          ? 'bg-neutral-600 text-white shadow'
                          : 'text-neutral-500 hover:text-neutral-300'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-6" />
          </div>
        </div>
      </div>
    </>
  );
}
