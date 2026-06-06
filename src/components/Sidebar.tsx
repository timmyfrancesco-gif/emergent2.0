'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Globe, Bookmark, ChevronUp, Loader2
} from 'lucide-react';
import { cn, formatCredits, getInitials, timeAgo } from '@/lib/utils';
import type { Profile, Project } from '@/lib/types';
import AccountSettings from './AccountSettings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  projects: Project[];
  currentProjectId?: string;
  onNewProject: () => void;
  onLogout: () => void;
  loading?: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  profile,
  projects,
  currentProjectId,
  onNewProject,
  onLogout,
  loading = false,
}: Props) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const displayName = profile?.username ?? 'Utente';
  const email = profile?.email ?? '';
  const credits = profile?.credits ?? 0;

  const handleProjectClick = (id: string) => {
    router.push(`/workspace/${id}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 overlay-backdrop transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full z-40 w-[82%] max-w-sm sidebar-container flex flex-col',
          'glass-dark',
          isOpen ? 'open' : ''
        )}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto pt-12 pb-4">
          {/* Navigation Actions */}
          <div className="px-4 space-y-1 mb-6">
            <button
              onClick={() => { onNewProject(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Plus className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-emerald-400 font-semibold text-sm">Nuova Attività</span>
            </button>

            <button
              onClick={() => router.push('/deployed')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center">
                <Globe className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" />
              </div>
              <span className="text-neutral-300 text-sm font-medium">App Distribuite</span>
            </button>

            <button
              onClick={() => router.push('/showcase')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" />
              </div>
              <span className="text-neutral-300 text-sm font-medium">Vetrina</span>
            </button>
          </div>

          {/* Divider */}
          <div className="px-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-xs text-neutral-600 font-medium uppercase tracking-wider">
                Attività Recenti
              </span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>
          </div>

          {/* Recent Projects */}
          <div className="px-3 space-y-0.5">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-neutral-600 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-600 text-sm">Nessun progetto ancora</p>
                <p className="text-neutral-700 text-xs mt-1">Crea la tua prima app!</p>
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className={cn(
                    'w-full flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group',
                    currentProjectId === project.id ? 'bg-white/5' : ''
                  )}
                >
                  <div className="w-2 h-2 rounded-full bg-neutral-600 mt-1.5 flex-shrink-0 group-hover:bg-emerald-500/60 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                      {project.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-600">{timeAgo(project.updated_at)}</span>
                      {project.published && (
                        <span className="text-xs text-emerald-500/70 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                          Live
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Bottom Fixed Section */}
        <div className="px-4 py-4 border-t border-neutral-800/60 space-y-3">
          {/* Credits Bar */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/30">
            <div className="flex items-center gap-2">
              <span className="text-base">🪙</span>
              <span className="text-white font-semibold text-sm">{formatCredits(credits)}</span>
              <span className="text-neutral-500 text-xs">crediti</span>
            </div>
            <button className="px-3 py-1.5 rounded-xl btn-gold text-xs font-semibold">
              Acquista +
            </button>
          </div>

          {/* User Card */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-neutral-900">
              {getInitials(displayName)}
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-semibold text-white truncate">{displayName}</div>
              <div className="text-xs text-neutral-500 truncate">{email}</div>
            </div>

            <ChevronUp className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          </button>
        </div>
      </div>

      {/* Account Settings Panel */}
      <AccountSettings
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        profile={profile}
        onLogout={onLogout}
      />
    </>
  );
}
