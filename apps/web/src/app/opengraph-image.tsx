import { ImageResponse } from 'next/og';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const contentType = 'image/png';
export const alt = 'Polotrip - Fotos e Memórias de Viagens';

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'brand/logo.svg'));
  const logoSrc = logoData.toString();

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
        <img src={logoSrc} width="100" />
      </div>
    ),
  );
}
