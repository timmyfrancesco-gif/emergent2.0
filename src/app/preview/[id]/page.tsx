'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch the project code from the API
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(`preview_${id}`)
      : null;
    if (stored) setHtml(stored);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <html>
        <body style={{ margin: 0, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ color: '#666', fontFamily: 'sans-serif' }}>Caricamento preview...</div>
        </body>
      </html>
    );
  }

  if (!html) {
    return (
      <html>
        <body style={{ margin: 0, background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '2rem' }}>👁️</div>
          <p style={{ color: '#666', margin: 0 }}>Preview non disponibile</p>
          <p style={{ color: '#444', fontSize: '13px', margin: 0 }}>Configura Supabase per abilitare le preview</p>
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
          sandbox="allow-scripts allow-forms allow-same-origin"
          title="Preview"
        />
      </body>
    </html>
  );
}
