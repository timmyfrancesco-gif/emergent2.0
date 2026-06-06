'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, Columns2, Maximize2, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import PreviewSandbox from '@/components/PreviewSandbox';
import type { Message, Project, Profile, AdvancedSettings, ProjectCode } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface PageParams {
  id: string;
}

export default function WorkspacePage({ params }: { params: Promise<PageParams> }) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);
  const [credits, setCredits] = useState(10);

  // Load user and project
  useEffect(() => {
    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (prof) {
            setProfile(prof);
            setCredits(prof.credits);
          }

          const { data: projs } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          if (projs) setProjects(projs);
        }

        if (projectId !== 'new' && projectId !== 'demo') {
          const { data: proj } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
          if (proj) {
            setProject(proj);
            if (proj.code) setPreviewReady(true);
          }

          const { data: msgs } = await supabase
            .from('messages')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
          if (msgs) setMessages(msgs);
        }
      } catch {
        // Demo mode
      }

      // Handle initial prompt from URL
      const prompt = searchParams.get('prompt');
      if (prompt) {
        handleSendMessage(prompt, {
          model: 'gemini-1.5-pro',
          budget: 25,
          maxxEnabled: false,
          template: '',
        });
      }
    }

    init();
  }, [projectId]);

  const handleSendMessage = useCallback(async (
    content: string,
    settings: AdvancedSettings
  ) => {
    if (isGenerating || credits <= 0) return;

    const COST = 0.5;
    const userMsg: Message = {
      id: uuidv4(),
      project_id: projectId,
      role: 'user',
      content,
      file_changes: null,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    setCredits(prev => Math.max(0, prev - COST));

    try {
      // Persist user message
      if (projectId !== 'demo') {
        await supabase.from('messages').insert({
          project_id: projectId === 'new' ? undefined : projectId,
          role: 'user',
          content,
        }).then(() => {});
      }

      // Generate code via API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          projectId: projectId !== 'new' && projectId !== 'demo' ? projectId : undefined,
          existingCode: project?.code?.files,
          model: settings.model,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? 'Errore generazione');
      }

      const generated = await res.json();

      const assistantMsg: Message = {
        id: uuidv4(),
        project_id: projectId,
        role: 'assistant',
        content: generated.summary ?? 'Codice generato con successo.',
        file_changes: generated.fileChanges ?? [],
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Update project code
      const newCode: ProjectCode = {
        files: generated.files,
        lastUpdated: new Date().toISOString(),
      };

      setProject(prev => prev
        ? { ...prev, code: newCode }
        : {
            id: projectId,
            user_id: profile?.id ?? '',
            name: content.slice(0, 60),
            slug: null,
            code: newCode,
            published: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
      );

      setPreviewReady(true);

      // Persist to DB
      if (projectId !== 'demo') {
        if (projectId === 'new') {
          // Create project
          const { data: newProj } = await supabase
            .from('projects')
            .insert({ name: content.slice(0, 60), code: newCode, user_id: profile?.id })
            .select()
            .single();

          if (newProj) {
            router.replace(`/workspace/${newProj.id}`);
          }
        } else {
          await supabase
            .from('projects')
            .update({ code: newCode, updated_at: new Date().toISOString() })
            .eq('id', projectId);
        }

        // Deduct credits in DB
        if (profile) {
          await supabase
            .from('profiles')
            .update({ credits: Math.max(0, (profile.credits ?? 10) - COST) })
            .eq('id', profile.id);
        }
      }

    } catch (err) {
      const errMsg: Message = {
        id: uuidv4(),
        project_id: projectId,
        role: 'assistant',
        content: `Errore: ${err instanceof Error ? err.message : 'Qualcosa è andato storto. Riprova.'}`,
        file_changes: null,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
      setCredits(prev => Math.min(prev + COST, 10)); // Refund
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, credits, project, profile, projectId, router]);

  const handlePublish = async () => {
    if (!project?.code) return;
    const slug = generateSlug(project.name ?? 'app');

    await supabase
      .from('projects')
      .update({ published: true, slug })
      .eq('id', projectId);

    setProject(prev => prev ? { ...prev, published: true, slug } : prev);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const projectTitle = project?.name ?? 'Nuovo Progetto';

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/60 bg-neutral-950 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-none">
              {projectTitle}
            </h1>
            <p className="text-xs text-neutral-600">
              {credits.toFixed(2)} crediti rimanenti
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Split View Toggle */}
          <button
            onClick={() => setIsSplitView(prev => !prev)}
            className={cn(
              'hidden sm:flex w-9 h-9 items-center justify-center rounded-xl transition-colors',
              isSplitView
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
            )}
            title="Vista divisa"
          >
            <Columns2 className="w-5 h-5" />
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(prev => !prev)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
              showPreview
                ? 'bg-white text-neutral-900'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            )}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className={cn(
          'flex flex-col transition-all duration-300',
          isSplitView && showPreview ? 'w-1/2' : 'w-full',
          showPreview && !isSplitView ? 'hidden' : 'flex'
        )}>
          <ChatInterface
            messages={messages}
            isGenerating={isGenerating}
            credits={credits}
            onSendMessage={handleSendMessage}
            onPreviewOpen={() => { setShowPreview(true); if (!isSplitView) setIsSplitView(true); }}
            previewReady={previewReady}
            showUpgradeBanner={showUpgradeBanner}
            onDismissUpgrade={() => setShowUpgradeBanner(false)}
          />
        </div>

        {/* Preview Panel */}
        {(showPreview || isSplitView) && (
          <div className={cn(
            'transition-all duration-300',
            isSplitView ? 'w-1/2 border-l border-neutral-800' : 'w-full'
          )}>
            <PreviewSandbox
              projectId={projectId}
              code={project?.code ?? null}
              slug={project?.slug ?? null}
              published={project?.published ?? false}
              onPublish={handlePublish}
              isFullscreen={isPreviewFullscreen}
              onToggleFullscreen={() => setIsPreviewFullscreen(prev => !prev)}
              onClose={() => { setShowPreview(false); setIsSplitView(false); }}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        projects={projects}
        currentProjectId={projectId}
        onNewProject={() => router.push('/workspace/new')}
        onLogout={handleLogout}
      />
    </div>
  );
}
