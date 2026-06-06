'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu, Bell, Paperclip, Globe, SlidersHorizontal,
  Mic, ArrowUp, X, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';
import AdvancedSettingsModal from '@/components/AdvancedSettingsModal';
import type { Profile, Project, AdvancedSettings } from '@/lib/types';

const DEFAULT_SETTINGS: AdvancedSettings = {
  model: 'gemini-1.5-pro',
  budget: 25,
  maxxEnabled: false,
  template: 'us-central1-docker.pkg.dev/emergent-defa…',
};

const QUICK_TAGS = ['App Full Stack', 'App Mobile', 'Landing Page'];

const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    user_id: 'demo',
    name: 'cesare-checkout-live',
    slug: 'cesare-checkout-live',
    code: null,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'demo-2',
    user_id: 'demo',
    name: 'bot-preview-lab',
    slug: null,
    code: null,
    published: false,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-3',
    user_id: 'demo',
    name: 'discord-bot-hub-35',
    slug: null,
    code: null,
    published: false,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [settings, setSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);
  const [input, setInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data) setProfile(data);

          const { data: projs } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(20);
          if (projs?.length) setProjects(projs);
        }
      } catch {
        // Supabase not configured — use demo data
      }
    }
    loadUser();
  }, []);

  const displayName = profile?.username ?? 'TIMMY';

  const handleTagClick = (tag: string) => {
    setSelectedTag(prev => prev === tag ? null : tag);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleSubmit = async () => {
    const prompt = [selectedTag, input.trim()].filter(Boolean).join(': ');
    if (!prompt) return;

    setIsLoading(true);

    try {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Store pending prompt and go to auth
        sessionStorage.setItem('pendingPrompt', prompt);
        router.push('/auth');
        return;
      }

      // Create project via API
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: prompt.slice(0, 60), prompt }),
      });

      if (res.ok) {
        const { id } = await res.json();
        router.push(`/workspace/${id}?prompt=${encodeURIComponent(prompt)}`);
      } else {
        // Fallback: navigate with prompt in URL
        router.push(`/workspace/new?prompt=${encodeURIComponent(prompt)}`);
      }
    } catch {
      // Offline / no Supabase — demo mode
      router.push(`/workspace/demo?prompt=${encodeURIComponent(prompt)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsSidebarOpen(false);
  };

  const handleNewProject = () => {
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-5 pb-2 relative z-20">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-800/60 text-neutral-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-800/60 text-neutral-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 btn-gold rounded-full text-sm font-semibold">
            <span>🪙</span>
            Acquista Crediti
          </button>
        </div>
      </header>

      {/* Promo Banner */}
      {showBanner && (
        <div className="mx-4 mt-3 flex items-center justify-between gap-3 px-4 py-3 bg-amber-100/90 rounded-2xl animate-fade-in">
          <div className="flex items-center gap-2 text-neutral-800 text-sm font-medium">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Ecco 50 crediti bonus per te</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors">
              Riscatta
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-3 py-1.5 border border-neutral-400/30 text-neutral-600 rounded-full text-xs font-medium hover:bg-neutral-200/50 transition-colors"
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-end pb-8 px-4 max-w-3xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <p className="text-neon-green text-sm font-bold uppercase tracking-[0.2em] mb-3 animate-fade-in">
            BENVENUTO, {displayName.toUpperCase()}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-cyber-cyan leading-tight mb-4 animate-fade-in">
            Dove le idee<br />diventano realtà
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-md animate-fade-in">
            Crea app e siti web completamente funzionali attraverso semplici conversazioni
          </p>
        </div>

        {/* Quick Tags */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-4">
          {QUICK_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-all',
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
          'w-full bg-neutral-800/80 border rounded-2xl overflow-hidden transition-all shadow-2xl input-ring',
          'border-neutral-700/60'
        )}>
          <div className="flex items-start gap-3 px-4 pt-4 pb-2">
            <button className="mt-0.5 p-1.5 rounded-lg hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Costruiscimi un clone di Netflix..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-neutral-500 text-base resize-none outline-none min-h-[28px]"
              style={{ maxHeight: '200px' }}
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-xl hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Ricerca web"
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAdvancedOpen(true)}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isAdvancedOpen
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300'
                )}
                title="Controlli avanzati"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-xl hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Input vocale"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && !selectedTag) || isLoading}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                (input.trim() || selectedTag) && !isLoading
                  ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm'
                  : 'bg-neutral-700/50 text-neutral-600 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        projects={projects}
        onNewProject={handleNewProject}
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
