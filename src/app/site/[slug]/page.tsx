import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} — Creato con Emergent`,
    description: 'Applicazione generata con Emergent AI',
  };
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let html = '';

  try {
    const supabase = await createServerSupabaseClient();
    const { data: project } = await supabase
      .from('projects')
      .select('code, published, name')
      .eq('slug', slug)
      .single();

    if (!project?.published) {
      notFound();
    }

    const code = project.code as { files?: Array<{ path: string; content: string }> };
    html = code?.files?.find(f => f.path === 'index.html')?.content ?? '';
  } catch {
    notFound();
  }

  if (!html) notFound();

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ minHeight: '100vh' }}
        />
        {/* Powered-by badge */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontFamily: 'sans-serif',
            textDecoration: 'none',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 9999,
          }}
        >
          ⚡ Creato con Emergent
        </a>
      </body>
    </html>
  );
}
