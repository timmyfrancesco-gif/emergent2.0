import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/lib/gemini';
import { generateDemoResponse } from '@/lib/demoGenerator';
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
      // Return a rich, prompt-aware demo response when API key is not configured
      return NextResponse.json(generateDemoResponse(prompt));
    }

    const result = await generateCode(prompt, existingCode);
    return NextResponse.json(result);

  } catch (err) {
    console.error('[/api/generate]', err);
    const message = err instanceof Error ? err.message : 'Errore interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
