'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu, Bell, Paperclip, Globe, SlidersHorizontal,
  Mic, ArrowUp, X, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabaseClient';
import { localStore } from '@/lib/localStore';
import Sidebar from '@/components/Sidebar';
import AdvancedSettingsModal from '@/components/AdvancedSettingsModal';
import type { Project, Profile, AdvancedSettings } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_SETTINGS: AdvancedSettings = {
  model: 'gemini-1.5-pro',
  budget: 25,
  maxxEnabled: false,
  template: 'us-central1-docker.pkg.dev/emergent-defa…',
};

const QUICK_TAGS = ['App Full Stack', 'App Mobile', 'Landing Page'];

const SUGGESTIONS = [
  'Costruiscimi un clone di Netflix...',
  'Crea una dashboard analytics moderna...',
  'Fai un e-commerce con carrello...',
  'Disegna una landing page per una startup AI...',
  'Crea un\'app todo list con animazioni...',
];

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [settings, setSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);
  const [input, setInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(SUGGESTIONS[0]);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);

    // Rotate placeholder text
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % SUGGESTIONS.length;
      setPlaceholder(SUGGESTIONS[idx]);
    }, 3500);

    // Try to load user (optional)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => { if (data) setProfile(data); });
      }
    }).catch(() => {});

    // Load projects from localStorage
    const localProjects = localStore.getProjects().map(p => ({
      ...p,
      user_id: 'local',
    } as Project));
    setProjects(localProjects);

    return () => clearInterval(interval);
  }, []);

  const displayName = profile?.username ?? 'TIMMY';
  const credits = profile?.credits ?? 10;

  const handleTagClick = (tag: string) => {
    setSelectedTag(prev => (prev === tag ? null : tag));
    textareaRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSubmit = async () => {
    const prompt = [selectedTag, input.trim()].filter(Boolean).join(': ');
    if (!prompt || isLoading) return;

    setIsLoading(true);

    // Create project in localStorage immediately — no auth needed
    const id = uuidv4();
    const name = prompt.slice(0, 60);

    localStore.saveProject({
      id,
      name,
      slug: null,
      code: null,
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Use /workspace/demo as the static shell; pass real UUID as query param
    // so GitHub Pages (static export) always finds the pre-generated page
    router.push(`/workspace/demo?id=${id}&prompt=${encodeURIComponent(prompt)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setProfile(null);
    setIsSidebarOpen(false);
  };

  const canSubmit = !!(input.trim() || selectedTag) && !isLoading;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Bar */}
      <header className={cn(
        'flex items-center justify-between px-4 pt-5 pb-2 relative z-20 transition-all duration-700',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-800/70 text-neutral-400 hover:text-white transition-all duration-200 active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-800/70 text-neutral-400 hover:text-white transition-all duration-200 active:scale-95 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 btn-gold rounded-full text-sm font-semibold active:scale-95 transition-transform">
            <span>🪙</span>
            Acquista Crediti
          </button>
        </div>
      </header>

      {/* Promo Banner */}
      {showBanner && (
        <div className={cn(
          'mx-4 mt-3 flex items-center justify-between gap-3 px-4 py-3 bg-amber-100/90 rounded-2xl transition-all duration-500',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}>
          <div className="flex items-center gap-2 text-neutral-800 text-sm font-medium">
            <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Ecco 50 crediti bonus per te</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowBanner(false)}
              className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors active:scale-95"
            >
              Riscatta
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero + Input */}
      <main className="flex-1 flex flex-col items-center justify-end pb-8 px-4 max-w-3xl mx-auto w-full">
        {/* Hero Text */}
        <div className={cn(
          'flex flex-col items-center text-center mb-8 transition-all duration-700 delay-100',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <p className="text-neon-green text-sm font-bold uppercase tracking-[0.2em] mb-3">
            BENVENUTO, {displayName.toUpperCase()}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-cyber-cyan leading-tight mb-4">
            Dove le idee<br />diventano realtà
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-md">
            Crea app e siti web completamente funzionali attraverso semplici conversazioni
          </p>
        </div>

        {/* Quick Tags */}
        <div className={cn(
          'flex items-center gap-2 flex-wrap justify-center mb-4 transition-all duration-700 delay-150',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          {QUICK_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 active:scale-95',
                selectedTag === tag
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-neutral-800/60 border-neutral-700/50 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className={cn(
          'w-full transition-all duration-700 delay-200',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}>
          <div className={cn(
            'w-full bg-neutral-800/80 border rounded-2xl overflow-hidden shadow-2xl transition-all duration-200',
            'border-neutral-700/60',
            'focus-within:border-emerald-500/30 focus-within:shadow-emerald-500/5'
          )}>
            <div className="flex items-start gap-3 px-4 pt-4 pb-2">
              <button className="mt-0.5 p-1.5 rounded-lg hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 transition-colors flex-shrink-0 active:scale-95">
                <Paperclip className="w-4 h-4" />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-neutral-500 text-base resize-none outline-none transition-all"
                style={{ minHeight: '28px', maxHeight: '160px' }}
              />
            </div>

            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-0.5">
                <ToolBtn icon={Globe} title="Web search" />
                <button
                  onClick={() => setIsAdvancedOpen(true)}
                  className={cn(
                    'p-2 rounded-xl transition-all duration-200 active:scale-95',
                    isAdvancedOpen
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300'
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <ToolBtn icon={Mic} title="Voce" />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95',
                  canSubmit
                    ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm hover:shadow-md'
                    : 'bg-neutral-700/50 text-neutral-600 cursor-not-allowed'
                )}
              >
                {isLoading
                  ? <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
                  : <ArrowUp className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-neutral-700 mt-3">
            Nessun account richiesto — le tue app vengono salvate localmente
          </p>
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        projects={projects}
        onNewProject={() => { textareaRef.current?.focus(); setIsSidebarOpen(false); }}
        onLogout={handleLogout}
      />

      {/* Advanced Modal */}
      <AdvancedSettingsModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
}

function ToolBtn({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <button
      className="p-2 rounded-xl hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 transition-all duration-200 active:scale-95"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
