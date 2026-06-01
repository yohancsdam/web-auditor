import type { AuditFinding, OverallStatus, PageSpeedData, UxSignals } from './types';

export function calculatePerformanceScore(pageSpeed?: PageSpeedData): { score: number; summary: string; findings: AuditFinding[] } {
  const findings: AuditFinding[] = [];

  if (!pageSpeed) {
    return {
      score: 50,
      summary: 'No se pudo obtener datos de rendimiento de PageSpeed Insights.',
      findings,
    };
  }

  const score = pageSpeed.performanceScore;

  // --- LCP (Largest Contentful Paint) ---
  if (typeof pageSpeed.lcp === 'number') {
    const lcpSeconds = pageSpeed.lcp / 1000;
    if (lcpSeconds > 4) {
      findings.push({
        id: 'perf-lcp-poor',
        category: 'performance',
        severity: 'critical',
        title: `LCP muy lento: ${lcpSeconds.toFixed(1)}s (objetivo: <2.5s)`,
        description: `El Largest Contentful Paint tarda ${lcpSeconds.toFixed(1)} segundos. Google considera cualquier valor >4s como "pobre".`,
        commercialImpact: 'Un LCP lento significa que el usuario ve la página en blanco varios segundos. Cada segundo de retraso reduce las conversiones entre un 7-20%. Google también penaliza esta métrica en rankings.',
        recommendation: 'Optimizar imágenes (WebP, compresión), usar un CDN, implementar preload para recursos críticos y mejorar el tiempo de respuesta del servidor.',
        score: Math.max(0, Math.round(100 - (lcpSeconds - 2.5) * 15)),
      });
    } else if (lcpSeconds > 2.5) {
      findings.push({
        id: 'perf-lcp-moderate',
        category: 'performance',
        severity: 'important',
        title: `LCP mejorable: ${lcpSeconds.toFixed(1)}s (objetivo: <2.5s)`,
        description: `El Largest Contentful Paint tarda ${lcpSeconds.toFixed(1)} segundos. Google recomienda menos de 2.5s.`,
        commercialImpact: 'Un LCP entre 2.5-4s afecta negativamente la experiencia y el posicionamiento en Google.',
        recommendation: 'Optimizar imágenes, usar lazy loading para contenido fuera de pantalla y considerar un CDN.',
        score: Math.round(100 - (lcpSeconds - 2.5) * 10),
      });
    }
  }

  // --- CLS (Cumulative Layout Shift) ---
  if (typeof pageSpeed.cls === 'number') {
    if (pageSpeed.cls > 0.25) {
      findings.push({
        id: 'perf-cls-poor',
        category: 'performance',
        severity: 'critical',
        title: `CLS muy alto: ${pageSpeed.cls.toFixed(3)} (objetivo: <0.1)`,
        description: `El Cumulative Layout Shift es ${pageSpeed.cls.toFixed(3)}. Los elementos de la página saltan visiblemente al cargar.`,
        commercialImpact: 'Los saltos visuales provocan clicks accidentales y frustración. Google penaliza directamente el CLS alto en sus rankings y puede hacer que el usuario cierre la página por frustración.',
        recommendation: 'Definir dimensiones explícitas para imágenes y vídeos, evitar insertar contenido dinámico arriba del pliegue y usar fuentes con font-display: swap.',
        score: Math.max(0, Math.round(100 - pageSpeed.cls * 250)),
      });
    } else if (pageSpeed.cls > 0.1) {
      findings.push({
        id: 'perf-cls-moderate',
        category: 'performance',
        severity: 'important',
        title: `CLS mejorable: ${pageSpeed.cls.toFixed(3)} (objetivo: <0.1)`,
        description: `El Cumulative Layout Shift es ${pageSpeed.cls.toFixed(3)}. Hay cierta inestabilidad visual al cargar.`,
        commercialImpact: 'El CLS es uno de los Core Web Vitals que Google usa para posicionamiento. Un valor >0.1 perjudica el ranking.',
        recommendation: 'Definir dimensiones en imágenes y elementos dinámicos para evitar reflows al cargar.',
        score: Math.round(100 - pageSpeed.cls * 200),
      });
    }
  }

  // --- TBT (Total Blocking Time) ---
  if (typeof pageSpeed.tbd === 'number') {
    const tbt = pageSpeed.tbd;
    if (tbt > 600) {
      findings.push({
        id: 'perf-tbt-poor',
        category: 'performance',
        severity: 'critical',
        title: `Tiempo de bloqueo muy alto: ${tbt}ms (objetivo: <200ms)`,
        description: `El Total Blocking Time es ${tbt}ms. JavaScript bloqueante impide la interacción del usuario durante ${(tbt / 1000).toFixed(1)}s.`,
        commercialImpact: 'Una página bloqueada parece rota al usuario. Aumenta drásticamente la tasa de abandono, especialmente en móvil.',
        recommendation: 'Diferir o fragmentar JavaScript no crítico, eliminar plugins innecesarios y dividir bundles grandes.',
        score: Math.max(0, Math.round(100 - (tbt / 600) * 40)),
      });
    } else if (tbt > 200) {
      findings.push({
        id: 'perf-tbt-moderate',
        category: 'performance',
        severity: 'important',
        title: `Tiempo de bloqueo elevado: ${tbt}ms (objetivo: <200ms)`,
        description: `El Total Blocking Time es ${tbt}ms. Hay JavaScript que bloquea la interactividad de la página.`,
        commercialImpact: 'El TBT alto correlaciona con una mala puntuación de rendimiento en Google, afectando el posicionamiento.',
        recommendation: 'Auditar y diferir JavaScript no crítico. Usar code splitting y cargar scripts de terceros de forma asíncrona.',
        score: Math.round(100 - (tbt / 600) * 30),
      });
    }
  }

  // --- FCP (First Contentful Paint) ---
  if (typeof pageSpeed.fcp === 'number') {
    const fcpSeconds = pageSpeed.fcp / 1000;
    if (fcpSeconds > 3) {
      findings.push({
        id: 'perf-fcp-poor',
        category: 'performance',
        severity: 'important',
        title: `Primera pintura lenta: ${fcpSeconds.toFixed(1)}s (objetivo: <1.8s)`,
        description: `El First Contentful Paint tarda ${fcpSeconds.toFixed(1)} segundos. El usuario ve pantalla en blanco durante ese tiempo.`,
        commercialImpact: 'Un FCP lento aumenta la tasa de abandono. Los usuarios móviles son especialmente intolerantes a esperas largas.',
        recommendation: 'Reducir el tiempo de respuesta del servidor (TTFB), eliminar CSS bloqueante y optimizar el renderizado crítico.',
        score: Math.max(0, Math.round(100 - (fcpSeconds - 1.8) * 20)),
      });
    }
  }

  let summary = 'El rendimiento es muy bajo. Una carga lenta provoca abandono masivo antes de que el usuario vea la propuesta de valor.';

  if (score >= 90) {
    summary = 'El rendimiento es excelente. La velocidad de carga es un punto fuerte de esta web.';
  } else if (score >= 70) {
    summary = 'El rendimiento es aceptable pero tiene margen de mejora en métricas Core Web Vitals.';
  } else if (score >= 50) {
    summary = 'El rendimiento es deficiente. La velocidad de carga está afectando la experiencia y el posicionamiento en Google.';
  }

  return { score, summary, findings };
}

export function calculateBrandingScore(
  uxSignals: Pick<UxSignals, 'hasSocialLinks' | 'hasTrustSignals' | 'hasAboutPage' | 'hasTeamInfo' | 'hasBlogOrNews' | 'hasPortfolio'> & { hasFavicon: boolean },
  metadata: { title?: string; ogImage?: string; hasOpenGraph: boolean; hasStructuredData: boolean },
): { score: number; findings: AuditFinding[]; summary: string } {
  const findings: AuditFinding[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  const check = (
    condition: boolean,
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
    if (condition) {
      totalPoints += points;
    } else {
      findings.push({
        id,
        category: 'branding',
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
      });
    }
  };

  check(
    uxSignals.hasTrustSignals,
    'brand-trust',
    20,
    20,
    'important',
    'Sin señales de confianza visuales',
    'No se detectaron testimonios, premios, certificaciones u otros elementos de confianza.',
    'La ausencia de prueba social reduce la credibilidad percibida y dificulta la decisión de contacto. El 88% de los usuarios confía en las opiniones online tanto como en recomendaciones personales.',
    'Añadir testimonios reales con foto y nombre, logos de clientes, certificaciones o garantías visibles.',
  );

  check(
    uxSignals.hasSocialLinks,
    'brand-social',
    12,
    12,
    'recommended',
    'Sin presencia en redes',
    'No se detectaron links a redes sociales.',
    'Una marca sin redes sociales activas parece desactualizada o poco activa, generando desconfianza.',
    'Mantener y enlazar perfiles sociales activos. La actividad en redes sociales refuerza la credibilidad de marca.',
  );

  check(
    uxSignals.hasFavicon,
    'brand-favicon',
    5,
    5,
    'recommended',
    'Sin favicon de marca',
    'No se detectó favicon en la página.',
    'El favicon es la primera señal visual de marca que ve el usuario en la pestaña del navegador.',
    'Añadir un favicon de alta calidad representativo de la marca.',
  );

  check(
    metadata.hasOpenGraph && Boolean(metadata.ogImage),
    'brand-og-image',
    10,
    10,
    'recommended',
    'Sin imagen Open Graph',
    'No se detectó imagen para preview en redes sociales.',
    'Sin imagen OG, los shares en redes sociales muestran un preview genérico que reduce el CTR y la percepción de marca.',
    'Añadir og:image con una imagen de marca de calidad (mínimo 1200x630px).',
  );

  check(
    uxSignals.hasAboutPage || uxSignals.hasTeamInfo,
    'brand-about',
    13,
    13,
    'important',
    'Sin página o sección "Sobre nosotros"',
    'No se detectó información sobre la empresa, su historia o el equipo.',
    'La transparencia sobre quién está detrás del negocio genera confianza. Los clientes quieren saber con quién trabajan antes de contactar.',
    'Añadir sección "Sobre nosotros" con historia, equipo, valores y diferenciadores del negocio.',
  );

  check(
    uxSignals.hasPortfolio,
    'brand-portfolio',
    10,
    10,
    'recommended',
    'Sin portfolio o casos de éxito',
    'No se detectó un portfolio, galería de proyectos o casos de éxito.',
    'Mostrar trabajos realizados es la forma más efectiva de demostrar competencia. Un portfolio puede aumentar la tasa de contacto significativamente.',
    'Añadir portfolio con proyectos reales, fotos de trabajos, antes/después o casos de éxito con resultados medibles.',
  );

  // Blog as brand signal (optional)
  if (uxSignals.hasBlogOrNews) {
    maxPoints += 10;
    totalPoints += 10;
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'El branding y las señales de confianza son débiles, lo que puede generar desconfianza en los visitantes.';

  if (score >= 80) {
    summary = 'El branding y las señales de confianza son adecuados y refuerzan la credibilidad.';
  } else if (score >= 60) {
    summary = 'El branding tiene áreas de mejora importantes para reforzar la confianza y la percepción de marca.';
  } else if (score >= 40) {
    summary = 'El branding es débil. Mejorar las señales de confianza puede aumentar significativamente la tasa de conversión.';
  }

  return { score, findings, summary };
}

export function calculateGlobalScore(scores: Record<string, number>): { globalScore: number; status: OverallStatus } {
  const weights = {
    performance: 0.25,
    seo: 0.2,
    ux: 0.25,
    conversion: 0.2,
    branding: 0.1,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (typeof scores[key] === 'number') {
      weightedSum += scores[key] * weight;
      totalWeight += weight;
    }
  }

  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  let status: OverallStatus = 'critical';

  if (globalScore >= 80) {
    status = 'strong';
  } else if (globalScore >= 60) {
    status = 'competitive';
  } else if (globalScore >= 40) {
    status = 'improvable';
  }

  return { globalScore, status };
}
