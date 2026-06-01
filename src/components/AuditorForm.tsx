interface Props {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function AuditorForm({ url, onUrlChange, onSubmit, loading = false }: Props) {
  return (
    <div class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">Análisis instantáneo</p>
        <h2 class="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Introduce una URL y genera un diagnóstico comercial completo</h2>
        <p class="mt-4 text-base leading-7 text-slate-300">
          Analizamos velocidad, SEO, UX, conversión y branding para detectar si la web necesita optimización o un rediseño completo.
        </p>
      </div>

      <div class="mt-8 flex flex-col gap-4 lg:flex-row">
        <label class="flex-1">
          <span class="sr-only">URL a analizar</span>
          <input
            type="url"
            value={url}
            onInput={(event) => onUrlChange((event.currentTarget as HTMLInputElement).value)}
            placeholder="Ejemplo: negocio.com o https://negocio.com"
            class="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-400"
          />
        </label>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          class="inline-flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analizando…' : 'Analizar sitio web'}
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
        <span class="rounded-full border border-white/10 px-3 py-1">Sin CORS: auditoría server-side</span>
        <span class="rounded-full border border-white/10 px-3 py-1">PageSpeed móvil + escritorio</span>
        <span class="rounded-full border border-white/10 px-3 py-1">Resultados listos para presentar</span>
      </div>
    </div>
  );
}
