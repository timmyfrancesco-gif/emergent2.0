'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SitePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production with Supabase, fetch published project by slug
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(`site_${slug}`)
      : null;
    if (stored) setHtml(stored);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666', fontFamily: 'sans-serif' }}>Caricamento...</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', gap: '12px' }}>
        <div style={{ fontSize: '2rem' }}>🌐</div>
        <p style={{ color: '#fff', margin: 0, fontWeight: 600 }}>/{slug}</p>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Questo sito non è ancora pubblicato.</p>
        <a href="/" style={{ marginTop: '8px', color: '#4ADE80', fontSize: '13px', textDecoration: 'none' }}>
          ← Torna a Emergent
        </a>
      </div>
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <a
        href="/"
        style={{
          position: 'fixed', bottom: '16px', right: '16px',
          background: 'rgba(0,0,0,0.8)', color: '#fff',
          padding: '6px 12px', borderRadius: '9999px', fontSize: '11px',
          fontFamily: 'sans-serif', textDecoration: 'none',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 9999,
        }}
      >
        ⚡ Creato con Emergent
      </a>
    </>
  );
}
