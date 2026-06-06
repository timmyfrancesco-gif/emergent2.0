'use client';

import { useState } from 'react';
import { X, Paperclip, ChevronDown, Github, Cpu, Wand2, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AVAILABLE_MODELS } from '@/lib/gemini';
import type { AdvancedSettings } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AdvancedSettings;
  onSave: (settings: AdvancedSettings) => void;
}

export default function AdvancedSettingsModal({ isOpen, onClose, settings, onSave }: Props) {
  const [local, setLocal] = useState<AdvancedSettings>(settings);
  const [modelOpen, setModelOpen] = useState(false);

  const handleBudget = (delta: number) => {
    setLocal(prev => ({ ...prev, budget: Math.max(1, Math.min(100, prev.budget + delta)) }));
  };

  const handleSave = () => {
    onSave(local);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 overlay-backdrop transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto bottom-sheet',
          isOpen ? 'open' : ''
        )}
      >
        <div className="bg-neutral-900 border border-neutral-700/60 rounded-t-3xl overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-neutral-600" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-white">Controlli Avanzati</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Maxx Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Maxx</span>
                    <span className="text-yellow-400 text-sm">✨</span>
                  </div>
                  <span className="text-xs text-neutral-500">Modalità generazione avanzata</span>
                </div>
              </div>
              <button
                onClick={() => setLocal(prev => ({ ...prev, maxxEnabled: !prev.maxxEnabled }))}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors duration-200',
                  local.maxxEnabled ? 'bg-emerald-500' : 'bg-neutral-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                    local.maxxEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            {/* Model Selector */}
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">
                Seleziona Modello
              </label>
              <div className="relative">
                <button
                  onClick={() => setModelOpen(!modelOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/40 hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <span className="text-white text-sm font-medium">
                      {AVAILABLE_MODELS.find(m => m.id === local.model)?.name ?? local.model}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-neutral-400 transition-transform',
                      modelOpen ? 'rotate-180' : ''
                    )}
                  />
                </button>
                {modelOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden z-10 shadow-xl animate-fade-in">
                    {AVAILABLE_MODELS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setLocal(prev => ({ ...prev, model: m.id })); setModelOpen(false); }}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-700/60 transition-colors',
                          local.model === m.id ? 'text-emerald-400' : 'text-white'
                        )}
                      >
                        <span className="text-sm font-medium">{m.name}</span>
                        {m.badge && (
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            m.badge === 'Raccomandato' ? 'bg-emerald-500/20 text-emerald-400' :
                            m.badge === 'Veloce' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          )}>
                            {m.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* MCP Tools */}
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/40 hover:border-neutral-600 transition-colors group">
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-white font-medium">Seleziona Strumenti MCP</span>
                <span className="text-xs bg-orange-500/90 text-white px-2 py-0.5 rounded-full font-semibold">
                  Nuovo
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400 -rotate-90" />
            </button>

            {/* GitHub */}
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/40 hover:border-neutral-600 transition-colors group">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-white font-medium">Connetti a GitHub</span>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400 -rotate-90" />
            </button>

            {/* Template */}
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">
                Seleziona Template
              </label>
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/40">
                <span className="text-sm text-neutral-400 font-mono truncate flex-1">
                  {local.template || 'us-central1-docker.pkg.dev/emergent-defa…'}
                </span>
                <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">
                Budget Crediti
              </label>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/40">
                <span className="text-sm text-neutral-400">Limite per generazione</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleBudget(-5)}
                    className="w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-white" />
                  </button>
                  <div className="flex items-center gap-1.5 min-w-[48px] justify-center">
                    <span className="text-white font-semibold text-lg">{local.budget}</span>
                    <span className="text-yellow-400 text-base">🪙</span>
                  </div>
                  <button
                    onClick={() => handleBudget(5)}
                    className="w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl btn-gold font-semibold text-sm mt-2"
            >
              Salva Impostazioni
            </button>

            <div className="h-4" />
          </div>
        </div>
      </div>
    </>
  );
}
