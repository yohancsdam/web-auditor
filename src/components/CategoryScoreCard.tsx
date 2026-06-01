import type { CategoryScore } from '../lib/audit/types';

interface Props {
  category: CategoryScore;
  onSelect?: () => void;
  active?: boolean;
}

const statusClasses = {
  strong: 'text-green-300 bg-green-500/10 border-green-400/20',
  competitive: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  improvable: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
  critical: 'text-red-300 bg-red-500/10 border-red-400/20',
} as const;

function getBar(score: number): string {
  if (score >= 80) return 'from-green-400 to-emerald-500';
  if (score >= 60) return 'from-emerald-400 to-cyan-500';
  if (score >= 40) return 'from-amber-400 to-orange-500';
  return 'from-red-400 to-rose-500';
}

export default function CategoryScoreCard({ category, onSelect, active = false }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      class={`group flex h-full flex-col rounded-3xl border p-5 text-left transition duration-200 ${
        active
          ? 'border-indigo-400/70 bg-slate-800/90 shadow-xl shadow-indigo-950/50'
          : 'border-white/10 bg-slate-900/70 hover:border-white/20 hover:bg-slate-800/90'
      }`}
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Categoría</p>
          <h3 class="mt-2 text-xl font-semibold text-white">{category.label}</h3>
        </div>
        <span class={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses[category.status]}`}>
          {category.status}
        </span>
      </div>

      <div class="mt-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm text-slate-400">Score</p>
          <div class="text-4xl font-black text-white">{category.score}</div>
        </div>
        <p class="max-w-[9rem] text-right text-xs text-slate-500">{category.findings.length} hallazgos priorizados</p>
      </div>

      <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-700/70">
        <div
          class={`h-full rounded-full bg-gradient-to-r ${getBar(category.score)} transition-all duration-500`}
          style={{ width: `${Math.max(category.score, 8)}%` }}
        />
      </div>

      <p class="mt-4 text-sm leading-6 text-slate-300">{category.summary}</p>
      <div class="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-300">
        <span>Ver detalle</span>
        <span class="transition group-hover:translate-x-1">→</span>
      </div>
    </button>
  );
}
