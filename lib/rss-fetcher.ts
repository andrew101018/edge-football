import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// قائمة المصادر الرسمية الحقيقية (Zero Fake Data)
const RSS_FEEDS = [
  { name: 'BBC Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', league: 'International' },
  { name: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', league: 'Premier League' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/football/rss', league: 'European' },
  { name: 'FilGoal', url: 'https://www.filgoal.com/rss/news', league: 'Egyptian League' },
];

export async function fetchLatestRawNews() {
  const allItems: any[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      
      const items = feedData.items.slice(0, 3).map((item) => {
        // استخراج رابط الصورة إن وجد
        const imageUrl = 
          item.enclosure?.url || 
          item.mediaContent?.$?.url || 
          null;

        return {
          title: item.title || '',
          contentSnippet: item.contentSnippet || item.content || item.title,
          sourceUrl: item.link || '',
          sourceName: feed.name,
          league: feed.league,
          imageUrl,
          pubDate: item.pubDate,
        };
      });

      allItems.push(...items);
    } catch (error) {
      console.error(`Failed to fetch feed from ${feed.name}:`, error);
    }
  }

  return allItems;
}