import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { articleId, authorName, favoriteTeam, commentText } = await req.json();

    if (!articleId || !authorName || !commentText) {
      return NextResponse.json({ error: 'الحقول المطلوبة غير مكتملة' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        article_id: articleId,
        author_name: authorName,
        favorite_team: favoriteTeam || 'مشجع كروي',
        comment_text: commentText,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, comment: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}