import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadToYouTube, uploadToTikTok } from '@/lib/video-publishers';

export async function POST(req: Request) {
  try {
    const { postId, videoUrl, videoFilePath, title, description } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    let youtubeSuccess = false;
    let tiktokSuccess = false;

    // 1. النشر على YouTube
    if (videoFilePath) {
      try {
        await uploadToYouTube({
          videoPath: videoFilePath,
          title: title || 'أخبار الكورة اليوم | EDGE Football',
          description: description || '',
          isShort: true,
        });
        youtubeSuccess = true;
      } catch (err: any) {
        console.error('YouTube publish error:', err.message);
      }
    }

    // 2. النشر على TikTok
    if (videoUrl) {
      try {
        await uploadToTikTok({
          videoUrl,
          caption: `${title} #كرة_قدم #shorts`,
        });
        tiktokSuccess = true;
      } catch (err: any) {
        console.error('TikTok publish error:', err.message);
      }
    }

    // تحديث قاعدة البيانات
    await supabaseAdmin
      .from('social_posts')
      .update({
        published_to_youtube: youtubeSuccess,
        published_to_tiktok: tiktokSuccess,
      })
      .eq('id', postId);

    return NextResponse.json({
      success: true,
      youtube: youtubeSuccess,
      tiktok: tiktokSuccess,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}