import type { MetadataRoute } from 'next';
import { pwaIcons } from '@/assets/pwa/icons';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Polotrip',
    short_name: 'Polotrip',
    description: 'Transforme suas memórias de viagem em álbuns digitais interativos',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: pwaIcons,
  };
}
