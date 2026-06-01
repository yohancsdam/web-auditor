import type { AuditFinding, AuditRecommendation, AuditResult } from './types';

type InsightInput = Omit<
  AuditResult,
  'executiveSummary' | 'redesignOpportunity' | 'quickWins' | 'primaryPainPoints' | 'estimatedImpactAreas' | 'proposalNarrative' | 'recommendations' | 'analyzedAt' | 'siteName' | 'siteDescription'
>;

export function generateExecutiveSummary(result: InsightInput): string {
  const criticalCount = result.findings.filter((finding) => finding.severity === 'critical').length;
  const importantCount = result.findings.filter((finding) => finding.severity === 'important').length;
  const weakAreas = Object.values(result.categoryScores)
    .filter((cat) => cat.score < 50)
    .map((cat) => cat.label)
    .join(', ');

  const perfScore = result.pageSpeedMobile?.performanceScore;
  const perfNote = perfScore !== undefined
    ? ` El rendimiento móvil es de ${perfScore}/100${perfScore < 50 ? ' (crítico)' : perfScore < 70 ? ' (mejorable)' : ''}.`
    : '';

  if (result.globalStatus === 'critical') {
    return `La web presenta ${criticalCount} problema${criticalCount !== 1 ? 's' : ''} crítico${criticalCount !== 1 ? 's' : ''} y ${importantCount} importante${importantCount !== 1 ? 's' : ''} en áreas clave.${perfNote} Las áreas más débiles son: ${weakAreas || 'múltiples categorías'}. El estado actual representa una pérdida significativa de oportunidades de negocio que se puede corregir.`;
  }

  if (result.globalStatus === 'improvable') {
    return `La web funciona pero tiene ${criticalCount} problema${criticalCount !== 1 ? 's' : ''} crítico${criticalCount !== 1 ? 's' : ''} y ${importantCount} mejora${importantCount !== 1 ? 's' : ''} importantes que limitan su efectividad.${perfNote}${weakAreas ? ` Las áreas con mayor oportunidad son: ${weakAreas}.` : ''} Implementar las mejoras recomendadas aumentaría notablemente los contactos y conversiones.`;
  }

  if (result.globalStatus === 'competitive') {
    return `La web tiene una base razonable con ${criticalCount + importantCount} puntos de mejora detectados.${perfNote} Hay oportunidades estratégicas para maximizar el retorno de la presencia digital.`;
  }

  return `La web está bien configurada en la mayoría de áreas.${perfNote} Se han detectado ${criticalCount + importantCount} optimizaciones que podrían mejorar aún más los resultados.`;
}

export function generateRedesignOpportunity(result: Pick<AuditResult, 'findings'>): string {
  const criticalFindings = result.findings.filter((finding) => finding.severity === 'critical').length;
  const importantFindings = result.findings.filter((finding) => finding.severity === 'important').length;
  const totalProblems = criticalFindings + importantFindings;

  const hasPerfProblems = result.findings.some((finding) => finding.category === 'performance' && finding.severity === 'critical');
  const hasSeoProblems = result.findings.some((finding) => finding.category === 'seo' && finding.severity === 'critical');
  const hasConvProblems = result.findings.some((finding) => finding.category === 'conversion' && finding.severity === 'critical');
  const hasUxProblems = result.findings.some((finding) => finding.category === 'ux' && finding.severity === 'critical');

  const problemAreas: string[] = [];
  if (hasPerfProblems) problemAreas.push('rendimiento');
  if (hasSeoProblems) problemAreas.push('SEO');
  if (hasUxProblems) problemAreas.push('experiencia de usuario');
  if (hasConvProblems) problemAreas.push('conversión');

  if (criticalFindings > 5) {
    return `Esta web necesita urgentemente una revisión completa. Se detectaron ${criticalFindings} problemas críticos en ${problemAreas.join(', ')}, que representan una pérdida directa de clientes potenciales cada día. Un rediseño integral eliminaría estas barreras y devolvería competitividad al negocio de forma inmediata.`;
  }

  if (criticalFindings > 2) {
    return `La web tiene ${criticalFindings} problemas críticos en ${problemAreas.join(' y ')} que justifican una intervención prioritaria. Un rediseño enfocado en estos puntos tendría un impacto directo y medible en las conversiones del negocio.`;
  }

  if (totalProblems > 6) {
    return `Aunque no hay fallos críticos graves, la web acumula ${totalProblems} problemas entre importantes y recomendados. Un rediseño estratégico resolvería todos de una vez y elevaría la efectividad comercial de forma sostenida.`;
  }

  if (importantFindings > 3) {
    return `La web tiene una base funcional pero ${importantFindings} carencias importantes limitan su efectividad. Mejorar la UX y los elementos de conversión generaría resultados comerciales notablemente mejores.`;
  }

  return 'La web tiene una base funcional sólida. Hay oportunidades de optimización incremental que mejorarían la experiencia y la conversión sin necesidad de un rediseño completo.';
}

export function generateQuickWins(findings: AuditFinding[]): string[] {
  const quickWins: string[] = [];

  // HTTPS
  if (findings.some((finding) => finding.id === 'seo-no-https')) {
    quickWins.push('Instalar certificado SSL (gratis con Let\'s Encrypt) para pasar a HTTPS y eliminar el aviso "No seguro" que espanta visitantes.');
  }

  // SEO basics
  const seoBasicProblems = findings.filter((finding) =>
    ['seo-title-missing', 'seo-meta-missing', 'seo-viewport-missing', 'seo-h1-missing'].includes(finding.id),
  );
  if (seoBasicProblems.length > 0) {
    quickWins.push(`Completar las ${seoBasicProblems.length} etiqueta${seoBasicProblems.length > 1 ? 's' : ''} SEO básica${seoBasicProblems.length > 1 ? 's' : ''} ausente${seoBasicProblems.length > 1 ? 's' : ''} (${seoBasicProblems.map((finding) => finding.title.split(' ')[0]).join(', ')}) para mejorar visibilidad en buscadores.`);
  }

  // Noindex
  if (findings.some((finding) => finding.id === 'seo-robots-noindex')) {
    quickWins.push('Eliminar "noindex" del meta robots — la página está invisible para Google y otros buscadores.');
  }

  // CTA
  if (findings.some((finding) => finding.id === 'ux-cta' || finding.id === 'conv-cta-visible')) {
    quickWins.push('Añadir CTAs claros y visibles en la zona superior de la página que guíen al usuario hacia el contacto o la solicitud de presupuesto.');
  }

  // Phone
  if (findings.some((finding) => finding.id === 'ux-phone-missing' || finding.id === 'conv-phone')) {
    quickWins.push('Añadir el teléfono en formato clickable (tel:) en el header — es la acción de conversión más directa para usuarios móviles.');
  }

  // Contact info
  if (findings.some((finding) => ['ux-contact', 'conv-contact-visible'].includes(finding.id))) {
    quickWins.push('Mostrar información de contacto (teléfono y email) de forma prominente en header y footer para reducir la fricción de contacto.');
  }

  // Canonical
  if (findings.some((finding) => finding.id === 'seo-canonical-missing')) {
    quickWins.push('Añadir etiqueta canonical para evitar contenido duplicado y consolidar la autoridad SEO en una única URL.');
  }

  // Open Graph
  if (findings.some((finding) => finding.id === 'seo-og-missing')) {
    quickWins.push('Configurar Open Graph (og:title, og:description, og:image) para mejorar el aspecto al compartir en redes sociales.');
  }

  // Trust signals
  if (findings.some((finding) => ['brand-trust', 'conv-trust', 'ux-no-trust'].includes(finding.id))) {
    quickWins.push('Añadir testimonios de clientes reales con foto y nombre — es el elemento que más aumenta la tasa de contacto en servicios locales.');
  }

  // Structured data
  if (findings.some((finding) => finding.id === 'seo-structured-data-missing')) {
    quickWins.push('Implementar Schema.org (LocalBusiness o Organization) para obtener rich snippets en Google y aumentar la visibilidad.');
  }

  if (quickWins.length === 0) {
    quickWins.push('Mantener la base técnica actual, optimizar el contenido con más prueba social y realizar pruebas A/B en los CTAs para seguir mejorando.');
  }

  return quickWins.slice(0, 6);
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
      title: `Rendimiento crítico: ${performanceScore}/100`,
      problem: `El score de rendimiento es ${performanceScore}/100. La web carga demasiado lento en dispositivos móviles.`,
      whyItMatters: 'Una web lenta pierde usuarios antes de que vean el contenido. Google también penaliza la lentitud en el ranking con los Core Web Vitals.',
      commercialImpact: 'Cada segundo de retraso puede reducir las conversiones entre un 7% y un 20%. Con un score tan bajo, el impacto puede ser mayor.',
      action: 'Optimizar imágenes (convertir a WebP, comprimir), implementar lazy loading, minificar CSS/JS, diferir JavaScript no crítico y considerar un CDN.',
      estimatedImpact: 'high',
    });
  }

  const priorityOrder = { critical: 0, important: 1, recommended: 2 };
  return recommendations.sort((left, right) => priorityOrder[left.priority] - priorityOrder[right.priority]);
}
