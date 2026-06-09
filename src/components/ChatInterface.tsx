'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Paperclip, Globe, SlidersHorizontal, Mic, ArrowUp,
  Pencil, Eye, X, Loader2, ChevronDown, AlertCircle, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message, FileChange, AdvancedSettings } from '@/lib/types';
import AdvancedSettingsModal from './AdvancedSettingsModal';

interface Props {
  messages: Message[];
  isGenerating: boolean;
  credits: number;
  onSendMessage: (content: string, settings: AdvancedSettings) => Promise<void>;
  onPreviewOpen: () => void;
  previewReady: boolean;
  showUpgradeBanner?: boolean;
  onDismissUpgrade?: () => void;
}

const DEFAULT_SETTINGS: AdvancedSettings = {
  model: 'gemini-1.5-pro',
  budget: 25,
  maxxEnabled: false,
  template: 'us-central1-docker.pkg.dev/emergent-defa…',
};

export default function ChatInterface({
  messages,
  isGenerating,
  credits,
  onSendMessage,
  onPreviewOpen,
  previewReady,
  showUpgradeBanner = false,
  onDismissUpgrade,
}: Props) {
  const [input, setInput] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [settings, setSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noCredits = credits <= 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isGenerating]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating || noCredits) return;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await onSendMessage(trimmed, settings);
  }, [input, isGenerating, noCredits, onSendMessage, settings]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const canSend = input.trim().length > 0 && !isGenerating && !noCredits;

  return (
    <div className="flex flex-col h-full">
      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex-shrink-0 animate-fade-in">
          <div className="flex items-center gap-2 text-amber-400 text-sm flex-wrap">
            <span>⚡</span>
            <span className="font-medium">Il tuo upgrade gratuito è pronto.</span>
            <button className="underline hover:no-underline font-semibold text-amber-300">
              Richiedilo →
            </button>
          </div>
          {onDismissUpgrade && (
            <button
              onClick={onDismissUpgrade}
              className="text-amber-400/60 hover:text-amber-400 flex-shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-neutral-600" />
            </div>
            <p className="text-neutral-500 font-medium">Inizia a creare</p>
            <p className="text-neutral-700 text-sm mt-1">
              Descrivi la tua idea per generare l&apos;app
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={msg.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            <MessageBubble
              message={msg}
              expandedFile={expandedFile}
              onToggleFile={setExpandedFile}
            />
          </div>
        ))}

        {isGenerating && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Preview Badge */}
      {previewReady && (
        <div className="flex justify-center px-4 mb-3 flex-shrink-0">
          <button
            onClick={onPreviewOpen}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 font-semibold text-sm animate-fade-in active:scale-95"
          >
            <Eye className="w-4 h-4" />
            La tua Preview è pronta
          </button>
        </div>
      )}

      {/* No Credits Warning */}
      {noCredits && (
        <div className="mx-4 mb-3 flex items-center gap-3 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex-shrink-0 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">Crediti esauriti</p>
            <p className="text-xs text-red-400/70">Acquista altri crediti per continuare</p>
          </div>
          <button className="px-3 py-1.5 btn-gold rounded-xl text-xs font-semibold flex-shrink-0">
            Acquista
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className={cn(
          'bg-neutral-800/80 border rounded-2xl overflow-hidden transition-all duration-200',
          noCredits
            ? 'border-red-500/20 opacity-60'
            : 'border-neutral-700/60 focus-within:border-emerald-500/30'
        )}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={
              noCredits
                ? 'Crediti esauriti...'
                : isGenerating
                  ? 'Generando...'
                  : 'Invia un messaggio all\'agente...'
            }
            disabled={noCredits || isGenerating}
            rows={1}
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm px-4 pt-3.5 pb-2 resize-none outline-none disabled:cursor-not-allowed transition-all"
            style={{ minHeight: '48px', maxHeight: '200px' }}
          />

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-0.5">
              <IconBtn icon={Paperclip} title="Allega" />
              <IconBtn icon={Globe} title="Web search" />
              <button
                onClick={() => setAdvancedOpen(true)}
                className={cn(
                  'p-2 rounded-xl transition-all active:scale-95',
                  advancedOpen
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-700/60'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <IconBtn icon={Mic} title="Voce" />
            </div>

            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95',
                canSend
                  ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm'
                  : 'bg-neutral-700/50 text-neutral-600 cursor-not-allowed'
              )}
            >
              {isGenerating
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <ArrowUp className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>

      <AdvancedSettingsModal
        isOpen={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
}

/* ---- Sub-components ---- */

function IconBtn({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <button
      className="p-2 rounded-xl hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-200 transition-all active:scale-95"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function MessageBubble({
  message,
  expandedFile,
  onToggleFile,
}: {
  message: Message;
  expandedFile: string | null;
  onToggleFile: (id: string | null) => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[88%] space-y-2')}>
        {/* Bubble */}
        <div className={cn(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-white rounded-br-md'
            : 'bg-neutral-800/60 border border-neutral-700/40 text-neutral-200 rounded-bl-md'
        )}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* File Changes */}
        {!isUser && message.file_changes && message.file_changes.length > 0 && (
          <div className="space-y-1.5">
            {message.file_changes.map((change: FileChange, idx: number) => {
              const key = `${message.id}-${idx}`;
              const isExpanded = expandedFile === key;
              const colors = {
                created: { bg: 'bg-emerald-500/15', icon: 'text-emerald-400', label: 'Creato' },
                edited: { bg: 'bg-blue-500/15', icon: 'text-blue-400', label: 'Modificato' },
                deleted: { bg: 'bg-red-500/15', icon: 'text-red-400', label: 'Eliminato' },
              };
              const c = colors[change.action] ?? colors.edited;

              return (
                <button
                  key={key}
                  onClick={() => onToggleFile(isExpanded ? null : key)}
                  className="code-change-card w-full flex items-center gap-3 px-3.5 py-2.5 text-left"
                >
                  <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
                    <Pencil className={cn('w-3 h-3', c.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-300 truncate">
                      <span className="text-neutral-500">{c.label} </span>
                      <span className="font-mono">{change.path}</span>
                    </div>
                    {change.description && (
                      <div className="text-xs text-neutral-600 truncate mt-0.5">
                        {change.description}
                      </div>
                    )}
                  </div>
                  <ChevronDown className={cn(
                    'w-3.5 h-3.5 text-neutral-600 transition-transform duration-200 flex-shrink-0',
                    isExpanded ? 'rotate-180' : ''
                  )} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-neutral-800/60 border border-neutral-700/40 px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="typing-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
