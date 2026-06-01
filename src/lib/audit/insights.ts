import type { AuditFinding, AuditRecommendation, AuditResult } from './types';

type InsightInput = Omit<
  AuditResult,
  'executiveSummary' | 'redesignOpportunity' | 'quickWins' | 'primaryPainPoints' | 'estimatedImpactAreas' | 'proposalNarrative' | 'recommendations' | 'analyzedAt' | 'siteName' | 'siteDescription'
>;

export function generateExecutiveSummary(result: InsightInput): string {
  const statusMessages = {
    critical:
      'La web presenta problemas graves en múltiples áreas clave. El estado actual representa una pérdida de oportunidades de negocio significativa.',
    improvable:
      'La web funciona pero tiene carencias importantes que limitan su efectividad como herramienta de captación. Hay oportunidades claras de mejora.',
    competitive:
      'La web tiene una base razonable pero existe margen de mejora para maximizar su impacto comercial.',
    strong: 'La web está bien configurada en la mayoría de áreas analizadas.',
  };

  return statusMessages[result.globalStatus];
}

export function generateRedesignOpportunity(result: Pick<AuditResult, 'findings'>): string {
  const criticalFindings = result.findings.filter((finding) => finding.severity === 'critical').length;
  const importantFindings = result.findings.filter((finding) => finding.severity === 'important').length;

  if (criticalFindings > 5) {
    return 'Esta web necesita urgentemente una revisión completa. Los problemas críticos detectados en rendimiento, SEO, UX y conversión representan una pérdida directa de clientes potenciales. Un rediseño integral devolvería competitividad a este negocio.';
  }

  if (criticalFindings > 2) {
    return 'La web tiene problemas críticos que justifican un rediseño. Las oportunidades de mejora en experiencia de usuario y conversión son claras y tienen impacto directo en el negocio.';
  }

  if (importantFindings > 4) {
    return 'Aunque la web funciona, tiene carencias importantes que limitan su efectividad. Un rediseño enfocado en UX y conversión mejoraría notablemente los resultados comerciales.';
  }

  return 'La web tiene una base funcional pero hay oportunidades de optimización que mejorarían la experiencia y la conversión.';
}

export function generateQuickWins(findings: AuditFinding[]): string[] {
  const quickWins: string[] = [];
  const seoQuickWins = findings.filter((finding) =>
    ['seo-title-missing', 'seo-meta-missing', 'seo-viewport-missing', 'seo-h1-missing'].includes(finding.id),
  );

  if (seoQuickWins.length > 0) {
    quickWins.push('Completar las etiquetas SEO básicas (título, meta description, H1 y viewport) para mejorar visibilidad en buscadores.');
  }

  if (findings.some((finding) => finding.id === 'ux-cta')) {
    quickWins.push('Añadir CTA claros y visibles que guíen al usuario hacia el contacto o la solicitud de presupuesto.');
  }

  if (findings.some((finding) => ['ux-contact', 'conv-contact-visible'].includes(finding.id))) {
    quickWins.push('Mostrar información de contacto prominently en header y footer para reducir fricción.');
  }

  if (findings.some((finding) => finding.id === 'seo-og-missing')) {
    quickWins.push('Configurar Open Graph para mejorar el aspecto cuando la web se comparte en redes sociales.');
  }

  if (findings.some((finding) => ['brand-trust', 'conv-trust'].includes(finding.id))) {
    quickWins.push('Añadir testimonios, reseñas o sellos de confianza para mejorar credibilidad inmediata.');
  }

  if (quickWins.length === 0) {
    quickWins.push('Mantener la base técnica y optimizar microcopys, pruebas sociales y tiempos de carga para seguir creciendo.');
  }

  return quickWins.slice(0, 5);
}

export function generateRecommendations(findings: AuditFinding[], performanceScore?: number): AuditRecommendation[] {
  const recommendations: AuditRecommendation[] = findings.map((finding) => ({
    id: `rec-${finding.id}`,
    category: finding.category,
    priority:
      finding.severity === 'critical'
        ? 'critical'
        : finding.severity === 'important'
          ? 'important'
          : 'recommended',
    title: finding.title,
    problem: finding.description,
    whyItMatters: finding.commercialImpact,
    commercialImpact: finding.commercialImpact,
    action: finding.recommendation,
    estimatedImpact:
      finding.severity === 'critical' ? 'high' : finding.severity === 'important' ? 'medium' : 'low',
  }));

  if (typeof performanceScore === 'number' && performanceScore < 50) {
    recommendations.unshift({
      id: 'rec-performance-critical',
      category: 'performance',
      priority: 'critical',
      title: 'Rendimiento crítico',
      problem: `El score de rendimiento es ${performanceScore}/100.`,
      whyItMatters: 'Una web lenta pierde usuarios antes de que vean el contenido. Google también penaliza la lentitud en el ranking.',
      commercialImpact: 'Cada segundo de retraso puede reducir las conversiones entre un 7% y un 20%.',
      action: 'Optimizar imágenes, implementar lazy loading, minificar CSS/JS y considerar un CDN.',
      estimatedImpact: 'high',
    });
  }

  const priorityOrder = { critical: 0, important: 1, recommended: 2 };
  return recommendations.sort((left, right) => priorityOrder[left.priority] - priorityOrder[right.priority]);
}
