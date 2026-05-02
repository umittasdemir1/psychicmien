import { Metadata } from 'next';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from './constants';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({ title, description, image, noIndex }: SeoProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description ?? SITE_DESCRIPTION;
  const img = image ?? `${SITE_URL}/images/og-default.jpg`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: fullTitle,
      description: desc,
      images: [{ url: img, width: 1200, height: 630, alt: fullTitle }],
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [img],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
