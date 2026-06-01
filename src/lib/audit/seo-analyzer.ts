import type { AuditFinding, SeoMetadata } from './types';

export function analyzeSeo(metadata: SeoMetadata): { score: number; findings: AuditFinding[]; summary: string } {
  const findings: AuditFinding[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  const addFinding = (
    id: string,
    points: number,
    max: number,
    severity: AuditFinding['severity'],
    title: string,
    description: string,
    commercialImpact: string,
    recommendation: string,
  ) => {
    maxPoints += max;
    totalPoints += points;
    if (points < max) {
      findings.push({
        id,
        category: 'seo',
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: Math.round((points / max) * 100),
      });
    }
  };

  if (!metadata.title) {
    addFinding(
      'seo-title-missing',
      0,
      15,
      'critical',
      'Título de página ausente',
      'La página no tiene etiqueta <title>.',
      'Sin título, Google no sabe cómo presentar esta página en resultados de búsqueda. Reduce drásticamente la visibilidad orgánica.',
      'Añadir un <title> descriptivo y único entre 50-60 caracteres.',
    );
  } else if ((metadata.titleLength || 0) < 30) {
    addFinding(
      'seo-title-short',
      8,
      15,
      'important',
      'Título demasiado corto',
      `El título tiene solo ${metadata.titleLength} caracteres.`,
      'Un título muy corto no aprovecha el potencial SEO y puede resultar poco informativo en buscadores.',
      'Ampliar el título a entre 50-60 caracteres incluyendo la keyword principal.',
    );
  } else if ((metadata.titleLength || 0) > 70) {
    addFinding(
      'seo-title-long',
      10,
      15,
      'recommended',
      'Título demasiado largo',
      `El título tiene ${metadata.titleLength} caracteres (recomendado: 50-60).`,
      'Google recortará el título en los resultados, perdiendo parte del mensaje.',
      'Acortar el título a 50-60 caracteres manteniendo la keyword principal al inicio.',
    );
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }

  if (!metadata.metaDescription) {
    addFinding(
      'seo-meta-missing',
      0,
      12,
      'critical',
      'Meta description ausente',
      'No hay meta description en la página.',
      'Sin meta description, Google puede generar automáticamente un fragmento poco atractivo que reduce el CTR.',
      'Añadir una meta description persuasiva de 150-160 caracteres con llamada a la acción.',
    );
  } else if ((metadata.metaDescriptionLength || 0) < 80) {
    addFinding(
      'seo-meta-short',
      7,
      12,
      'important',
      'Meta description demasiado corta',
      `La meta description tiene solo ${metadata.metaDescriptionLength} caracteres.`,
      'Una descripción corta no aprovecha el espacio disponible para convencer al usuario de hacer clic.',
      'Ampliar la meta description a 150-160 caracteres con propuesta de valor clara.',
    );
  } else if ((metadata.metaDescriptionLength || 0) > 165) {
    addFinding(
      'seo-meta-long',
      9,
      12,
      'recommended',
      'Meta description demasiado larga',
      `La meta description tiene ${metadata.metaDescriptionLength} caracteres (recomendado: 150-160).`,
      'Google recortará la descripción, cortando posiblemente el mensaje más importante.',
      'Acortar la meta description a un máximo de 160 caracteres.',
    );
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }

  if (!metadata.hasViewport) {
    addFinding(
      'seo-viewport-missing',
      0,
      12,
      'critical',
      'Meta viewport ausente',
      'La página no tiene meta viewport configurado.',
      'Sin viewport, la experiencia móvil es deficiente y puede perjudicar el índice mobile-first.',
      'Añadir <meta name="viewport" content="width=device-width, initial-scale=1">.',
    );
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }

  if (metadata.h1Count === 0) {
    addFinding(
      'seo-h1-missing',
      0,
      10,
      'critical',
      'H1 ausente',
      'La página no tiene ninguna etiqueta H1.',
      'El H1 es una señal jerárquica importante para buscadores y usuarios. Su ausencia confunde el foco de la página.',
      'Añadir un H1 claro y descriptivo con la keyword principal de la página.',
    );
  } else if (metadata.h1Count > 1) {
    addFinding(
      'seo-h1-multiple',
      7,
      10,
      'important',
      'Múltiples H1 detectados',
      `La página tiene ${metadata.h1Count} etiquetas H1.`,
      'Múltiples H1 diluyen la señal SEO y confunden la jerarquía visual.',
      'Usar un único H1 con el mensaje principal de la página.',
    );
  } else {
    maxPoints += 10;
    totalPoints += 10;
  }

  if (!metadata.hasOpenGraph) {
    addFinding(
      'seo-og-missing',
      0,
      8,
      'important',
      'Open Graph ausente',
      'No hay etiquetas Open Graph para redes sociales.',
      'Sin Open Graph, al compartir la web en redes el preview es genérico y poco atractivo.',
      'Añadir og:title, og:description, og:image y og:url.',
    );
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }

  if (!metadata.hasFavicon) {
    addFinding(
      'seo-favicon-missing',
      0,
      5,
      'recommended',
      'Favicon ausente',
      'No se detectó favicon en la página.',
      'El favicon refuerza la identidad visual y la percepción de profesionalidad.',
      'Añadir un favicon representativo de la marca.',
    );
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }

  if (!metadata.langAttribute) {
    addFinding(
      'seo-lang-missing',
      0,
      5,
      'recommended',
      'Atributo lang ausente',
      'El HTML no especifica el idioma de la página.',
      'Sin atributo lang, los motores de búsqueda y lectores de pantalla no identifican correctamente el idioma.',
      'Añadir lang="es" (o el idioma correspondiente) al elemento <html>.',
    );
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }

  if (metadata.hasStructuredData) {
    maxPoints += 5;
    totalPoints += 5;
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'El SEO está muy deficiente, la web tiene poca visibilidad orgánica.';

  if (score >= 80) {
    summary = 'El SEO básico está bien configurado.';
  } else if (score >= 60) {
    summary = 'El SEO presenta algunas carencias importantes que limitan la visibilidad.';
  } else if (score >= 40) {
    summary = 'El SEO tiene problemas significativos que reducen la visibilidad en buscadores.';
  }

  return { score, findings, summary };
}
