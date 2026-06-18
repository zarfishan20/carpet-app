import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carpet Flow CRM Engine',
    short_name: 'CarpetFlow',
    description: 'Site Measurement & Dispatch Workflow Engine Matrix',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#020617', // Matches bg-slate-950
    theme_color: '#0ea5e9',      // Matches sky-500 accent
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}