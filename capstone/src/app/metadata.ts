import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: 'Medium Clone - Share Your Stories',
  description: 'A modern publishing platform inspired by Medium',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Medium Clone',
    description: 'A modern publishing platform inspired by Medium',
    url: '/',
    siteName: 'Medium Clone',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medium Clone - Share Your Stories',
    description: 'A modern publishing platform inspired by Medium',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generatePostMetadata(title: string, description: string, imageUrl?: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    title: `${title} | Medium Clone`,
    description: description,
    openGraph: {
      title: `${title} | Medium Clone`,
      description: description,
      url: `${baseUrl}/posts/${encodeURIComponent(title)}`,
      type: 'article',
      images: imageUrl ? [{
        url: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
        width: 1200,
        height: 630,
        alt: title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Medium Clone`,
      description: description,
      images: imageUrl ? [{
        url: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
        width: 1200,
        height: 630,
        alt: title,
      }] : [],
    },
  };
}