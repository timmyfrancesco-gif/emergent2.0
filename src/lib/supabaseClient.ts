'use client';

import { createBrowserClient } from '@supabase/ssr';

const PLACEHOLDER = 'your_supabase_project_url';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && url !== PLACEHOLDER && url.startsWith('http'));
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return a no-op stub so pages can render without real credentials
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: {}, error: new Error('Supabase non configurato') }),
        signInWithPassword: async () => ({ data: {}, error: new Error('Supabase non configurato') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
          }),
          order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            eq: () => ({
              select: () => ({ single: async () => ({ data: null, error: null }) }),
            }),
            select: () => ({ single: async () => ({ data: null, error: null }) }),
          }),
        }),
        delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
