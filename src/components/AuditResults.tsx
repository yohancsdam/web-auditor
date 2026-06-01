import type { AuditResult } from '../lib/audit/types';
import CategoryScoreCard from './CategoryScoreCard';
import FindingsList from './FindingsList';
import ScoreGauge from './ScoreGauge';

interface Props {
  result: AuditResult;
  activeTab: 'overview' | 'seo' | 'ux' | 'conversion' | 'performance' | 'branding' | 'proposal';
  onSelectTab: (tab: 'overview' | 'seo' | 'ux' | 'conversion' | 'performance' | 'branding' | 'proposal') => void;
}

export default function AuditResults({ result, activeTab, onSelectTab }: Props) {
  return (
    <div class="space-y-8">
      <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <ScoreGauge score={result.globalScore} subtitle={result.executiveSummary} />
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.values(result.categoryScores).map((category) => (
            <CategoryScoreCard
              key={category.category}
              category={category}
              active={activeTab === category.category}
              onSelect={() => onSelectTab(category.category as 'seo' | 'ux' | 'conversion' | 'performance' | 'branding')}
            />
          ))}
        </div>
      </div>
      <FindingsList findings={activeTab === 'overview' ? result.findings.slice(0, 5) : result.categoryScores[activeTab as keyof typeof result.categoryScores]?.findings || []} recommendations={result.recommendations} />
    </div>
  );
}
