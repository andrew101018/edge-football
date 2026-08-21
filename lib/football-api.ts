const API_KEY = process.env.FOOTBALL_API_KEY!;
const BASE_URL = 'https://v3.football.api-sports.io';

const headers = {
  'x-rapidapi-host': 'v3.football.api-sports.io',
  'x-rapidapi-key': API_KEY,
};

// جلب مباريات اليوم الحية أو المجدولة
export async function getLiveFixtures() {
  try {
    const res = await fetch(`${BASE_URL}/fixtures?live=all`, {
      headers,
      next: { revalidate: 30 }, // كاش يتجدد كل 30 ثانية
    });
    const data = await res.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching live fixtures:', error);
    return [];
  }
}

// جلب جدول ترتيب دوري محدد لموسم معين
export async function getLeagueStandings(leagueId: number, season: number) {
  try {
    const res = await fetch(`${BASE_URL}/standings?league=${leagueId}&season=${season}`, {
      headers,
      next: { revalidate: 3600 }, // كاش يتجدد كل ساعة
    });
    const data = await res.json();
    return data.response?.[0]?.league?.standings?.[0] || [];
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
}
// جلب قائمة الهدافين لدوري وموسم محدد
export async function getTopScorers(leagueId: number, season: number) {
  try {
    const res = await fetch(`${BASE_URL}/players/topscorers?league=${leagueId}&season=${season}`, {
      headers,
      next: { revalidate: 3600 }, // كاش ساعة
    });
    const data = await res.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching top scorers:', error);
    return [];
  }
}

// جلب تفاصيل وإحصائيات وأحداث مباراة محددة
export async function getFixtureDetails(fixtureId: number) {
  try {
    const res = await fetch(`${BASE_URL}/fixtures?id=${fixtureId}`, {
      headers,
      next: { revalidate: 15 }, // كاش 15 ثانية للتحديث اللحظي
    });
    const data = await res.json();
    return data.response?.[0] || null;
  } catch (error) {
    console.error('Error fetching fixture details:', error);
    return null;
  }
}