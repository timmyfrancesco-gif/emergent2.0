import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerateResponse, CodeFile } from './types';

const SYSTEM_PROMPT = `You are an expert web application generator. When given a description or modification request, you generate complete, production-ready web application code.

CRITICAL: You MUST respond with ONLY a valid JSON object — no markdown, no code fences, no explanation outside the JSON.

Response format:
{
  "files": [
    {
      "path": "index.html",
      "language": "html",
      "content": "...complete self-contained HTML with all CSS and JS inline..."
    }
  ],
  "summary": "Brief one-sentence description of what was created or changed",
  "fileChanges": [
    { "path": "index.html", "action": "created", "description": "Main application HTML" }
  ]
}

Rules:
- Generate a SINGLE self-contained index.html file with all CSS and JavaScript embedded inline
- Make the UI beautiful, modern, responsive, with a professional dark theme by default
- Use real, working functionality (forms, modals, animations, data)
- Include proper HTML5 structure, viewport meta tag, and semantic elements
- For action words like "created", "edited", "deleted" — use lowercase
- Do NOT include any text outside the JSON object
- When modifying existing code, preserve and improve upon it`;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

export async function generateCode(
  prompt: string,
  existingCode?: CodeFile[]
): Promise<GenerateResponse> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: 'gemini-1.5-pro',
    systemInstruction: SYSTEM_PROMPT,
  });

  let fullPrompt = prompt;

  if (existingCode && existingCode.length > 0) {
    const codeContext = existingCode
      .map(f => `=== ${f.path} ===\n${f.content}`)
      .join('\n\n');
    fullPrompt = `EXISTING CODE:\n${codeContext}\n\nMODIFICATION REQUEST:\n${prompt}`;
  }

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text().trim();

  // Strip any accidental markdown fences
  const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  try {
    const parsed = JSON.parse(jsonText) as GenerateResponse;
    return parsed;
  } catch {
    // Fallback: wrap raw content in expected structure
    return {
      files: [{ path: 'index.html', content: text, language: 'html' }],
      summary: 'Applicazione generata',
      fileChanges: [{ path: 'index.html', action: 'created', description: 'Main file' }],
    };
  }
}

export const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', badge: 'Raccomandato' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', badge: 'Veloce' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', badge: 'Nuovo' },
];
