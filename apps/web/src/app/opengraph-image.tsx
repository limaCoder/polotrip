import { ImageResponse } from 'next/og';

export const contentType = 'image/png';
export const alt = 'Polotrip - Fotos e Memórias de Viagens';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          padding: '40px',
        }}
      >
        <img src="https://polotrip.com/brand/logo.svg" style={{ minWidth: '500px' }} />
      </div>
    ),
  );
}
