const API_KEY = process.env.FOOTBALL_API_KEY || '';
const BASE_URL = 'https://v3.football.api-sports.io';

const headers = {
  'x-rapidapi-host': 'v3.football.api-sports.io',
  'x-rapidapi-key': API_KEY,
};

export async function getLiveFixtures() {
  try {
    const res = await fetch(`${BASE_URL}/fixtures?live=all`, { headers, next: { revalidate: 15 } });
    const data = await res.json();
    return data.response || [];
  } catch {
    return [];
  }
}

export async function getFixtureDetails(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/fixtures?id=${id}`, { headers, next: { revalidate: 30 } });
    const data = await res.json();
    return data.response?.[0] || null;
  } catch {
    return null;
  }
}

export async function getFixtureEvents(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/fixtures/events?fixture=${id}`, { headers, next: { revalidate: 15 } });
    const data = await res.json();
    return data.response || [];
  } catch {
    return [];
  }
}

export async function getFixtureLineups(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/fixtures/lineups?fixture=${id}`, { headers, next: { revalidate: 60 } });
    const data = await res.json();
    return data.response || [];
  } catch {
    return [];
  }
}

export async function getLeagueStandings(leagueId: number, season = 2024) {
  try {
    const res = await fetch(`${BASE_URL}/standings?league=${leagueId}&season=${season}`, { headers, next: { revalidate: 3600 } });
    const data = await res.json();
    return data.response?.[0]?.league?.standings?.[0] || [];
  } catch {
    return [];
  }
}

export async function getTopScorers(leagueId: number, season = 2024) {
  try {
    const res = await fetch(`${BASE_URL}/players/topscorers?league=${leagueId}&season=${season}`, { headers, next: { revalidate: 3600 } });
    const data = await res.json();
    return data.response || [];
  } catch {
    return [];
  }
}

// تصدير الاسم البديل لتفادي تعارض الاستيراد
export const getStandings = getLeagueStandings;