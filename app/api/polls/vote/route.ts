import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { pollId, option, userIp } = await req.json();

    if (!pollId || !option || !userIp) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // تسجيل صوت المستخدم (يمنع التكرار تلقائياً بالـ Unique Constraint)
    const { error: voteError } = await supabaseAdmin.from('user_votes').insert({
      poll_id: pollId,
      voter_ip: userIp,
      selected_option: option,
    });

    if (voteError) {
      return NextResponse.json({ message: 'لقد قمت بالتصويت بالفعل لهذه المباراة!' }, { status: 400 });
    }

    // زيادة العداد للجهة المختارة
    const columnToUpdate = option === 'home' ? 'home_votes' : option === 'away' ? 'away_votes' : 'draw_votes';
    
    const { data: currentPoll } = await supabaseAdmin
      .from('match_polls')
      .select(columnToUpdate)
      .eq('id', pollId)
      .single();

    const currentCount = (currentPoll as any)?.[columnToUpdate] || 0;

    await supabaseAdmin
      .from('match_polls')
      .update({ [columnToUpdate]: currentCount + 1 })
      .eq('id', pollId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}