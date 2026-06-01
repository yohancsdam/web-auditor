export type AuditCategory = 'performance' | 'seo' | 'ux' | 'conversion' | 'branding';
export type Severity = 'critical' | 'important' | 'recommended' | 'info';
export type OverallStatus = 'critical' | 'improvable' | 'competitive' | 'strong';

export interface AuditFinding {
  id: string;
  category: AuditCategory;
  severity: Severity;
  title: string;
  description: string;
  commercialImpact: string;
  recommendation: string;
  score?: number;
}

export interface CategoryScore {
  category: AuditCategory;
  label: string;
  score: number;
  status: OverallStatus;
  summary: string;
  findings: AuditFinding[];
}

export interface SeoMetadata {
  title?: string;
  titleLength?: number;
  metaDescription?: string;
  metaDescriptionLength?: number;
  hasViewport: boolean;
  h1?: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasOpenGraph: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  hasTwitterCard: boolean;
  twitterCard?: string;
  hasFavicon: boolean;
  hasCanonical: boolean;
  canonicalUrl?: string;
  robotsMeta?: string;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  langAttribute?: string;
  metaKeywords?: string;
  isHttps: boolean;
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  imagesWithoutAlt: number;
  totalImages: number;
  internalLinksCount: number;
  externalLinksCount: number;
}

export interface PageSpeedData {
  performanceScore: number;
  fcp?: number;
  lcp?: number;
  cls?: number;
  tbd?: number;
  si?: number;
  tti?: number;
  strategy: 'mobile' | 'desktop';
}

export interface UxSignals {
  hasMobileOptimization: boolean;
  hasContactInfo: boolean;
  hasPhoneNumber: boolean;
  hasEmailAddress: boolean;
  hasCta: boolean;
  hasForm: boolean;
  hasSocialLinks: boolean;
  hasTrustSignals: boolean;
  hasExternalLinks: boolean;
  estimatedWordCount: number;
  imagesCount: number;
  imagesWithAltCount: number;
  videosCount: number;
  navigationLinksCount: number;
  hasFooter: boolean;
  hasHeader: boolean;
  hasAriaLabels: boolean;
  buttonCount: number;
  hasLiveChat: boolean;
  hasPricingInfo: boolean;
  hasGuarantee: boolean;
  hasUrgency: boolean;
  hasNewsletterSignup: boolean;
  hasAboutPage: boolean;
  hasTeamInfo: boolean;
  hasBlogOrNews: boolean;
  hasPortfolio: boolean;
}

export interface AuditRecommendation {
  id: string;
  category: AuditCategory;
  priority: 'critical' | 'important' | 'recommended';
  title: string;
  problem: string;
  whyItMatters: string;
  commercialImpact: string;
  action: string;
  estimatedImpact: 'high' | 'medium' | 'low';
}

export interface ProposalProblem {
  area: string;
  problem: string;
  impact: string;
  solution: string;
}

export interface ProposalNarrative {
  businessName: string;
  headline: string;
  openingStatement: string;
  diagnosisSummary: string;
  keyProblems: ProposalProblem[];
  proposedSolution: string;
  expectedBenefits: string[];
  callToAction: string;
  urgencyNote: string;
}

export interface AuditResult {
  url: string;
  analyzedAt: string;
  siteName?: string;
  siteDescription?: string;
  globalScore: number;
  globalStatus: OverallStatus;
  categoryScores: Record<AuditCategory, CategoryScore>;
  seoMetadata: SeoMetadata;
  pageSpeedMobile?: PageSpeedData;
  pageSpeedDesktop?: PageSpeedData;
  uxSignals: UxSignals;
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
  executiveSummary: string;
  redesignOpportunity: string;
  quickWins: string[];
  primaryPainPoints: string[];
  estimatedImpactAreas: string[];
  proposalNarrative: ProposalNarrative;
}

export interface AuditRequest {
  url: string;
}

export interface AuditError {
  error: string;
  code: string;
}
