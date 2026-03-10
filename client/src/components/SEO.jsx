import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'France Organes';
const BASE_URL = 'https://franceorganes.fr';
const DEFAULT_IMAGE = `${BASE_URL}/img/og-default.jpg`;

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  article,
  noindex = false,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Pour que la vie continue`;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : null;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="fr_FR" />

      {/* Article-specific OG */}
      {article?.publishedAt && <meta property="article:published_time" content={article.publishedAt} />}
      {article?.modifiedAt && <meta property="article:modified_time" content={article.modifiedAt} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
