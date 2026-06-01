import type { AuditFinding, AuditResult, ProposalNarrative, ProposalProblem } from './types';

export function generateProposalNarrative(
  result: Partial<AuditResult> & {
    url: string;
    globalStatus: string;
    globalScore: number;
    findings: AuditFinding[];
    seoMetadata: AuditResult['seoMetadata'];
  },
): ProposalNarrative {
  const domain = new URL(result.url).hostname.replace(/^www\./, '');
  const businessName = result.seoMetadata?.title?.split('|')[0]?.split('-')[0]?.trim() || domain;

  const criticalCount = result.findings.filter((finding) => finding.severity === 'critical').length;
  const importantCount = result.findings.filter((finding) => finding.severity === 'important').length;

  const statusHeadlines: Record<string, string> = {
    critical: `${businessName}: ${criticalCount} problema${criticalCount !== 1 ? 's' : ''} crítico${criticalCount !== 1 ? 's' : ''} que está${criticalCount !== 1 ? 'n' : ''} frenando el negocio`,
    improvable: `${businessName} está dejando oportunidades de negocio sobre la mesa`,
    competitive: `${businessName} puede mejorar significativamente su captación digital`,
    strong: `${businessName} tiene una buena base para seguir creciendo`,
  };

  const openingStatements: Record<string, string> = {
    critical: `Tras analizar en profundidad la presencia digital de ${businessName}, hemos identificado ${criticalCount} problema${criticalCount !== 1 ? 's' : ''} crítico${criticalCount !== 1 ? 's' : ''} y ${importantCount} mejora${importantCount !== 1 ? 's' : ''} importantes que están afectando directamente la captación de nuevos clientes. Este informe detalla los hallazgos con precisión y presenta una propuesta concreta de mejora.`,
    improvable: `Hemos auditado la presencia digital de ${businessName} y encontrado ${criticalCount + importantCount} oportunidades de mejora que, una vez implementadas, aumentarían notablemente la efectividad de la web como herramienta de negocio.`,
    competitive: `La web de ${businessName} tiene una base funcional. Hemos identificado ${criticalCount + importantCount} áreas estratégicas donde una inversión en mejora generaría un retorno significativo en contactos y conversiones.`,
    strong: `La web de ${businessName} está bien posicionada. Hemos identificado optimizaciones que permitirían llevarla al siguiente nivel de rendimiento y conversión.`,
  };

  const criticalFindings = (result.findings || []).filter((finding) => finding.severity === 'critical').slice(0, 4);
  const keyProblems: ProposalProblem[] = criticalFindings.map((finding) => ({
    area:
      finding.category === 'performance'
        ? 'Rendimiento'
        : finding.category === 'seo'
          ? 'SEO y Visibilidad'
          : finding.category === 'ux'
            ? 'Experiencia de Usuario'
            : finding.category === 'conversion'
              ? 'Conversión y Captación'
              : 'Branding y Confianza',
    problem: finding.title,
    impact: finding.commercialImpact,
    solution: finding.recommendation,
  }));

  // Build expected benefits based on actual findings
  const expectedBenefits: string[] = [];
  const hasPerfIssues = result.findings.some((finding) => finding.category === 'performance' && (finding.severity === 'critical' || finding.severity === 'important'));
  const hasSeoIssues = result.findings.some((finding) => finding.category === 'seo' && (finding.severity === 'critical' || finding.severity === 'important'));
  const hasConvIssues = result.findings.some((finding) => finding.category === 'conversion' && (finding.severity === 'critical' || finding.severity === 'important'));
  const hasTrustIssues = result.findings.some((finding) => ['brand-trust', 'conv-trust', 'ux-no-trust'].includes(finding.id));
  const hasNoHttps = result.findings.some((finding) => finding.id === 'seo-no-https');
  const hasMobileIssues = result.findings.some((finding) => finding.id === 'ux-mobile' || finding.id === 'perf-mobile-desktop-gap');

  if (result.globalScore < 50) {
    expectedBenefits.push(`Resolución de los ${criticalCount} problemas críticos que frenan actualmente el negocio`);
  }
  if (hasNoHttps) {
    expectedBenefits.push('Activación de HTTPS para eliminar el aviso "No seguro" y recuperar la confianza del visitante');
  }
  if (hasSeoIssues) {
    expectedBenefits.push('Mayor visibilidad en Google y otros buscadores, atrayendo tráfico orgánico cualificado');
  }
  if (hasMobileIssues) {
    expectedBenefits.push('Experiencia óptima en móvil, donde llega más del 60% del tráfico');
  }
  if (hasPerfIssues) {
    expectedBenefits.push('Carga más rápida que reduce el abandono y mejora el posicionamiento en Google');
  }
  if (hasConvIssues) {
    expectedBenefits.push('Incremento de solicitudes de contacto y conversiones con CTAs y formularios efectivos');
  }
  if (hasTrustIssues) {
    expectedBenefits.push('Mayor credibilidad y confianza con testimonios, garantías y señales de profesionalidad');
  }
  expectedBenefits.push('Imagen profesional coherente que genera confianza desde el primer segundo');
  expectedBenefits.push('Base técnica sólida y escalable para seguir creciendo');

  const solutionParts: string[] = [`un rediseño de ${businessName} orientado a resultados de negocio`];
  if (hasSeoIssues) solutionParts.push('estrategia de contenido y SEO');
  if (hasMobileIssues || hasPerfIssues) solutionParts.push('optimización de rendimiento y experiencia móvil');
  solutionParts.push('diseño UX/UI moderno');
  if (hasConvIssues) solutionParts.push('elementos de conversión efectivos');
  if (hasTrustIssues) solutionParts.push('prueba social y señales de confianza');

  const diagnosisSummary = `Hemos analizado ${businessName} en 5 áreas clave: rendimiento, SEO, experiencia de usuario, conversión y branding. El resultado global es ${result.globalScore}/100, con ${criticalCount} problema${criticalCount !== 1 ? 's' : ''} crítico${criticalCount !== 1 ? 's' : ''} y ${importantCount} punto${importantCount !== 1 ? 's' : ''} importante${importantCount !== 1 ? 's' : ''} de mejora identificados.`;

  return {
    businessName,
    headline: statusHeadlines[result.globalStatus] || `Propuesta de mejora web para ${businessName}`,
    openingStatement: openingStatements[result.globalStatus] || openingStatements.improvable,
    diagnosisSummary,
    keyProblems,
    proposedSolution: `Proponemos ${solutionParts.join(', ')}: más visibilidad, más conversiones y una imagen profesional que genere confianza. Cada mejora está directamente vinculada a los problemas detectados en esta auditoría.`,
    expectedBenefits: expectedBenefits.slice(0, 7),
    callToAction: `Conversemos sobre cómo transformar la presencia digital de ${businessName} en una herramienta real de captación de clientes. Sin compromiso, con resultados medibles.`,
    urgencyNote:
      result.globalStatus === 'critical' || result.globalStatus === 'improvable'
        ? `Cada día sin mejoras es un día en el que ${businessName} pierde clientes potenciales ante competidores con mejor presencia digital.`
        : `Optimizar ahora supone ventaja competitiva frente a quienes aún no han dado el paso digital.`,
  };
}
