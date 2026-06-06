import { createServerSupabaseClient } from '@/lib/supabaseServer';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Preview — Emergent' };

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let html = '';

  try {
    const supabase = await createServerSupabaseClient();
    const { data: project } = await supabase
      .from('projects')
      .select('code, name')
      .eq('id', id)
      .single();

    if (project?.code) {
      const code = project.code as { files?: Array<{ path: string; content: string }> };
      html = code.files?.find(f => f.path === 'index.html')?.content ?? '';
    }
  } catch {
    html = '';
  }

  if (!html) {
    return (
      <html>
        <body style={{ margin: 0, background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👁️</div>
            <p style={{ color: '#666' }}>Nessun contenuto disponibile per questa preview.</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0 }}>
        <iframe
          srcDoc={html}
          style={{ border: 'none', width: '100vw', height: '100vh' }}
          sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-popups"
          title="App Preview"
        />
      </body>
    </html>
  );
}
