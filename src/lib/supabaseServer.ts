import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const PLACEHOLDER = 'your_supabase_project_url';

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || url === PLACEHOLDER || !url.startsWith('http')) {
    throw new Error('Supabase non configurato — imposta le variabili nel file .env.local');
  }

  const cookieStore = await cookies();

  return createServerClient(url, key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component; middleware handles refresh
          }
        },
      },
    }
  );
}
