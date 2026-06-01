import type { AuditFinding, OverallStatus, PageSpeedData, SeoMetadata, UxSignals } from './types';

export function calculatePerformanceScore(pageSpeed?: PageSpeedData): { score: number; summary: string } {
  if (!pageSpeed) {
    return {
      score: 50,
      summary: 'No se pudo obtener datos de rendimiento de PageSpeed Insights.',
    };
  }

  const score = pageSpeed.performanceScore;
  let summary = 'El rendimiento es muy bajo. Una carga lenta provoca abandono antes de que el usuario vea la propuesta de valor.';

  if (score >= 90) {
    summary = 'El rendimiento es excelente. La velocidad de carga es un punto fuerte de esta web.';
  } else if (score >= 70) {
    summary = 'El rendimiento es aceptable pero tiene margen de mejora.';
  } else if (score >= 50) {
    summary = 'El rendimiento es deficiente. La velocidad de carga puede estar afectando la experiencia del usuario.';
  }

  return { score, summary };
}

export function calculateBrandingScore(
  uxSignals: Pick<UxSignals, 'hasSocialLinks' | 'hasTrustSignals'> & { hasFavicon: boolean },
  metadata: Pick<SeoMetadata, 'title' | 'ogImage' | 'hasOpenGraph'>,
): { score: number; findings: AuditFinding[]; summary: string } {
  let score = 40;
  const findings: AuditFinding[] = [];

  if (uxSignals.hasSocialLinks) {
    score += 15;
  } else {
    findings.push({
      id: 'brand-social',
      category: 'branding',
      severity: 'recommended',
      title: 'Sin presencia en redes',
      description: 'No se detectaron links a redes sociales.',
      commercialImpact: 'Una marca sin redes activas parece desactualizada o poco activa.',
      recommendation: 'Mantener y enlazar perfiles sociales activos.',
    });
  }

  if (uxSignals.hasTrustSignals) {
    score += 20;
  } else {
    findings.push({
      id: 'brand-trust',
      category: 'branding',
      severity: 'important',
      title: 'Sin señales de confianza visuales',
      description: 'No se detectaron testimonios, premios, certificaciones u otros elementos de confianza.',
      commercialImpact: 'La ausencia de prueba social reduce la credibilidad percibida y dificulta la decisión de contacto.',
      recommendation: 'Añadir testimonios reales, logos de clientes, certificaciones o garantías.',
    });
  }

  if (uxSignals.hasFavicon) {
    score += 5;
  }

  if (metadata.hasOpenGraph && metadata.ogImage) {
    score += 10;
  } else {
    findings.push({
      id: 'brand-og-image',
      category: 'branding',
      severity: 'recommended',
      title: 'Sin imagen Open Graph',
      description: 'No se detectó imagen para preview en redes sociales.',
      commercialImpact: 'Sin imagen OG, los shares en redes sociales muestran un preview genérico y poco atractivo.',
      recommendation: 'Añadir og:image con una imagen de marca de calidad.',
    });
  }

  score = Math.min(100, score);
  let summary = 'El branding y las señales de confianza son débiles, lo que puede generar desconfianza en los visitantes.';

  if (score >= 80) {
    summary = 'El branding y las señales de confianza son adecuados.';
  } else if (score >= 60) {
    summary = 'El branding presenta áreas de mejora para reforzar la confianza.';
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
