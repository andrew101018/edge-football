import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '../lib/supabase';

async function verifySystemHealth() {
  console.log('🚀 Checking EDGE Football System Health...\n');

  // 1. فحص اتصال Supabase
  try {
    const { count, error } = await supabaseAdmin.from('articles').select('*', { count: 'exact', head: true });
    if (error) throw error;
    console.log(`✅ Supabase Database Connected (Total Articles: ${count || 0})`);
  } catch (err: any) {
    console.error('❌ Supabase Connection Failed:', err.message);
  }

  // 2. فحص محرك Gemini
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'قل كلمة واحدة فقط: جاهز',
    });
    console.log(`✅ Gemini Flash AI Engine Online: "${response.text?.trim()}"`);
  } catch (err: any) {
    console.error('❌ Gemini AI Engine Failed:', err.message);
  }

  // 3. فحص مفتاح Football API
  try {
    const res = await fetch('https://v3.football.api-sports.io/status', {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY || '',
      },
    });
    const data = await res.json();
    console.log(`✅ API-Football Status: ${data.response?.account?.firstname ? 'Active' : 'Connected'}`);
  } catch (err: any) {
    console.error('❌ Football API Failed:', err.message);
  }

  console.log('\n✨ System Check Complete.');
}

verifySystemHealth();