'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Paperclip, Globe, SlidersHorizontal, Mic, ArrowUp,
  Pencil, Eye, X, Loader2, ChevronDown, AlertCircle
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, scrollToBottom]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating || noCredits) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await onSendMessage(trimmed, settings);
  };

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

  return (
    <div className="flex flex-col h-full">
      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex-shrink-0">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <span>⚡</span>
            <span className="font-medium">Il tuo upgrade gratuito è pronto.</span>
            <button className="underline hover:no-underline font-semibold">
              Richiedilo →
            </button>
          </div>
          {onDismissUpgrade && (
            <button onClick={onDismissUpgrade} className="text-amber-400/60 hover:text-amber-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-neutral-600" />
            </div>
            <p className="text-neutral-500 font-medium">Inizia a creare</p>
            <p className="text-neutral-700 text-sm mt-1">
              Descrivi la tua idea per generare la prima versione
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            expandedFile={expandedFile}
            onToggleFile={setExpandedFile}
          />
        ))}

        {isGenerating && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Preview Badge */}
      {previewReady && (
        <div className="flex justify-center px-4 mb-2 flex-shrink-0">
          <button
            onClick={onPreviewOpen}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-white text-neutral-900 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold text-sm animate-fade-in"
          >
            <Eye className="w-4 h-4" />
            La tua Preview è pronta
          </button>
        </div>
      )}

      {/* No Credits Warning */}
      {noCredits && (
        <div className="mx-4 mb-3 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">Crediti esauriti</p>
            <p className="text-xs text-red-400/70">
              Acquista altri crediti per continuare a generare
            </p>
          </div>
          <button className="px-3 py-1.5 btn-gold rounded-xl text-xs font-semibold flex-shrink-0">
            Acquista
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className={cn(
          'bg-neutral-800/80 border rounded-2xl overflow-hidden transition-all',
          noCredits
            ? 'border-red-500/30 opacity-60'
            : 'border-neutral-700/60 input-ring'
        )}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={noCredits ? 'Crediti esauriti...' : 'Invia un messaggio all\'agente...'}
            disabled={noCredits || isGenerating}
            rows={1}
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm px-4 pt-4 pb-2 resize-none outline-none disabled:cursor-not-allowed"
            style={{ minHeight: '52px' }}
          />

          <div className="flex items-center justify-between px-3 pb-3">
            {/* Left Icons */}
            <div className="flex items-center gap-1">
              <ToolbarButton icon={Paperclip} title="Allega file" />
              <ToolbarButton icon={Globe} title="Ricerca web" />
              <button
                onClick={() => setAdvancedOpen(true)}
                className={cn(
                  'p-2 rounded-xl hover:bg-neutral-700/60 transition-colors',
                  advancedOpen ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 hover:text-neutral-200'
                )}
                title="Controlli avanzati"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <ToolbarButton icon={Mic} title="Input vocale" />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating || noCredits}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                input.trim() && !isGenerating && !noCredits
                  ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm'
                  : 'bg-neutral-700/50 text-neutral-600 cursor-not-allowed'
              )}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings Modal */}
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

function ToolbarButton({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <button
      className="p-2 rounded-xl hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200 transition-colors"
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
      <div className={cn('max-w-[85%] space-y-2', isUser ? 'items-end' : 'items-start')}>
        {/* Main Bubble */}
        <div className={cn(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser ? 'msg-user text-white rounded-br-md' : 'msg-assistant text-neutral-200 rounded-bl-md'
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* File Changes */}
        {!isUser && message.file_changes && message.file_changes.length > 0 && (
          <div className="space-y-1.5 w-full">
            {message.file_changes.map((change: FileChange, idx: number) => {
              const fileKey = `${message.id}-${idx}`;
              const isExpanded = expandedFile === fileKey;
              return (
                <button
                  key={fileKey}
                  onClick={() => onToggleFile(isExpanded ? null : fileKey)}
                  className="code-change-card w-full flex items-center gap-3 px-3.5 py-2.5 text-left"
                >
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0',
                    change.action === 'created' ? 'bg-emerald-500/20' :
                    change.action === 'edited' ? 'bg-blue-500/20' : 'bg-red-500/20'
                  )}>
                    <Pencil className={cn(
                      'w-3 h-3',
                      change.action === 'created' ? 'text-emerald-400' :
                      change.action === 'edited' ? 'text-blue-400' : 'text-red-400'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-300 truncate">
                      {change.action === 'created' ? 'Creato' :
                       change.action === 'edited' ? 'Modificato' : 'Eliminato'}
                       {' '}<span className="font-mono text-neutral-400">{change.path}</span>
                    </div>
                    {change.description && (
                      <div className="text-xs text-neutral-600 truncate">{change.description}</div>
                    )}
                  </div>
                  <ChevronDown className={cn(
                    'w-3.5 h-3.5 text-neutral-600 transition-transform flex-shrink-0',
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
    <div className="flex justify-start">
      <div className="msg-assistant px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
