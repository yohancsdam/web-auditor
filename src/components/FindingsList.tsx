import type { AuditFinding, AuditRecommendation } from '../lib/audit/types';

interface Props {
  findings: AuditFinding[];
  recommendations?: AuditRecommendation[];
  title?: string;
  emptyLabel?: string;
}

const severityStyles = {
  critical: 'border-red-400/30 bg-red-500/10 text-red-200',
  important: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  recommended: 'border-blue-400/30 bg-blue-500/10 text-blue-200',
  info: 'border-slate-400/20 bg-slate-500/10 text-slate-200',
} as const;

export default function FindingsList({ findings, recommendations = [], title, emptyLabel = 'No se han detectado hallazgos en esta sección.' }: Props) {
  if (findings.length === 0) {
    return (
      <section class="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-emerald-100">
        {title ? <h3 class="text-lg font-semibold">{title}</h3> : null}
        <p class={title ? 'mt-2 text-sm leading-6' : 'text-sm leading-6'}>{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section class="space-y-4">
      {title ? <h3 class="text-2xl font-semibold text-white">{title}</h3> : null}
      {findings.map((finding) => {
        const related = recommendations.find((item) => item.id === `rec-${finding.id}`);
        return (
          <article key={finding.id} class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${severityStyles[finding.severity]}`}>
                  {finding.severity}
                </div>
                <h4 class="mt-4 text-xl font-semibold text-white">{finding.title}</h4>
              </div>
              {typeof finding.score === 'number' ? (
                <div class="rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center">
                  <div class="text-xs uppercase tracking-[0.18em] text-slate-500">score</div>
                  <div class="mt-1 text-2xl font-black text-white">{finding.score}</div>
                </div>
              ) : null}
            </div>

            <div class="mt-5 grid gap-4 lg:grid-cols-3">
              <div class="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Diagnóstico</p>
                <p class="mt-2 text-sm leading-6 text-slate-300">{finding.description}</p>
              </div>
              <div class="rounded-2xl border border-amber-400/15 bg-amber-500/8 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80">Impacto comercial</p>
                <p class="mt-2 text-sm leading-6 text-amber-50/90">{finding.commercialImpact}</p>
              </div>
              <div class="rounded-2xl border border-indigo-400/15 bg-indigo-500/8 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">Recomendación</p>
                <p class="mt-2 text-sm leading-6 text-indigo-50/90">{related?.action || finding.recommendation}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
