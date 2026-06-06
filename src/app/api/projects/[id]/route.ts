import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { generateSlug } from '@/lib/utils';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore server' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const body = await req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.code !== undefined) updates.code = body.code;
    if (body.name !== undefined) updates.name = body.name;
    if (body.published !== undefined) {
      updates.published = body.published;
      if (body.published && !body.slug) {
        updates.slug = generateSlug(body.name ?? id);
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore server' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore server' },
      { status: 500 }
    );
  }
}
