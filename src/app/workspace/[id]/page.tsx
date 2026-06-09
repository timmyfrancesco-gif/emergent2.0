'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Menu, Columns2, LayoutPanelLeft, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabaseClient';
import { localStore } from '@/lib/localStore';
import { generateDemoResponse } from '@/lib/demoGenerator';
import { generateSlug } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import PreviewSandbox from '@/components/PreviewSandbox';
import type { Message, Project, Profile, AdvancedSettings, ProjectCode } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

function buildClarifyQuestion(prompt: string): string {
  const p = prompt.toLowerCase().trim();
  if (/app|applicazione/.test(p)) {
    return `Ottima idea! Per creare un'app che funzioni davvero bene ho bisogno di qualche dettaglio:\n\n• Cosa deve fare esattamente? (es. gestire prenotazioni, vendere prodotti, tracciare attività...)\n• Chi sono gli utenti principali?\n• Hai funzionalità specifiche in mente?\n\nRispondimi e comincio subito a costruirla!`;
  }
  if (/sito|website|web|pagina/.test(p)) {
    return `Perfetto! Per creare un sito che funzioni davvero bene dimmi:\n\n• È per un'azienda, portfolio personale, blog o e-commerce?\n• Hai un settore o argomento specifico?\n• Che tipo di contenuti dovrà avere?\n\nCon questi dettagli creo qualcosa di professionale!`;
  }
  return `Interessante! Puoi darmi qualche dettaglio in più?\n\n• Qual è lo scopo principale del progetto?\n• Chi sono gli utenti?\n• Hai funzionalità o sezioni specifiche in mente?\n\nPiù mi dici, meglio riesco a costruirlo!`;
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WorkspaceInner />
    </Suspense>
  );
}

function WorkspaceInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // On GitHub Pages (static export) we always land on /workspace/demo
  // and pass the real project UUID as ?id=... query param.
  // On Vercel/SSR the UUID is part of the URL path instead.
  const queryId = searchParams?.get('id');
  const projectId = queryId ?? (params?.id as string) ?? 'demo';
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [credits, setCredits] = useState(10);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const [generationStep, setGenerationStep] = useState<string | null>(null);

  // Load local state
  useEffect(() => {
    // Load from localStorage
    const localProj = localStore.getProject(projectId);
    const localState = localStore.getState(projectId);

    if (localProj) {
      setProject({ ...localProj, user_id: 'local' } as Project);
    } else {
      // New project — create placeholder
      const newProj = {
        id: projectId,
        name: 'Nuovo Progetto',
        slug: null,
        code: null,
        published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStore.saveProject(newProj);
      setProject({ ...newProj, user_id: 'local' } as Project);
    }

    if (localState.messages.length > 0) {
      setMessages(localState.messages);
    }
    if (localState.code) {
      setPreviewReady(true);
    }

    // Load all projects for sidebar
    setAllProjects(localStore.getProjects().map(p => ({ ...p, user_id: 'local' } as Project)));

    // Try to load Supabase user (optional)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => { if (data) { setProfile(data); setCredits(data.credits); } });
      }
    }).catch(() => {});
  }, [projectId]);

  // Send initial prompt from URL once
  useEffect(() => {
    const prompt = searchParams?.get('prompt');
    if (prompt && !initialPromptSent && messages.length === 0) {
      setInitialPromptSent(true);
      // Small delay for smooth UX
      setTimeout(() => {
        handleSendMessage(prompt, {
          model: 'gemini-1.5-pro',
          budget: 25,
          maxxEnabled: false,
          template: '',
        });
      }, 400);
    }
  }, [searchParams, initialPromptSent, messages.length]);

  const handleSendMessage = useCallback(async (
    content: string,
    settings: AdvancedSettings
  ) => {
    if (isGenerating) return;
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

    // Ask for clarification on very vague prompts
    const wordCount = content.trim().split(/\s+/).length;
    const hasKeyword = /netflix|stream|film|serie|shop|store|ecommerce|negozio|dashboard|analytic|metric|admin|blog|articol|post|todo|task|chat|messag|landing|startup|saas|portfolio|ristorante|restaurant|booking|prenot|social|forum|news/i.test(content);

    if (wordCount < 4 && !hasKeyword) {
      await new Promise(r => setTimeout(r, 600));
      const clarifyMsg: Message = {
        id: uuidv4(),
        project_id: projectId,
        role: 'assistant',
        content: buildClarifyQuestion(content),
        file_changes: null,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, clarifyMsg]);
      const st = localStore.getState(projectId);
      localStore.saveState(projectId, {
        messages: [...st.messages, userMsg, clarifyMsg],
        code: st.code,
      });
      setIsGenerating(false);
      return;
    }

    // Progressive generation steps shown while code is being generated
    const STEPS = [
      '🔍 Analizzo la tua richiesta...',
      '🏗️ Progetto l\'architettura...',
      '⚡ Scrivo il codice...',
      '🎨 Stilo l\'interfaccia...',
      '✨ Rifinisco i dettagli...',
    ];
    const DELAYS = [1400, 1700, 2300, 1600, 1000];

    setGenerationStep(STEPS[0]);

    // Start generation immediately in parallel with the step animation
    const existingCode = localStore.getState(projectId).code?.files;
    const generatePromise = (async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content, existingCode, model: settings.model }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.files?.length) return json;
        }
      } catch { /* API not available */ }
      return generateDemoResponse(content);
    })();

    try {
      // Animate through steps while generation runs in parallel
      for (let i = 1; i < STEPS.length; i++) {
        await new Promise(r => setTimeout(r, DELAYS[i - 1]));
        setGenerationStep(STEPS[i]);
      }

      const generated = await generatePromise;

      // Brief pause on final step before revealing result
      await new Promise(r => setTimeout(r, DELAYS[STEPS.length - 1]));
      setGenerationStep(null);

      const assistantMsg: Message = {
        id: uuidv4(),
        project_id: projectId,
        role: 'assistant',
        content: generated.summary ?? 'App generata con successo ✨',
        file_changes: generated.fileChanges ?? [],
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      const newCode: ProjectCode = {
        files: generated.files,
        lastUpdated: new Date().toISOString(),
      };

      localStore.saveState(projectId, {
        messages: [...localStore.getState(projectId).messages, userMsg, assistantMsg],
        code: newCode,
      });

      const currentProj = localStore.getProject(projectId);
      if (currentProj) {
        const updatedName = currentProj.name === 'Nuovo Progetto'
          ? content.slice(0, 50)
          : currentProj.name;
        localStore.saveProject({ ...currentProj, code: newCode, name: updatedName, updated_at: new Date().toISOString() });
      }

      setProject(prev => prev ? { ...prev, code: newCode } : prev);
      setPreviewReady(true);
      setCredits(prev => Math.max(0, prev - COST));

      if (!showPreview) {
        setShowPreview(true);
      }

    } catch (err) {
      const errMsg: Message = {
        id: uuidv4(),
        project_id: projectId,
        role: 'assistant',
        content: `Errore: ${err instanceof Error ? err.message : 'Riprova.'}`,
        file_changes: null,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
      localStore.addMessage(projectId, errMsg);
    } finally {
      setGenerationStep(null);
      setIsGenerating(false);
    }
  }, [isGenerating, projectId, showPreview]);

  const handlePublish = async () => {
    if (!project?.code) return;
    const slug = generateSlug(project.name ?? 'app');
    const updated = { ...project, published: true, slug };
    setProject(updated);
    const local = localStore.getProject(projectId);
    if (local) localStore.saveProject({ ...local, published: true, slug });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setProfile(null);
    router.push('/');
  };

  const projectTitle = project?.name === 'Nuovo Progetto' && messages.length > 0
    ? messages[0]?.content?.slice(0, 40) ?? 'Progetto'
    : (project?.name ?? 'Nuovo Progetto');

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-800/60 bg-neutral-950/95 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 ml-1">
            <h1 className="text-sm font-semibold text-white truncate max-w-[160px] sm:max-w-xs">
              {projectTitle}
            </h1>
            {credits <= 5 && (
              <p className="text-xs text-amber-500/80">{credits.toFixed(1)} crediti</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Split view toggle (desktop) */}
          {showPreview && (
            <button
              onClick={() => setShowPreview(false)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-all active:scale-95"
            >
              <LayoutPanelLeft className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          )}

          <button
            onClick={() => setShowPreview(prev => !prev)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95',
              showPreview
                ? 'bg-white text-neutral-900'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            )}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </header>

      {/* Main Content — Chat + Preview split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat */}
        <div className={cn(
          'flex flex-col transition-all duration-300 ease-in-out',
          showPreview ? 'hidden sm:flex sm:w-1/2' : 'w-full'
        )}>
          <ChatInterface
            messages={messages}
            isGenerating={isGenerating}
            generationStep={generationStep}
            credits={credits}
            onSendMessage={handleSendMessage}
            onPreviewOpen={() => setShowPreview(true)}
            previewReady={previewReady}
            showUpgradeBanner={showUpgradeBanner}
            onDismissUpgrade={() => setShowUpgradeBanner(false)}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className={cn(
            'transition-all duration-300 ease-in-out',
            'w-full sm:w-1/2 sm:border-l sm:border-neutral-800'
          )}>
            <PreviewSandbox
              projectId={projectId}
              code={project?.code ?? null}
              slug={project?.slug ?? null}
              published={project?.published ?? false}
              onPublish={handlePublish}
              isFullscreen={isPreviewFullscreen}
              onToggleFullscreen={() => setIsPreviewFullscreen(prev => !prev)}
              onClose={() => setShowPreview(false)}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        projects={allProjects}
        currentProjectId={projectId}
        onNewProject={() => router.push('/')}
        onLogout={handleLogout}
      />
    </div>
  );
}
