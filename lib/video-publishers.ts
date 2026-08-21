import { google } from 'googleapis';
import fs from 'fs';

// 1. النشر الآلي على YouTube (Shorts أو فيديو عادي)
export async function uploadToYouTube({
  videoPath,
  title,
  description,
  tags = [],
  isShort = true,
}: {
  videoPath: string;
  title: string;
  description: string;
  tags?: string[];
  isShort?: boolean;
}) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  // إضافة هاشتاج #Shorts للعنوان والوصف إذا كان فيديو عمودي
  const formattedTitle = isShort && !title.includes('#Shorts') ? `${title} #Shorts` : title;
  const formattedDescription = isShort ? `${description}\n\n#Shorts #Football #EDGE_Football` : description;

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: formattedTitle.slice(0, 100),
        description: formattedDescription,
        tags: [...tags, 'كرة قدم', 'EDGE Football'],
        categoryId: '17', // تصنيف الرياضة على يوتيوب
      },
      status: {
        privacyStatus: 'public', // أو 'unlisted' للمراجعة قبل الظهور
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  return res.data;
}

// 2. النشر الآلي على TikTok عبر Content Posting API v2
export async function uploadToTikTok({
  videoUrl,
  caption,
}: {
  videoUrl: string;
  caption: string;
}) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) throw new Error('TikTok Access Token missing');

  // إرسال طلب سحب الفيديو ونشره (Direct Post API)
  const res = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      post_info: {
        title: caption.slice(0, 150),
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
      },
    }),
  });

  const data = await res.json();
  if (data.error && data.error.code !== 'ok') {
    throw new Error(data.error.message || 'Failed to post to TikTok');
  }

  return data.data;
}