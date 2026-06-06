'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Maximize2, Minimize2, RefreshCw, ExternalLink,
  Globe, Eye, X, Share2, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectCode } from '@/lib/types';

interface Props {
  projectId: string;
  code: ProjectCode | null;
  slug: string | null;
  published: boolean;
  onPublish: () => Promise<void>;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
}

export default function PreviewSandbox({
  projectId,
  code,
  slug,
  published,
  onPublish,
  isFullscreen = false,
  onToggleFullscreen,
  onClose,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const htmlContent = code?.files?.find(f => f.path === 'index.html')?.content ?? '';

  const refresh = useCallback(() => {
    setIframeKey(prev => prev + 1);
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = async () => {
    if (!slug) return;
    const url = `${window.location.origin}/site/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    if (slug) {
      window.open(`/site/${slug}`, '_blank');
    }
  };

  return (
    <div className={cn(
      'flex flex-col bg-neutral-950 border border-neutral-800',
      isFullscreen
        ? 'fixed inset-0 z-50 rounded-none'
        : 'rounded-2xl overflow-hidden h-full'
    )}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
        {/* Browser dots */}
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg min-w-0">
          <Globe className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
          <span className="text-xs text-neutral-400 truncate font-mono">
            {published && slug
              ? `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/site/${slug}`
              : `preview/${projectId}`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={refresh}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Ricarica"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {published && slug && (
            <>
              <button
                onClick={handleCopyLink}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Copia link"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={handleOpenExternal}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Apri in nuova scheda"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {isFullscreen
                ? <Minimize2 className="w-3.5 h-3.5" />
                : <Maximize2 className="w-3.5 h-3.5" />
              }
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {htmlContent ? (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            srcDoc={htmlContent}
            className="preview-frame"
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-popups"
            title="Preview"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 flex items-center justify-center">
              <Eye className="w-8 h-8 text-neutral-600" />
            </div>
            <div className="text-center">
              <p className="text-neutral-500 font-medium">Nessuna preview disponibile</p>
              <p className="text-neutral-600 text-sm mt-1">
                Invia un messaggio per generare la tua app
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Publish Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            published ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'
          )} />
          <span className="text-xs text-neutral-500">
            {published ? 'Pubblicato e live' : 'Non pubblicato'}
          </span>
        </div>

        <button
          onClick={handlePublish}
          disabled={isPublishing || !htmlContent}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
            published
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              : 'btn-gold',
            (isPublishing || !htmlContent) ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          <Globe className="w-4 h-4" />
          {isPublishing ? 'Pubblicando...' : published ? 'Aggiorna' : 'Pubblica'}
        </button>
      </div>
    </div>
  );
}
