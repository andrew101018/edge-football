import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'تغطية إخبارية حصرية | EDGE Football';
  const category = searchParams.get('category') || 'عاجل';
  const league = searchParams.get('league') || 'الدوريات الكبرى';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#020617',
          padding: '60px',
          fontFamily: 'sans-serif',
          direction: 'rtl',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: '900', color: '#10b981' }}>EDGE</span>
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff' }}>FOOTBALL</span>
          </div>
          <div
            style={{
              backgroundColor: '#064e3b',
              color: '#34d399',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {category} • {league}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: '900',
            color: '#f8fafc',
            lineHeight: 1.3,
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '2px solid #1e293b',
            paddingTop: '24px',
            color: '#94a3b8',
            fontSize: '18px',
          }}
        >
          <span>تغطية حية وموثقة على مدار الساعة</span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>edgefootball.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}