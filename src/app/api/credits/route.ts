import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return NextResponse.json({ credits: data?.credits ?? 0 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore server' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const { amount, operation } = await req.json() as {
      amount: number;
      operation: 'add' | 'deduct';
    };

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Importo non valido' }, { status: 400 });
    }

    // Get current credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const current = profile?.credits ?? 0;
    const newBalance = operation === 'add'
      ? current + amount
      : Math.max(0, current - amount);

    const { data, error } = await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', user.id)
      .select('credits')
      .single();

    if (error) throw error;
    return NextResponse.json({ credits: data?.credits ?? newBalance });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore server' },
      { status: 500 }
    );
  }
}
