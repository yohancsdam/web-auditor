import type { AuditFinding, SeoMetadata } from './types';

export function analyzeSeo(metadata: SeoMetadata): { score: number; findings: AuditFinding[]; summary: string } {
  const findings: AuditFinding[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  const addFinding = (
    id: string,
    points: number,
    max: number,
    severity: AuditFinding['severity'],
    title: string,
    description: string,
    commercialImpact: string,
    recommendation: string,
  ) => {
    maxPoints += max;
    totalPoints += points;
    if (points < max) {
      findings.push({
        id,
        category: 'seo',
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: Math.round((points / max) * 100),
      });
    }
  };

  // --- HTTPS ---
  if (!metadata.isHttps) {
    addFinding(
      'seo-no-https',
      0,
      15,
      'critical',
      'Sitio web sin HTTPS',
      'La web no usa HTTPS. Los navegadores muestran un aviso de "No seguro" a los visitantes.',
      'Google penaliza las webs sin HTTPS en sus rankings. Además, los visitantes ven una advertencia de seguridad que destruye la confianza y genera abandonos inmediatos.',
      'Instalar un certificado SSL (gratuito con Let\'s Encrypt) y redirigir todo el tráfico HTTP a HTTPS.',
    );
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }

  // --- Title ---
  if (!metadata.title) {
    addFinding(
      'seo-title-missing',
      0,
      15,
      'critical',
      'Título de página ausente',
      'La página no tiene etiqueta <title>.',
      'Sin título, Google no sabe cómo presentar esta página en resultados de búsqueda. Reduce drásticamente la visibilidad orgánica.',
      'Añadir un <title> descriptivo y único entre 50-60 caracteres con la keyword principal al inicio.',
    );
  } else if ((metadata.titleLength || 0) < 30) {
    addFinding(
      'seo-title-short',
      8,
      15,
      'important',
      'Título demasiado corto',
      `El título tiene solo ${metadata.titleLength} caracteres: "${metadata.title}".`,
      'Un título muy corto no aprovecha el potencial SEO y puede resultar poco informativo en buscadores.',
      'Ampliar el título a entre 50-60 caracteres incluyendo la keyword principal.',
    );
  } else if ((metadata.titleLength || 0) > 70) {
    addFinding(
      'seo-title-long',
      10,
      15,
      'recommended',
      'Título demasiado largo',
      `El título tiene ${metadata.titleLength} caracteres (recomendado: 50-60): "${metadata.title?.slice(0, 60)}…".`,
      'Google recortará el título en los resultados, perdiendo parte del mensaje y del CTR.',
      'Acortar el título a 50-60 caracteres manteniendo la keyword principal al inicio.',
    );
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }

  // --- Meta Description ---
  if (!metadata.metaDescription) {
    addFinding(
      'seo-meta-missing',
      0,
      12,
      'critical',
      'Meta description ausente',
      'No hay meta description en la página.',
      'Sin meta description, Google puede generar automáticamente un fragmento poco atractivo que reduce el CTR en un 5-30%.',
      'Añadir una meta description persuasiva de 150-160 caracteres con una llamada a la acción clara.',
    );
  } else if ((metadata.metaDescriptionLength || 0) < 80) {
    addFinding(
      'seo-meta-short',
      7,
      12,
      'important',
      'Meta description demasiado corta',
      `La meta description tiene solo ${metadata.metaDescriptionLength} caracteres.`,
      'Una descripción corta no aprovecha el espacio disponible para convencer al usuario de hacer clic.',
      'Ampliar la meta description a 150-160 caracteres con propuesta de valor clara y CTA.',
    );
  } else if ((metadata.metaDescriptionLength || 0) > 165) {
    addFinding(
      'seo-meta-long',
      9,
      12,
      'recommended',
      'Meta description demasiado larga',
      `La meta description tiene ${metadata.metaDescriptionLength} caracteres (recomendado: 150-160).`,
      'Google recortará la descripción, cortando posiblemente el mensaje más importante.',
      'Acortar la meta description a un máximo de 160 caracteres.',
    );
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }

  // --- Viewport ---
  if (!metadata.hasViewport) {
    addFinding(
      'seo-viewport-missing',
      0,
      12,
      'critical',
      'Meta viewport ausente',
      'La página no tiene meta viewport configurado.',
      'Sin viewport, la experiencia móvil es deficiente y puede perjudicar el índice mobile-first de Google.',
      'Añadir <meta name="viewport" content="width=device-width, initial-scale=1">.',
    );
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }

  // --- H1 ---
  if (metadata.h1Count === 0) {
    addFinding(
      'seo-h1-missing',
      0,
      10,
      'critical',
      'H1 ausente',
      'La página no tiene ninguna etiqueta H1.',
      'El H1 es la señal más importante para buscadores sobre el tema de la página. Su ausencia confunde el foco SEO y la jerarquía visual.',
      'Añadir un H1 claro y descriptivo con la keyword principal de la página.',
    );
  } else if (metadata.h1Count > 1) {
    addFinding(
      'seo-h1-multiple',
      7,
      10,
      'important',
      `Múltiples H1 detectados (${metadata.h1Count})`,
      `La página tiene ${metadata.h1Count} etiquetas H1, cuando debe tener exactamente 1.`,
      'Múltiples H1 diluyen la señal SEO y confunden la jerarquía visual para usuarios y buscadores.',
      'Usar un único H1 con el mensaje principal de la página.',
    );
  } else {
    maxPoints += 10;
    totalPoints += 10;
  }

  // --- H2 structure (important for SEO and readability) ---
  if (metadata.h2Count === 0 && (metadata.estimatedWordCount || 0) > 300) {
    addFinding(
      'seo-h2-missing',
      0,
      6,
      'recommended',
      'Sin subtítulos H2',
      'No se detectaron subtítulos H2 en el contenido de la página.',
      'La ausencia de subtítulos dificulta la lectura y perjudica el posicionamiento para palabras clave secundarias.',
      'Estructurar el contenido con H2 descriptivos que incluyan keywords relevantes.',
    );
  } else {
    maxPoints += 6;
    totalPoints += 6;
  }

  // --- Open Graph ---
  if (!metadata.hasOpenGraph) {
    addFinding(
      'seo-og-missing',
      0,
      8,
      'important',
      'Open Graph ausente',
      'No hay etiquetas Open Graph para redes sociales.',
      'Sin Open Graph, al compartir la web en LinkedIn, Facebook o WhatsApp el preview es genérico y poco atractivo, reduciendo el CTR social.',
      'Añadir og:title, og:description, og:image y og:url.',
    );
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }

  // --- Twitter Cards ---
  if (!metadata.hasTwitterCard) {
    addFinding(
      'seo-twitter-card-missing',
      0,
      4,
      'recommended',
      'Twitter Cards no configuradas',
      'No se detectaron metaetiquetas de Twitter Cards.',
      'Sin Twitter Cards, los links compartidos en X/Twitter muestran un preview básico de texto, sin imagen ni descripción atractiva.',
      'Añadir twitter:card, twitter:title, twitter:description y twitter:image.',
    );
  } else {
    maxPoints += 4;
    totalPoints += 4;
  }

  // --- Favicon ---
  if (!metadata.hasFavicon) {
    addFinding(
      'seo-favicon-missing',
      0,
      5,
      'recommended',
      'Favicon ausente',
      'No se detectó favicon en la página.',
      'El favicon refuerza la identidad visual y la percepción de profesionalidad. Su ausencia resta credibilidad.',
      'Añadir un favicon representativo de la marca (idealmente en múltiples tamaños).',
    );
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }

  // --- Canonical ---
  if (!metadata.hasCanonical) {
    addFinding(
      'seo-canonical-missing',
      0,
      6,
      'important',
      'URL canónica no definida',
      'No hay etiqueta canonical en la página.',
      'Sin canonical, Google puede indexar versiones duplicadas de la misma página (con/sin www, con/sin trailing slash), diluyendo el posicionamiento.',
      'Añadir <link rel="canonical" href="URL-absoluta-de-la-página"> en el head.',
    );
  } else {
    maxPoints += 6;
    totalPoints += 6;
  }

  // --- Robots meta (check for noindex) ---
  if (metadata.robotsMeta && /noindex/i.test(metadata.robotsMeta)) {
    addFinding(
      'seo-robots-noindex',
      0,
      15,
      'critical',
      'Página marcada como noindex',
      `La meta robots contiene "noindex": "${metadata.robotsMeta}". Google no indexará esta página.`,
      'Esta página está completamente excluida de los resultados de búsqueda. Es invisible para cualquier búsqueda orgánica.',
      'Eliminar "noindex" del meta robots si se quiere que la página aparezca en buscadores.',
    );
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }

  // --- Lang attribute ---
  if (!metadata.langAttribute) {
    addFinding(
      'seo-lang-missing',
      0,
      5,
      'recommended',
      'Atributo lang ausente',
      'El HTML no especifica el idioma de la página.',
      'Sin atributo lang, los motores de búsqueda y lectores de pantalla no identifican correctamente el idioma, afectando la accesibilidad y el SEO internacional.',
      'Añadir lang="es" (o el idioma correspondiente) al elemento <html>.',
    );
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }

  // --- Structured Data ---
  if (!metadata.hasStructuredData) {
    addFinding(
      'seo-structured-data-missing',
      0,
      8,
      'important',
      'Sin datos estructurados (Schema.org)',
      'No se detectaron datos estructurados JSON-LD en la página.',
      'Los datos estructurados permiten a Google mostrar rich snippets (reseñas, FAQs, precios, etc.) que aumentan el CTR hasta un 30%.',
      'Implementar Schema.org relevante: Organization, LocalBusiness, FAQPage, Product o Service según el negocio.',
    );
  } else {
    maxPoints += 8;
    totalPoints += 8;
    if (metadata.structuredDataTypes.length > 0) {
      // bonus for richer structured data
    }
  }

  // --- Sitemap ---
  if (!metadata.hasSitemap) {
    addFinding(
      'seo-sitemap-missing',
      0,
      5,
      'recommended',
      'Sitemap XML no detectado',
      'No se encontró un sitemap.xml accesible en la raíz del dominio.',
      'Sin sitemap, Google puede tardar más en descubrir e indexar todas las páginas del sitio.',
      'Crear y publicar un sitemap.xml en la raíz del dominio y enviarlo en Google Search Console.',
    );
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }

  // --- Robots.txt ---
  if (!metadata.hasRobotsTxt) {
    addFinding(
      'seo-robots-txt-missing',
      0,
      4,
      'recommended',
      'Archivo robots.txt no detectado',
      'No se encontró un archivo robots.txt en la raíz del dominio.',
      'Sin robots.txt, los motores de búsqueda no tienen instrucciones claras sobre qué rastrear. Puede llevar a indexar páginas no deseadas.',
      'Crear un archivo robots.txt en la raíz e incluir la URL del sitemap.',
    );
  } else {
    maxPoints += 4;
    totalPoints += 4;
  }

  // --- Images without alt text ---
  if (metadata.totalImages > 0) {
    const altRatio = (metadata.totalImages - metadata.imagesWithoutAlt) / metadata.totalImages;
    if (altRatio < 0.5) {
      addFinding(
        'seo-images-no-alt',
        Math.round(4 * altRatio),
        8,
        'important',
        `Imágenes sin texto alternativo (${metadata.imagesWithoutAlt} de ${metadata.totalImages})`,
        `El ${Math.round((1 - altRatio) * 100)}% de las imágenes no tienen atributo alt.`,
        'Las imágenes sin alt son invisibles para Google Images y perjudican la accesibilidad. Google no puede entender qué muestran.',
        'Añadir atributos alt descriptivos a todas las imágenes, incluyendo keywords relevantes donde sea natural.',
      );
    } else if (altRatio < 0.9) {
      addFinding(
        'seo-images-no-alt',
        6,
        8,
        'recommended',
        `Algunas imágenes sin texto alternativo (${metadata.imagesWithoutAlt} de ${metadata.totalImages})`,
        `El ${Math.round((1 - altRatio) * 100)}% de las imágenes no tienen atributo alt.`,
        'Las imágenes sin alt reducen la accesibilidad y pierden oportunidades de posicionamiento en Google Images.',
        'Añadir atributos alt descriptivos a todas las imágenes.',
      );
    } else {
      maxPoints += 8;
      totalPoints += 8;
    }
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'El SEO está muy deficiente. La web tiene poca visibilidad orgánica y está perdiendo tráfico gratuito.';

  if (score >= 80) {
    summary = 'El SEO básico está bien configurado. La web tiene buena visibilidad en buscadores.';
  } else if (score >= 60) {
    summary = 'El SEO presenta algunas carencias importantes que limitan la visibilidad orgánica.';
  } else if (score >= 40) {
    summary = 'El SEO tiene problemas significativos que reducen la visibilidad. Se están perdiendo visitas y clientes potenciales.';
  }

  return { score, findings, summary };
}
