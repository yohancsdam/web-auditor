import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import type { AuditCategory, AuditFinding, AuditResult, OverallStatus, PageSpeedData } from '../lib/audit/types';
import AuditResults from './AuditResults';
import AuditorForm from './AuditorForm';
import CategoryScoreCard from './CategoryScoreCard';
import FindingsList from './FindingsList';
import ProposalView from './ProposalView';
import ScoreGauge from './ScoreGauge';

type AuditState = 'idle' | 'loading' | 'results' | 'error';
type DetailTab = 'overview' | AuditCategory | 'proposal';

const loadingMessages = [
  'Conectando con la web objetivo…',
  'Extrayendo metadatos SEO y estructura principal…',
  'Comprobando rendimiento con PageSpeed Insights…',
  'Evaluando señales de UX, conversión y branding…',
  'Redactando diagnóstico y propuesta comercial…',
];

const tabConfig: Array<{ key: DetailTab; label: string }> = [
  { key: 'overview', label: 'Resumen' },
  { key: 'seo', label: 'SEO' },
  { key: 'ux', label: 'UX' },
  { key: 'conversion', label: 'Conversión' },
  { key: 'performance', label: 'Rendimiento' },
  { key: 'branding', label: 'Branding' },
  { key: 'proposal', label: 'Propuesta' },
];

const statusLabels: Record<OverallStatus, string> = {
  critical: 'Crítico',
  improvable: 'Mejorable',
  competitive: 'Competitivo',
  strong: 'Fuerte',
};

const statusClasses: Record<OverallStatus, string> = {
  critical: 'border-red-400/30 bg-red-500/10 text-red-200',
  improvable: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  competitive: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  strong: 'border-green-400/30 bg-green-500/10 text-green-100',
};

const businessSignalLabels = [
  'CTA visible',
  'Contacto visible',
  'Formulario',
  'Redes sociales',
  'Prueba social',
  'Header',
  'Footer',
] as const;

function formatMetric(value?: number, type: 'ms' | 'score' | 'cls' = 'ms') {
  if (typeof value !== 'number') return 'N/D';
  if (type === 'cls') return value.toFixed(2);
  if (type === 'score') return `${value}/100`;
  return `${Math.round(value)} ms`;
}

function getCategoryFindings(result: AuditResult, tab: DetailTab): AuditFinding[] {
  if (tab === 'overview' || tab === 'proposal') return result.findings;
  return result.categoryScores[tab].findings;
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div class="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div class="mt-3 text-2xl font-black text-white">{value}</div>
      <p class="mt-2 text-sm leading-6 text-slate-400">{hint}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div class="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-4xl text-indigo-300">
        ◎
      </div>
      <h3 class="mt-6 text-2xl font-bold text-white">Empieza con una URL</h3>
      <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
        El auditor analizará velocidad, señales SEO, experiencia de usuario, capacidad de conversión y elementos de confianza para detectar si el sitio necesita una optimización puntual o un rediseño de alto impacto.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
        <span class="rounded-full border border-white/10 px-4 py-2">Diagnóstico técnico</span>
        <span class="rounded-full border border-white/10 px-4 py-2">Lectura comercial</span>
        <span class="rounded-full border border-white/10 px-4 py-2">Propuesta lista para presentar</span>
      </div>
    </div>
  );
}

function LoadingState({ step }: { step: number }) {
  return (
    <div class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-xl">
          <div class="inline-flex items-center gap-3 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200">
            <span class="inline-flex h-3 w-3 animate-pulse rounded-full bg-indigo-300" />
            Auditoría en progreso
          </div>
          <h3 class="mt-5 text-3xl font-black tracking-tight text-white">Analizando la web y construyendo un diagnóstico comercial</h3>
          <p class="mt-4 text-base leading-7 text-slate-300">
            Estamos ejecutando la auditoría en el servidor para evitar limitaciones CORS, consultar PageSpeed Insights y extraer señales de negocio directamente del HTML.
          </p>
        </div>
        <div class="flex justify-center">
          <div class="relative flex h-40 w-40 items-center justify-center rounded-full border border-indigo-400/20 bg-slate-950/70">
            <div class="absolute inset-3 animate-spin rounded-full border-4 border-indigo-400/20 border-t-indigo-400" />
            <div class="text-center">
              <div class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Paso</div>
              <div class="mt-2 text-5xl font-black text-white">{step + 1}</div>
              <div class="text-sm text-slate-400">de {loadingMessages.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {loadingMessages.map((message, index) => {
          const completed = index < step;
          const active = index === step;
          return (
            <div
              key={message}
              class={`rounded-2xl border px-4 py-4 text-sm transition ${
                active
                  ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-100'
                  : completed
                    ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
                    : 'border-white/8 bg-slate-950/50 text-slate-500'
              }`}
            >
              <div class="text-xs font-semibold uppercase tracking-[0.18em]">Paso {index + 1}</div>
              <div class="mt-2 leading-6">{message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PerformanceSnapshot({ data, title }: { data?: PageSpeedData; title: string }) {
  return (
    <section class="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <h3 class="mt-3 text-2xl font-semibold text-white">
            {data ? `Score ${data.performanceScore}/100` : 'No disponible'}
          </h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Datos obtenidos desde Google PageSpeed Insights. Útiles para argumentar mejoras de carga, estabilidad y tiempo hasta interacción.
          </p>
        </div>
        <div class={`rounded-full px-4 py-2 text-sm font-semibold ${
          data
            ? data.performanceScore >= 80
              ? 'bg-green-500/10 text-green-200'
              : data.performanceScore >= 50
                ? 'bg-amber-500/10 text-amber-100'
                : 'bg-red-500/10 text-red-200'
            : 'bg-slate-500/10 text-slate-300'
        }`}>
          {data ? 'Datos válidos' : 'Sin respuesta'}
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="FCP" value={formatMetric(data?.fcp)} hint="Primer contenido visible." />
        <MetricCard label="LCP" value={formatMetric(data?.lcp)} hint="Momento en el que el contenido principal termina de cargar." />
        <MetricCard label="CLS" value={formatMetric(data?.cls, 'cls')} hint="Estabilidad visual durante la carga." />
        <MetricCard label="TBT" value={formatMetric(data?.tbd)} hint="Tiempo total bloqueado por tareas pesadas." />
        <MetricCard label="Speed Index" value={formatMetric(data?.si)} hint="Velocidad de aparición del contenido visible." />
        <MetricCard label="TTI" value={formatMetric(data?.tti)} hint="Tiempo hasta poder interactuar con la página." />
      </div>
    </section>
  );
}

export default function AuditorApp() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AuditState>('idle');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state !== 'loading') return;
    const interval = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % loadingMessages.length);
    }, 1400);
    return () => window.clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleAudit = useCallback(async () => {
    if (!url.trim()) {
      setErrorMsg('Introduce una URL para iniciar la auditoría.');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMsg('');
    setResult(null);
    setActiveTab('overview');
    setLoadingStep(0);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar la web');
      }

      setResult(data as AuditResult);
      setState('results');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error inesperado');
      setState('error');
    }
  }, [url]);

  const tabSummary = useMemo(() => {
    if (!result || activeTab === 'overview' || activeTab === 'proposal') return null;
    return result.categoryScores[activeTab];
  }, [activeTab, result]);

  const activeFindings = useMemo(() => {
    if (!result) return [];
    if (activeTab === 'overview') {
      return result.findings.slice(0, 8);
    }
    if (activeTab === 'proposal') {
      return result.findings.slice(0, 5);
    }
    return getCategoryFindings(result, activeTab);
  }, [activeTab, result]);

  const copyShareLink = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [result]);

  return (
    <div class="space-y-8">
      <section class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 lg:p-10">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_30%)]" />
        <div class="relative">
          <div class="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span class="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-indigo-200">Web Auditor V1</span>
            <span class="rounded-full border border-white/10 px-3 py-1">Astro SSR + Preact islands</span>
            <span class="rounded-full border border-white/10 px-3 py-1">Diagnóstico técnico + comercial</span>
          </div>
          <div class="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 class="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Detecta si una web está perdiendo negocio y genera una propuesta lista para vender.
              </h1>
              <p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Introduce una URL y obtén un informe premium con scores por categoría, hallazgos priorizados, quick wins y una narrativa comercial orientada a rediseño u optimización.
              </p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Qué cubre</div>
                <div class="mt-3 text-lg font-semibold text-white">Rendimiento, SEO, UX, conversión y branding</div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Output</div>
                <div class="mt-3 text-lg font-semibold text-white">Diagnóstico + propuesta comercial imprimible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuditorForm url={url} onUrlChange={setUrl} onSubmit={handleAudit} loading={state === 'loading'} />

      {state === 'idle' ? <EmptyState /> : null}
      {state === 'loading' ? <LoadingState step={loadingStep} /> : null}

      {state === 'error' ? (
        <div class="rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6 text-red-100 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div class="text-sm font-semibold uppercase tracking-[0.2em] text-red-200">No se pudo completar la auditoría</div>
          <p class="mt-3 text-base leading-7">{errorMsg}</p>
          <button
            type="button"
            onClick={() => {
              setState('idle');
              setErrorMsg('');
            }}
            class="mt-5 rounded-full border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
          >
            Volver a intentarlo
          </button>
        </div>
      ) : null}

      {state === 'results' && result ? (
        <div class="space-y-8">
          <section class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <div class="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              <div class="max-w-3xl">
                <div class="flex flex-wrap items-center gap-3">
                  <span class={`rounded-full border px-4 py-2 text-sm font-semibold ${statusClasses[result.globalStatus]}`}>
                    Estado {statusLabels[result.globalStatus]}
                  </span>
                  <span class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
                    {new URL(result.url).hostname}
                  </span>
                  <span class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
                    Analizado el {new Date(result.analyzedAt).toLocaleString('es-ES')}
                  </span>
                </div>
                <h2 class="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {result.proposalNarrative.headline}
                </h2>
                <p class="mt-4 max-w-3xl text-base leading-7 text-slate-300">{result.executiveSummary}</p>
                <div class="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('proposal')}
                    class="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Ver propuesta premium
                  </button>
                  <button
                    type="button"
                    onClick={copyShareLink}
                    class="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                  >
                    {copied ? 'URL copiada' : 'Copiar URL auditada'}
                  </button>
                </div>
              </div>
              <div class="flex justify-center">
                <ScoreGauge score={result.globalScore} subtitle={result.redesignOpportunity} />
              </div>
            </div>
          </section>

          <section class="grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
            {Object.values(result.categoryScores).map((category) => (
              <CategoryScoreCard
                key={category.category}
                category={category}
                active={activeTab === category.category}
                onSelect={() => setActiveTab(category.category)}
              />
            ))}
          </section>

          <section class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
            <div class="flex flex-wrap gap-3">
              {tabConfig.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  class={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/40'
                      : 'border border-white/10 bg-slate-950/70 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === 'overview' ? (
            <div class="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <div class="space-y-8">
                <section class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Resumen ejecutivo</p>
                      <h3 class="mt-3 text-2xl font-semibold text-white">Diagnóstico general del activo digital</h3>
                    </div>
                    <div class="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
                      Impacto prioritario: {result.estimatedImpactAreas.join(', ') || 'Optimización continua'}
                    </div>
                  </div>
                  <p class="mt-5 text-base leading-8 text-slate-300">{result.redesignOpportunity}</p>

                  <div class="mt-8 grid gap-4 md:grid-cols-2">
                    <div class="rounded-3xl border border-indigo-400/15 bg-indigo-500/10 p-5">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">Quick wins</p>
                      <ul class="mt-4 space-y-3 text-sm leading-6 text-indigo-50/90">
                        {result.quickWins.map((item) => (
                          <li key={item} class="flex gap-3">
                            <span class="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-300/15 text-indigo-200">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div class="rounded-3xl border border-rose-400/15 bg-rose-500/10 p-5">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">Dolores principales</p>
                      <ul class="mt-4 space-y-3 text-sm leading-6 text-rose-50/90">
                        {(result.primaryPainPoints.length > 0 ? result.primaryPainPoints : ['No se detectaron bloqueos críticos.']).map((item) => (
                          <li key={item} class="flex gap-3">
                            <span class="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-300/15 text-rose-200">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <AuditResults result={result} activeTab={activeTab} onSelectTab={setActiveTab} />
              </div>

              <aside class="space-y-6">
                <section class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                  <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">SEO detectado</p>
                  <div class="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                    <div class="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                      <span class="block text-xs uppercase tracking-[0.18em] text-slate-500">Title</span>
                      <span class="mt-2 block font-medium text-white">{result.seoMetadata.title || 'No detectado'}</span>
                    </div>
                    <div class="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                      <span class="block text-xs uppercase tracking-[0.18em] text-slate-500">Meta description</span>
                      <span class="mt-2 block">{result.seoMetadata.metaDescription || 'No detectada'}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <MetricCard label="H1" value={String(result.seoMetadata.h1Count)} hint={result.seoMetadata.h1 || 'Sin H1 principal detectado.'} />
                      <MetricCard label="Lang" value={result.seoMetadata.langAttribute || 'N/D'} hint="Idioma declarado del documento HTML." />
                    </div>
                  </div>
                </section>

                <section class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                  <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Señales UX / negocio</p>
                  <div class="mt-5 grid gap-3 text-sm text-slate-300">
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[0]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasCta ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasCta ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[1]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasContactInfo ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasContactInfo ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[2]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasForm ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasForm ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[3]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasSocialLinks ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasSocialLinks ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[4]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasTrustSignals ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasTrustSignals ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[5]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasHeader ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasHeader ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3">
                      <span>{businessSignalLabels[6]}</span>
                      <span class={`rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasFooter ? 'bg-emerald-500/10 text-emerald-100' : 'bg-red-500/10 text-red-200'}`}>
                        {result.uxSignals.hasFooter ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          ) : null}

          {tabSummary ? (
            <div class="space-y-8">
              <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                  <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Detalle de categoría</p>
                      <h3 class="mt-3 text-3xl font-black tracking-tight text-white">{tabSummary.label}</h3>
                      <p class="mt-4 text-base leading-7 text-slate-300">{tabSummary.summary}</p>
                    </div>
                    <div class={`rounded-full border px-4 py-2 text-sm font-semibold ${statusClasses[tabSummary.status]}`}>
                      {statusLabels[tabSummary.status]}
                    </div>
                  </div>
                  <div class="mt-8">
                    <ScoreGauge score={tabSummary.score} label={tabSummary.label} subtitle="Score calculado a partir de heurísticas y señales reales detectadas." />
                  </div>
                </div>
                <div class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
                  <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Recomendaciones prioritarias</p>
                  <div class="mt-5 space-y-4">
                    {result.recommendations.filter((item) => item.category === tabSummary.category).slice(0, 4).map((item) => (
                      <div key={item.id} class="rounded-2xl border border-white/8 bg-slate-950/50 p-4">
                        <div class="flex items-center justify-between gap-3">
                          <div class="text-lg font-semibold text-white">{item.title}</div>
                          <span class={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${item.priority === 'critical' ? 'bg-red-500/10 text-red-200' : item.priority === 'important' ? 'bg-amber-500/10 text-amber-100' : 'bg-blue-500/10 text-blue-100'}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-slate-300">{item.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {activeTab === 'performance' ? (
                <div class="grid gap-6 xl:grid-cols-2">
                  <PerformanceSnapshot title="PageSpeed móvil" data={result.pageSpeedMobile} />
                  <PerformanceSnapshot title="PageSpeed escritorio" data={result.pageSpeedDesktop} />
                </div>
              ) : null}

              <FindingsList
                title={`Hallazgos detectados en ${tabSummary.label}`}
                findings={activeFindings}
                recommendations={result.recommendations}
                emptyLabel={`No se detectaron incidencias relevantes en ${tabSummary.label.toLowerCase()}.`}
              />
            </div>
          ) : null}

          {activeTab === 'proposal' ? <ProposalView result={result} /> : null}
        </div>
      ) : null}
    </div>
  );
}
