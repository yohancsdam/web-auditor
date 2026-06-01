import { c as createComponent } from './astro-component_C-bSbV63.mjs';
import 'piccolore';
import { o as renderHead, h as renderTemplate } from './server_DPONpfiG.mjs';
import 'clsx';
/* empty css                 */

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Web Auditor · Diagnóstico web y propuesta comercial</title><meta name="description" content="Analiza cualquier web, detecta problemas de SEO, UX, rendimiento y conversión, y genera una propuesta comercial premium lista para presentar.">${renderHead()}</head> <body> <main class="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14"> <section class="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-12"> <div class="max-w-4xl"> <div class="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200">
Astro + Preact · Web Auditor V1
</div> <h1 class="mt-8 text-5xl font-black tracking-tight text-white sm:text-6xl">
Diagnostica webs como un consultor y vende mejoras con una propuesta lista para presentar.
</h1> <p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
Web Auditor convierte una URL en un informe premium con scoring técnico y lectura comercial para detectar problemas de captación, confianza, velocidad y posicionamiento.
</p> <div class="mt-8 flex flex-wrap gap-4"> <a href="/auditor" class="rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-200">
Abrir auditor
</a> <a href="#capacidades" class="rounded-full border border-white/10 px-6 py-3 text-base font-semibold text-slate-200 transition hover:bg-white/5">
Explorar capacidades
</a> </div> </div> </section> <section id="capacidades" class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"> ${[
    ["Rendimiento", "Consulta PageSpeed móvil y escritorio para detectar cuellos de botella visibles."],
    ["SEO", "Extrae title, description, H1, Open Graph y señales de indexabilidad básicas."],
    ["UX + Conversión", "Evalúa CTAs, formularios, contacto, contenido y fricción comercial."],
    ["Propuesta", "Genera una narrativa premium orientada a rediseño u optimización."]
  ].map(([title, description]) => renderTemplate`<article class="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/20 backdrop-blur-xl"> <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Módulo</p> <h2 class="mt-4 text-2xl font-semibold text-white">${title}</h2> <p class="mt-4 text-base leading-7 text-slate-300">${description}</p> </article>`)} </section> </main> </body></html>`;
}, "/tmp/workspace/yohancsdam/web-auditor/src/pages/index.astro", void 0);

const $$file = "/tmp/workspace/yohancsdam/web-auditor/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
