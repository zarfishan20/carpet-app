import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carpet Flow CRM Engine',
    short_name: 'CarpetFlow',
    description: 'Site Measurement & Dispatch Workflow Engine Matrix',
    // 1. Change this from '/dashboard' to '.' 
    // This tells the phone: "Launch exactly whichever sub-page the user added to their home screen!"
    start_url: '.', 
    display: 'standalone',
    background_color: '#020617', 
    theme_color: '#0ea5e9',      
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