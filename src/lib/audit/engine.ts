import type { AuditCategory, AuditFinding, AuditRequest, AuditResult, CategoryScore, OverallStatus } from './types';
import { analyzeConversion } from './conversion-analyzer';
import { generateExecutiveSummary, generateQuickWins, generateRecommendations, generateRedesignOpportunity } from './insights';
import { fetchPageSpeedData } from './pagespeed';
import { generateProposalNarrative } from './proposal';
import { calculateBrandingScore, calculateGlobalScore, calculatePerformanceScore } from './scoring';
import { analyzeSeo } from './seo-analyzer';
import { analyzeUx } from './ux-analyzer';
import { extractSeoMetadata, extractUxSignals } from '../utils/html-parser';

function statusFromScore(score: number): OverallStatus {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'competitive';
  if (score >= 40) return 'improvable';
  return 'critical';
}

export async function runAudit(request: AuditRequest): Promise<AuditResult> {
  const { url } = request;
  let html = '';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebAuditor/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      html = await response.text();
    }
  } catch (error) {
    console.warn('Failed to fetch target URL:', error);
  }

  const seoMetadata = extractSeoMetadata(html, url);
  const uxSignals = extractUxSignals(html);

  const pagespeedSettled = await Promise.allSettled([
    fetchPageSpeedData(url, 'mobile'),
    fetchPageSpeedData(url, 'desktop'),
  ]);

  const pageSpeedMobile = pagespeedSettled[0].status === 'fulfilled' ? pagespeedSettled[0].value : null;
  const pageSpeedDesktop = pagespeedSettled[1].status === 'fulfilled' ? pagespeedSettled[1].value : null;

  const seoAnalysis = analyzeSeo(seoMetadata);
  const uxAnalysis = analyzeUx(seoMetadata, uxSignals, html);
  const conversionAnalysis = analyzeConversion(seoMetadata, uxSignals, html);
  const performanceAnalysis = calculatePerformanceScore(pageSpeedMobile || undefined);
  const brandingAnalysis = calculateBrandingScore(
    {
      hasSocialLinks: uxSignals.hasSocialLinks,
      hasTrustSignals: uxSignals.hasTrustSignals,
      hasFavicon: seoMetadata.hasFavicon,
    },
    {
      title: seoMetadata.title,
      ogImage: seoMetadata.ogImage,
      hasOpenGraph: seoMetadata.hasOpenGraph,
    },
  );

  const allFindings: AuditFinding[] = [
    ...seoAnalysis.findings,
    ...uxAnalysis.findings,
    ...conversionAnalysis.findings,
    ...brandingAnalysis.findings,
  ];

  if (pageSpeedMobile && pageSpeedMobile.performanceScore < 70) {
    allFindings.push({
      id: 'perf-low-score',
      category: 'performance' as AuditCategory,
      severity: pageSpeedMobile.performanceScore < 50 ? 'critical' : 'important',
      title: 'Rendimiento bajo en móvil',
      description: `El score de rendimiento móvil es ${pageSpeedMobile.performanceScore}/100.`,
      commercialImpact: 'Una carga lenta provoca que los usuarios abandonen antes de ver el contenido. Impacta directamente en conversiones.',
      recommendation: 'Optimizar imágenes, implementar lazy loading, reducir JavaScript bloqueante y considerar un CDN.',
      score: pageSpeedMobile.performanceScore,
    });
  }

  const scores = {
    performance: performanceAnalysis.score,
    seo: seoAnalysis.score,
    ux: uxAnalysis.score,
    conversion: conversionAnalysis.score,
    branding: brandingAnalysis.score,
  };

  const { globalScore, status: globalStatus } = calculateGlobalScore(scores);

  const categoryScores: Record<AuditCategory, CategoryScore> = {
    performance: {
      category: 'performance',
      label: 'Rendimiento',
      score: performanceAnalysis.score,
      status: statusFromScore(performanceAnalysis.score),
      summary: performanceAnalysis.summary,
      findings: allFindings.filter((finding) => finding.category === 'performance'),
    },
    seo: {
      category: 'seo',
      label: 'SEO',
      score: seoAnalysis.score,
      status: statusFromScore(seoAnalysis.score),
      summary: seoAnalysis.summary,
      findings: seoAnalysis.findings,
    },
    ux: {
      category: 'ux',
      label: 'UX / Diseño',
      score: uxAnalysis.score,
      status: statusFromScore(uxAnalysis.score),
      summary: uxAnalysis.summary,
      findings: uxAnalysis.findings,
    },
    conversion: {
      category: 'conversion',
      label: 'Conversión',
      score: conversionAnalysis.score,
      status: statusFromScore(conversionAnalysis.score),
      summary: conversionAnalysis.summary,
      findings: conversionAnalysis.findings,
    },
    branding: {
      category: 'branding',
      label: 'Branding',
      score: brandingAnalysis.score,
      status: statusFromScore(brandingAnalysis.score),
      summary: brandingAnalysis.summary,
      findings: brandingAnalysis.findings,
    },
  };

  const executiveSummary = generateExecutiveSummary({
    url,
    globalScore,
    globalStatus,
    categoryScores,
    seoMetadata,
    pageSpeedMobile: pageSpeedMobile || undefined,
    pageSpeedDesktop: pageSpeedDesktop || undefined,
    uxSignals,
    findings: allFindings,
  });
  const redesignOpportunity = generateRedesignOpportunity({ findings: allFindings } as Pick<AuditResult, 'findings'>);
  const quickWins = generateQuickWins(allFindings);
  const primaryPainPoints = allFindings
    .filter((finding) => finding.severity === 'critical')
    .slice(0, 5)
    .map((finding) => finding.commercialImpact);
  const estimatedImpactAreas = Object.values(categoryScores)
    .filter((score) => score.score < 60)
    .map((score) => score.label);
  const recommendations = generateRecommendations(allFindings, pageSpeedMobile?.performanceScore);
  const proposalNarrative = generateProposalNarrative({
    url,
    globalStatus,
    globalScore,
    findings: allFindings,
    seoMetadata,
  });

  return {
    url,
    analyzedAt: new Date().toISOString(),
    siteName: seoMetadata.title?.split('|')[0]?.split('-')[0]?.trim(),
    siteDescription: seoMetadata.metaDescription,
    globalScore,
    globalStatus,
    categoryScores,
    seoMetadata,
    pageSpeedMobile: pageSpeedMobile || undefined,
    pageSpeedDesktop: pageSpeedDesktop || undefined,
    uxSignals,
    findings: allFindings,
    recommendations,
    executiveSummary,
    redesignOpportunity,
    quickWins,
    primaryPainPoints,
    estimatedImpactAreas,
    proposalNarrative,
  };
}
