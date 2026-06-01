# Web Auditor V1

Aplicación completa en Astro + Preact + TailwindCSS para auditar sitios web y convertir hallazgos técnicos en una propuesta comercial clara.

## Características

- Auditoría server-side desde una API route de Astro.
- Integración con PageSpeed Insights para rendimiento móvil y escritorio.
- Extracción de metadatos SEO y señales UX directamente del HTML.
- Scoring por categorías: rendimiento, SEO, UX, conversión y branding.
- Narrativa comercial y propuesta premium lista para compartir.
- UI moderna con Astro islands y Preact.

## Stack

- Astro (SSR)
- TypeScript
- Preact
- TailwindCSS v4 vía `@tailwindcss/vite`
- Adaptador Node para rutas API

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Estructura principal

```text
src/
├── components/
├── lib/
│   ├── audit/
│   └── utils/
├── pages/
│   └── api/
└── styles/
```

## Flujo de auditoría

1. El usuario introduce una URL en `/auditor`.
2. La isla Preact hace `POST` a `/api/audit`.
3. El servidor valida la URL y descarga el HTML objetivo.
4. Se extraen señales SEO/UX y se consulta PageSpeed Insights.
5. Se calculan scores, hallazgos, quick wins y propuesta narrativa.
6. La interfaz presenta resultados, recomendaciones y propuesta imprimible.

## Archivos clave

- `src/lib/audit/engine.ts`: orquestación del análisis.
- `src/lib/audit/pagespeed.ts`: integración con PSI.
- `src/lib/utils/html-parser.ts`: extracción regex del HTML.
- `src/components/AuditorApp.tsx`: experiencia interactiva completa.
- `src/pages/api/audit.ts`: endpoint SSR.

## Notas

- La auditoría corre del lado servidor para evitar CORS.
- Si PageSpeed falla, la aplicación sigue devolviendo resultados parciales.
- El parser HTML está orientado a heurísticas rápidas y sin dependencias pesadas.

## Roadmap

Consulta `ROADMAP_EXPERTO.md` para una visión extensa de evolución del producto, checklist experta y oportunidades futuras.
