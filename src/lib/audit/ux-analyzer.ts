import type { AuditFinding, SeoMetadata, UxSignals } from './types';

export function analyzeUx(
  _metadata: SeoMetadata,
  uxSignals: UxSignals,
  _html: string,
): { score: number; findings: AuditFinding[]; summary: string } {
  const findings: AuditFinding[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  const check = (
    condition: boolean,
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
    if (condition) {
      totalPoints += points;
    } else {
      findings.push({
        id,
        category: 'ux',
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: 0,
      });
    }
  };

  check(
    uxSignals.hasMobileOptimization,
    'ux-mobile',
    15,
    15,
    'critical',
    'Experiencia móvil deficiente',
    'La web no parece estar optimizada para dispositivos móviles.',
    'Más del 60% del tráfico web es móvil. Una mala experiencia móvil significa perder buena parte de los visitantes potenciales.',
    'Implementar diseño responsive con viewport meta y layouts adaptados a móvil.',
  );

  check(
    uxSignals.hasHeader,
    'ux-header',
    8,
    8,
    'important',
    'Estructura de header no detectada',
    'No se detectó un elemento <header> semántico en la página.',
    'Un header claro es clave para la navegación. Sin él la experiencia de usuario se fragmenta.',
    'Definir un header con logo, navegación principal y CTA visible.',
  );

  check(
    uxSignals.hasFooter,
    'ux-footer',
    5,
    5,
    'recommended',
    'Footer no detectado',
    'No se detectó un elemento <footer> en la página.',
    'El footer aporta información de contacto, navegación secundaria y señales de confianza importantes.',
    'Añadir footer con información de contacto, links importantes y datos legales.',
  );

  check(
    uxSignals.hasCta,
    'ux-cta',
    15,
    15,
    'critical',
    'CTA principal no detectado',
    'No se detectaron llamadas a la acción claras en la página.',
    'Sin CTA, el usuario no sabe qué hacer a continuación y las conversiones se reducen drásticamente.',
    'Añadir CTAs claros y visibles: "Solicitar presupuesto", "Contactar" o "Empezar ahora".',
  );

  check(
    uxSignals.hasContactInfo,
    'ux-contact',
    12,
    12,
    'critical',
    'Información de contacto no detectada',
    'No se encontraron vías de contacto claras (teléfono, email o formulario).',
    'Si el usuario no puede contactar fácilmente, simplemente se irá. Esto representa pérdida directa de clientes potenciales.',
    'Añadir teléfono, email y/o formulario de contacto bien visible.',
  );

  check(
    uxSignals.hasSocialLinks,
    'ux-social',
    6,
    6,
    'recommended',
    'Sin presencia en redes sociales detectada',
    'No se detectaron enlaces a redes sociales.',
    'La ausencia de redes sociales puede reducir la percepción de marca activa y confiable.',
    'Enlazar perfiles activos en redes sociales relevantes para el negocio.',
  );

  if (uxSignals.estimatedWordCount < 200) {
    findings.push({
      id: 'ux-content-thin',
      category: 'ux',
      severity: 'important',
      title: 'Contenido escaso',
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras. Esto es insuficiente.`,
      commercialImpact: 'Poco contenido significa poca información para el usuario y para los motores de búsqueda. Reduce confianza y visibilidad.',
      recommendation: 'Desarrollar contenido que explique el valor de la empresa, sus servicios y diferenciales. Mínimo 400-600 palabras.',
      score: 30,
    });
    maxPoints += 8;
  } else if (uxSignals.estimatedWordCount < 400) {
    findings.push({
      id: 'ux-content-sparse',
      category: 'ux',
      severity: 'recommended',
      title: 'Contenido limitado',
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras.`,
      commercialImpact: 'Un contenido más rico mejoraría la percepción de la empresa y el posicionamiento SEO.',
      recommendation: 'Enriquecer el contenido con más información sobre servicios, beneficios y propuesta de valor.',
      score: 60,
    });
    maxPoints += 8;
    totalPoints += 5;
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }

  if (uxSignals.imagesCount === 0) {
    findings.push({
      id: 'ux-no-images',
      category: 'ux',
      severity: 'important',
      title: 'Sin imágenes detectadas',
      description: 'No se encontraron imágenes en la página.',
      commercialImpact: 'Las páginas sin imágenes son menos atractivas y reducen el tiempo de permanencia del usuario.',
      recommendation: 'Añadir imágenes de calidad: foto del equipo, productos, oficina o gráficos representativos.',
      score: 0,
    });
    maxPoints += 6;
  } else {
    maxPoints += 6;
    totalPoints += 6;
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'La experiencia de usuario es deficiente. Esto impacta directamente en la captación de clientes.';

  if (score >= 80) {
    summary = 'La experiencia de usuario es razonablemente buena.';
  } else if (score >= 60) {
    summary = 'La UX presenta oportunidades de mejora notables.';
  } else if (score >= 40) {
    summary = 'La experiencia de usuario tiene carencias importantes que afectan la conversión.';
  }

  return { score, findings, summary };
}
