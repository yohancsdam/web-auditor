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

  const statusHeadlines: Record<string, string> = {
    critical: `${businessName} necesita un rediseño urgente para no perder más clientes`,
    improvable: `${businessName} está dejando oportunidades sobre la mesa`,
    competitive: `${businessName} puede mejorar significativamente su presencia digital`,
    strong: `${businessName} tiene una buena base para seguir creciendo`,
  };

  const openingStatements: Record<string, string> = {
    critical: `Tras analizar la presencia digital de ${businessName}, hemos identificado problemas críticos que están afectando directamente la captación de nuevos clientes. Este informe detalla los hallazgos y presenta una propuesta concreta de mejora.`,
    improvable: `Hemos auditado la web de ${businessName} y encontrado oportunidades claras de mejora que, una vez implementadas, aumentarían notablemente la efectividad digital del negocio.`,
    competitive: `La web de ${businessName} tiene una base funcional. Hemos identificado áreas estratégicas donde una inversión en mejora generaría un retorno significativo.`,
    strong: `La web de ${businessName} está bien posicionada. Presentamos oportunidades para llevarla al siguiente nivel.`,
  };

  const criticalFindings = (result.findings || []).filter((finding) => finding.severity === 'critical').slice(0, 4);
  const keyProblems: ProposalProblem[] = criticalFindings.map((finding) => ({
    area:
      finding.category === 'performance'
        ? 'Rendimiento'
        : finding.category === 'seo'
          ? 'SEO'
          : finding.category === 'ux'
            ? 'Experiencia de usuario'
            : finding.category === 'conversion'
              ? 'Conversión'
              : 'Branding',
    problem: finding.title,
    impact: finding.commercialImpact,
    solution: finding.recommendation,
  }));

  return {
    businessName,
    headline: statusHeadlines[result.globalStatus] || `Propuesta de rediseño web para ${businessName}`,
    openingStatement: openingStatements[result.globalStatus] || openingStatements.improvable,
    diagnosisSummary: `Hemos analizado ${businessName} en 5 áreas clave: rendimiento, SEO, experiencia de usuario, conversión y branding. El resultado global es ${result.globalScore}/100.`,
    keyProblems,
    proposedSolution: `Proponemos un rediseño completo de la web de ${businessName} orientado a resultados de negocio: más visibilidad, más conversiones y una imagen profesional que genere confianza. El proyecto incluiría estrategia de contenido, diseño UX/UI moderno, optimización SEO y una base técnica sólida.`,
    expectedBenefits: [
      ...(result.globalScore < 50 ? ['Corrección de problemas críticos que están frenando el negocio'] : []),
      'Mayor visibilidad en buscadores y redes sociales',
      'Mejor experiencia de usuario en móvil y escritorio',
      'Incremento de solicitudes de contacto y conversiones',
      'Imagen profesional que genera confianza en los visitantes',
      'Base técnica sólida para seguir creciendo',
    ],
    callToAction: `Conversemos sobre cómo podemos transformar la presencia digital de ${businessName}. Sin compromiso.`,
    urgencyNote:
      result.globalStatus === 'critical' || result.globalStatus === 'improvable'
        ? 'Cada día sin mejoras es un día perdiendo clientes potenciales ante competidores con mejor presencia digital.'
        : 'Optimizar ahora supone ventaja competitiva frente a quienes aún no han dado el paso.',
  };
}
