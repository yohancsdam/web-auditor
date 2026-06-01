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

export function extractSeoMetadata(html: string, baseUrl: string): SeoMetadata {
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

  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const h3Count = (html.match(/<h3[\s>]/gi) || []).length;

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

  const hasTwitterCard = hasTag(/<meta[^>]*name=["']twitter:card["']/i) || hasTag(/<meta[^>]*name=["']twitter:title["']/i);
  const twitterCard =
    getTag(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:card["']/i);

  const hasFavicon = hasTag(/<link[^>]*rel=["'][^"']*icon[^"']*["']/i);
  const hasCanonical = hasTag(/<link[^>]*rel=["']canonical["']/i);
  const canonicalUrl =
    getTag(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    getTag(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);

  const robotsMeta =
    getTag(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  const hasStructuredData = hasTag(/<script[^>]*type=["']application\/ld\+json["']/i);

  // Extract structured data types
  const structuredDataTypes: string[] = [];
  if (hasStructuredData) {
    const ldJsonBlocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of ldJsonBlocks) {
      try {
        const jsonContent = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
        const parsed = JSON.parse(jsonContent) as Record<string, unknown>;
        const type = (parsed['@type'] as string) || '';
        if (type && !structuredDataTypes.includes(type)) {
          structuredDataTypes.push(type);
        }
      } catch {
        // ignore malformed JSON
      }
    }
  }

  const langAttribute = getTag(/<html[^>]*lang=["']([^"']+)["']/i);
  const metaKeywords =
    getTag(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) ||
    getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i);

  // HTTPS detection
  const isHttps = baseUrl.startsWith('https://');

  // Count images without alt text
  const allImgTags = html.match(/<img[^>]*>/gi) || [];
  const totalImages = allImgTags.length;
  const imagesWithoutAlt = allImgTags.filter((img) => !(/alt=["'][^"']/i.test(img))).length;

  // Internal vs external links
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  try {
    const baseDomain = new URL(baseUrl).hostname;
    const allLinks = html.match(/<a[^>]*href=["']([^"']+)["']/gi) || [];
    for (const link of allLinks) {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) continue;
      const href = hrefMatch[1];
      if (href.startsWith('http://') || href.startsWith('https://')) {
        if (href.includes(baseDomain)) {
          internalLinksCount++;
        } else {
          externalLinksCount++;
        }
      } else if (href.startsWith('/') || href.startsWith('#') || href.startsWith('.')) {
        internalLinksCount++;
      }
    }
  } catch {
    // ignore URL parse errors
  }

  // These are fetched asynchronously in the engine; default false here
  const hasSitemap = false;
  const hasRobotsTxt = false;

  return {
    title,
    titleLength: title?.length,
    metaDescription,
    metaDescriptionLength: metaDescription?.length,
    hasViewport,
    h1: h1 || undefined,
    h1Count,
    h2Count,
    h3Count,
    hasOpenGraph,
    ogTitle,
    ogDescription,
    ogImage,
    hasTwitterCard,
    twitterCard,
    hasFavicon,
    hasCanonical,
    canonicalUrl,
    robotsMeta,
    hasStructuredData,
    structuredDataTypes,
    langAttribute,
    metaKeywords,
    isHttps,
    hasSitemap,
    hasRobotsTxt,
    imagesWithoutAlt,
    totalImages,
    internalLinksCount,
    externalLinksCount,
  };
}

export function extractUxSignals(html: string): UxSignals {
  const lower = html.toLowerCase();
  const hasTag = (pattern: RegExp): boolean => pattern.test(lower);

  const hasMobileOptimization = hasTag(/<meta[^>]*viewport/i);

  // Phone number detection: tel links or common phone patterns
  const hasPhoneNumber =
    hasTag(/<a[^>]*href=["']tel:/i) ||
    /\+?\d[\d\s\-().]{7,}\d/.test(html) ||
    hasTag(/tel\s*:/i);

  // Email detection
  const hasEmailAddress =
    hasTag(/<a[^>]*href=["']mailto:/i) ||
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(html);

  const hasContactInfo =
    hasPhoneNumber ||
    hasEmailAddress ||
    hasTag(/contacto|contact|llámanos|llamanos|whatsapp/i);

  const hasCta = hasTag(/presupuesto|cotizaci[oó]n|quote|demo|prueba\s+gratis|gratis|free\s+trial|empezar|start|cont[áa]ctanos|contact\s+us|llamar|call\s+now|reservar|booking|solicitar|pedir\s+cita|agenda\s+tu/i);
  const hasForm = hasTag(/<form[\s>]/i);
  const hasSocialLinks = hasTag(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com|x\.com/i);
  const hasTrustSignals = hasTag(/garant[íi]a|guarantee|certificad|award|premio|review|rese[ñn]a|testimoni|trusted|confianza|ssl|seguro|caso\s+de\s+[eé]xito|casos\s+de\s+[eé]xito|clientes\s+satisfechos|a[ñn]os\s+de\s+experiencia|iso\s*\d|confian\s+en\s+nosotros/i);
  const hasExternalLinks = hasTag(/<a[^>]*href=["']https?:\/\//i);

  const strippedHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const estimatedWordCount = strippedHtml ? strippedHtml.split(/\s+/).length : 0;

  const allImgTags = html.match(/<img[^>]*>/gi) || [];
  const imagesCount = allImgTags.length;
  const imagesWithAltCount = allImgTags.filter((img) => /alt=["'][^"']/i.test(img)).length;

  const videosCount = (html.match(/<video[\s>]|youtube\.com\/embed|vimeo\.com\/video|<iframe[^>]*youtube|<iframe[^>]*vimeo/gi) || []).length;

  const navMatches = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi) || [];
  const navigationLinksCount = navMatches.reduce((count, nav) => count + (nav.match(/<a[\s>]/gi) || []).length, 0);

  const hasFooter = hasTag(/<footer[\s>]/i);
  const hasHeader = hasTag(/<header[\s>]/i);

  // Accessibility signals
  const hasAriaLabels = hasTag(/aria-label=|aria-labelledby=|aria-describedby=|role=/i);

  // Button count
  const buttonCount = (html.match(/<button[\s>]|<input[^>]*type=["']submit["']/gi) || []).length;

  // Conversion-related signals
  const hasLiveChat = hasTag(/tawk\.to|intercom|crisp\.chat|livechat|zendesk|hubspot|drift\.com|freshchat|tidio/i);
  const hasPricingInfo = hasTag(/precio|price|tarifa|plan\s+\w|desde\s+\d|€|precio\s+por|paquete|mensual|anual|tarifas|presupuesto\s+desde/i);
  const hasGuarantee = hasTag(/garant[íi]a|garantizamos|devoluci[oó]n|reembolso|satisfaction\s+guaranteed|money\s+back|sin\s+compromiso|riesgo\s+cero/i);
  const hasUrgency = hasTag(/oferta\s+limitada|solo\s+hoy|plazas\s+limitadas|quedan\s+pocos|[úu]ltimas\s+unidades|termina\s+el|expira|ahorra\s+ahora|descuento\s+por\s+tiempo/i);
  const hasNewsletterSignup = hasTag(/newsletter|suscri[bv]|subscribe|bolet[íi]n|recibe\s+(noticias|actualizaciones)|mantente\s+informado/i);

  // Brand/credibility signals
  const hasAboutPage = hasTag(/sobre\s+nosotros|quiénes\s+somos|quienes\s+somos|about\s+us|who\s+we\s+are|nuestra\s+historia|nuestra\s+empresa/i);
  const hasTeamInfo = hasTag(/nuestro\s+equipo|our\s+team|conoce\s+al\s+equipo|el\s+equipo|fundador|ceo|director|experto|especialista/i);
  const hasBlogOrNews = hasTag(/blog|noticias|news|art[íi]culos|publicaciones|novedades|recursos/i);
  const hasPortfolio = hasTag(/portfolio|portafolio|proyectos|trabajos|casos\s+de\s+[eé]xito|clientes|galería|gallery/i);

  return {
    hasMobileOptimization,
    hasContactInfo,
    hasPhoneNumber,
    hasEmailAddress,
    hasCta,
    hasForm,
    hasSocialLinks,
    hasTrustSignals,
    hasExternalLinks,
    estimatedWordCount,
    imagesCount,
    imagesWithAltCount,
    videosCount,
    navigationLinksCount,
    hasFooter,
    hasHeader,
    hasAriaLabels,
    buttonCount,
    hasLiveChat,
    hasPricingInfo,
    hasGuarantee,
    hasUrgency,
    hasNewsletterSignup,
    hasAboutPage,
    hasTeamInfo,
    hasBlogOrNews,
    hasPortfolio,
  };
}
