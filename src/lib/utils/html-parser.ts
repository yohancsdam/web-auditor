import type { SeoMetadata, UxSignals } from '../audit/types';

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export function extractSeoMetadata(html: string, _baseUrl: string): SeoMetadata {
  const getTag = (pattern: RegExp): string | undefined => {
    const match = html.match(pattern);
    return match?.[1] ? decodeHtmlEntities(match[1].trim()) : undefined;
  };

  const hasTag = (pattern: RegExp): boolean => pattern.test(html);

  const title = getTag(/<title[^>]*>([^<]+)<\/title>/i);
  const metaDescription =
    getTag(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const hasViewport = hasTag(/<meta[^>]*name=["']viewport["']/i);

  const h1Matches = html.match(/<h1[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  const h1Raw = h1Matches[0] || '';
  const h1 = h1Raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  const hasOpenGraph = hasTag(/<meta[^>]*property=["']og:/i);
  const ogTitle =
    getTag(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogDescription =
    getTag(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  const ogImage =
    getTag(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

  const hasFavicon = hasTag(/<link[^>]*rel=["'][^"']*icon[^"']*["']/i);
  const hasCanonical = hasTag(/<link[^>]*rel=["']canonical["']/i);
  const robotsMeta =
    getTag(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  const hasStructuredData = hasTag(/<script[^>]*type=["']application\/ld\+json["']/i);
  const langAttribute = getTag(/<html[^>]*lang=["']([^"']+)["']/i);

  return {
    title,
    titleLength: title?.length,
    metaDescription,
    metaDescriptionLength: metaDescription?.length,
    hasViewport,
    h1: h1 || undefined,
    h1Count,
    hasOpenGraph,
    ogTitle,
    ogDescription,
    ogImage,
    hasFavicon,
    hasCanonical,
    robotsMeta,
    hasStructuredData,
    langAttribute,
  };
}

export function extractUxSignals(html: string): UxSignals {
  const lower = html.toLowerCase();
  const hasTag = (pattern: RegExp): boolean => pattern.test(lower);

  const hasMobileOptimization = hasTag(/<meta[^>]*viewport/i);
  const hasContactInfo =
    hasTag(/tel:|mailto:|whatsapp|contacto|contact|llámanos|llamanos/i) ||
    hasTag(/\+\d{7,}/) ||
    hasTag(/<a[^>]*href=["']tel:/i) ||
    hasTag(/<a[^>]*href=["']mailto:/i);
  const hasCta = hasTag(/presupuesto|cotización|cotizaci|quote|demo|prueba|gratis|free|empezar|start|contáctanos|contact us|llamar|call now|reservar|booking|solicitar/i);
  const hasForm = hasTag(/<form[\s>]/i);
  const hasSocialLinks = hasTag(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com|x\.com/i);
  const hasTrustSignals = hasTag(/garantía|guarantee|certificad|award|premio|review|reseña|testimoni|trusted|confianza|ssl|seguro|caso de éxito|casos de éxito/i);
  const hasExternalLinks = hasTag(/<a[^>]*href=["']https?:\/\//i);

  const strippedHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const estimatedWordCount = strippedHtml ? strippedHtml.split(/\s+/).length : 0;
  const imagesCount = (html.match(/<img[\s>]/gi) || []).length;
  const videosCount = (html.match(/<video[\s>]|youtube\.com\/embed|vimeo\.com\/video/gi) || []).length;

  const navMatches = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi) || [];
  const navigationLinksCount = navMatches.reduce((count, nav) => count + (nav.match(/<a[\s>]/gi) || []).length, 0);

  const hasFooter = hasTag(/<footer[\s>]/i);
  const hasHeader = hasTag(/<header[\s>]/i);

  return {
    hasMobileOptimization,
    hasContactInfo,
    hasCta,
    hasForm,
    hasSocialLinks,
    hasTrustSignals,
    hasExternalLinks,
    estimatedWordCount,
    imagesCount,
    videosCount,
    navigationLinksCount,
    hasFooter,
    hasHeader,
  };
}
