import type { PageSpeedData } from './types';

const PAGESPEED_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export async function fetchPageSpeedData(
  url: string,
  strategy: 'mobile' | 'desktop',
): Promise<PageSpeedData | null> {
  try {
    const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance`;
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.warn(`PageSpeed API returned ${response.status} for ${url}`);
      return null;
    }

    const data = await response.json();
    const categories = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    if (!categories || !audits) {
      return null;
    }

    const performanceScore = Math.round((categories.performance?.score ?? 0) * 100);
    const getMetricValue = (key: string): number | undefined => {
      const audit = audits[key];
      if (typeof audit?.numericValue !== 'number') {
        return undefined;
      }
      return Math.round(audit.numericValue);
    };

    return {
      performanceScore,
      fcp: getMetricValue('first-contentful-paint'),
      lcp: getMetricValue('largest-contentful-paint'),
      cls: typeof audits['cumulative-layout-shift']?.numericValue === 'number'
        ? Number(audits['cumulative-layout-shift'].numericValue.toFixed(2))
        : undefined,
      tbd: getMetricValue('total-blocking-time'),
      si: getMetricValue('speed-index'),
      tti: getMetricValue('interactive'),
      strategy,
    };
  } catch (error) {
    console.warn(`PageSpeed fetch failed for ${url}:`, error);
    return null;
  }
}
