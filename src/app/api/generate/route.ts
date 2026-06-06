import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/lib/gemini';
import type { CodeFile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, existingCode, model } = body as {
      prompt: string;
      projectId?: string;
      existingCode?: CodeFile[];
      model?: string;
    };

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Il campo prompt è obbligatorio' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
      // Return a demo response when API key is not configured
      const demoHtml = generateDemoHTML(prompt);
      return NextResponse.json({
        files: [{ path: 'index.html', content: demoHtml, language: 'html' }],
        summary: `Demo: ${prompt.slice(0, 80)}`,
        fileChanges: [
          { path: 'index.html', action: 'created', description: 'Pagina principale generata' },
        ],
      });
    }

    const result = await generateCode(prompt, existingCode);
    return NextResponse.json(result);

  } catch (err) {
    console.error('[/api/generate]', err);
    const message = err instanceof Error ? err.message : 'Errore interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateDemoHTML(prompt: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(prompt.slice(0, 60))}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a; color: #fff; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3);
      color: #4ADE80; padding: 6px 14px; border-radius: 9999px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
      text-transform: uppercase; margin-bottom: 24px;
    }
    h1 { font-size: clamp(2rem, 6vw, 4rem); font-weight: 800; text-align: center;
         background: linear-gradient(135deg, #67E8F9, #a78bfa); -webkit-background-clip: text;
         -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; margin-bottom: 16px; }
    p { color: #737373; text-align: center; max-width: 480px; line-height: 1.6; margin-bottom: 40px; font-size: 1.05rem; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .btn { padding: 12px 28px; border-radius: 9999px; font-size: 15px; font-weight: 600;
           cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, #F59E0B, #D97706); color: #000; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
    .btn-secondary { background: rgba(255,255,255,0.05); color: #fff;
                     border: 1px solid rgba(255,255,255,0.1); }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                 gap: 16px; margin-top: 48px; width: 100%; max-width: 800px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px; padding: 24px; transition: all 0.2s; }
    .card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15);
                  transform: translateY(-2px); }
    .card-icon { font-size: 2rem; margin-bottom: 12px; }
    .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 6px; }
    .card p { font-size: 0.85rem; color: #555; margin: 0; }
    .api-note { margin-top: 48px; padding: 16px 24px;
                background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
                border-radius: 12px; font-size: 0.8rem; color: #D97706; text-align: center; max-width: 500px; }
  </style>
</head>
<body>
  <span class="badge">⚡ Demo Mode</span>
  <h1>${escapeHtml(prompt.slice(0, 50))}</h1>
  <p>Questa è una preview demo. Configura la tua GEMINI_API_KEY nel file <code style="color:#67E8F9;">.env.local</code> per generare applicazioni reali con AI.</p>
  <div class="actions">
    <button class="btn btn-primary" onclick="alert('Funzionalità pronta!')">Inizia Ora</button>
    <button class="btn btn-secondary" onclick="this.textContent='Copiato!'">Condividi</button>
  </div>
  <div class="card-grid">
    <div class="card">
      <div class="card-icon">🚀</div>
      <h3>Veloce</h3>
      <p>Generazione in pochi secondi con Gemini AI</p>
    </div>
    <div class="card">
      <div class="card-icon">🎨</div>
      <h3>Personalizzabile</h3>
      <p>Modifica e perfeziona in chat</p>
    </div>
    <div class="card">
      <div class="card-icon">🌐</div>
      <h3>Pubblicabile</h3>
      <p>Pubblica online con un click</p>
    </div>
  </div>
  <div class="api-note">
    ⚠️ Aggiungi <strong>GEMINI_API_KEY</strong> nel file .env.local per abilitare la generazione AI reale
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
