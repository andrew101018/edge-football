import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'EDGE Football Media OS';
    const league = searchParams.get('league') || 'تغطية كروية حصرية';

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
            padding: '60px 80px',
            fontFamily: 'sans-serif',
            direction: 'rtl',
            border: '8px solid #10b981',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#10b981' }}>EDGE</span>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff' }}>FOOTBALL</span>
            </div>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '8px 24px',
                borderRadius: '999px',
                fontSize: '20px',
                fontWeight: 700,
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              {league}
            </span>
          </div>

          {/* Title Body */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.3,
              display: 'flex',
              textAlign: 'right',
            }}
          >
            {title}
          </div>

          {/* Footer Branding */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid #1e293b',
              paddingTop: '24px',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '20px', fontWeight: 600 }}>
              تغطية فورية للمباريات وسوق الانتقالات بلهجة مصرية
            </span>
            <span style={{ color: '#10b981', fontSize: '20px', fontWeight: 800 }}>
              edgefootball.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}