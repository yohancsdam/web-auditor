import type { AuditResult } from '../lib/audit/types';

interface Props {
  result: AuditResult;
}

function statusLabel(status: AuditResult['globalStatus']) {
  switch (status) {
    case 'critical':
      return 'Crítico';
    case 'improvable':
      return 'Mejorable';
    case 'competitive':
      return 'Competitivo';
    case 'strong':
      return 'Fuerte';
  }
}

export default function ProposalView({ result }: Props) {
  const proposal = result.proposalNarrative;

  return (
    <section class="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/30 sm:p-8 lg:p-10 print:shadow-none">
      <div class="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
            Propuesta comercial · Web Auditor
          </div>
          <h2 class="mt-5 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{proposal.headline}</h2>
          <p class="mt-4 max-w-3xl text-base leading-7 text-slate-600">{proposal.openingStatement}</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          class="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 print:hidden"
        >
          Imprimir propuesta
        </button>
      </div>

      <div class="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-5">
          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Diagnóstico</p>
            <p class="mt-3 text-lg font-semibold text-slate-950">{proposal.diagnosisSummary}</p>
            <p class="mt-3 text-sm leading-7 text-slate-600">{result.executiveSummary}</p>
          </div>

          <div class="rounded-3xl border border-slate-200 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Problemas clave</p>
            <div class="mt-5 space-y-4">
              {proposal.keyProblems.length > 0 ? proposal.keyProblems.map((problem) => (
                <div key={`${problem.area}-${problem.problem}`} class="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <div class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">{problem.area}</div>
                  <h3 class="mt-2 text-lg font-semibold text-slate-950">{problem.problem}</h3>
                  <p class="mt-2 text-sm leading-6 text-slate-700">{problem.impact}</p>
                  <p class="mt-3 text-sm font-medium text-indigo-700">Solución sugerida: {problem.solution}</p>
                </div>
              )) : (
                <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-slate-700">
                  No se han detectado problemas críticos. La oportunidad está en optimizar y reforzar la ventaja competitiva.
                </div>
              )}
            </div>
          </div>
        </div>

        <div class="space-y-5">
          <div class="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Resumen ejecutivo</p>
            <div class="mt-4 flex items-end justify-between gap-4">
              <div>
                <div class="text-sm text-slate-400">Estado actual</div>
                <div class="mt-1 text-2xl font-black">{statusLabel(result.globalStatus)}</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-slate-400">Score global</div>
                <div class="mt-1 text-5xl font-black text-indigo-300">{result.globalScore}</div>
              </div>
            </div>
            <p class="mt-4 text-sm leading-7 text-slate-300">{result.redesignOpportunity}</p>
          </div>

          <div class="rounded-3xl border border-slate-200 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Solución propuesta</p>
            <p class="mt-4 text-sm leading-7 text-slate-700">{proposal.proposedSolution}</p>
            <ul class="mt-5 space-y-3 text-sm leading-6 text-slate-700">
              {proposal.expectedBenefits.map((benefit) => (
                <li key={benefit} class="flex gap-3">
                  <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">Siguiente paso recomendado</p>
            <p class="mt-4 text-sm leading-7 text-slate-700">{proposal.callToAction}</p>
            <div class="mt-5 rounded-2xl bg-white p-4 text-sm font-medium text-slate-800 shadow-sm">
              {proposal.urgencyNote}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
