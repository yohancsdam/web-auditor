import type { AuditFinding, SeoMetadata, UxSignals } from './types';

export function analyzeUx(
  metadata: SeoMetadata,
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
    'Más del 60% del tráfico web es móvil. Una mala experiencia móvil significa perder la mayoría de visitantes potenciales y un peor ranking en Google.',
    'Implementar diseño responsive con viewport meta y layouts adaptados a móvil. Verificar en Google Mobile-Friendly Test.',
  );

  check(
    uxSignals.hasHeader,
    'ux-header',
    8,
    8,
    'important',
    'Estructura de header no detectada',
    'No se detectó un elemento <header> semántico en la página.',
    'Un header claro y visible es clave para la navegación. Sin él, la experiencia de usuario se fragmenta y dificulta encontrar información.',
    'Definir un header semántico con logo, navegación principal, datos de contacto y CTA visible.',
  );

  check(
    uxSignals.hasFooter,
    'ux-footer',
    5,
    5,
    'recommended',
    'Footer no detectado',
    'No se detectó un elemento <footer> en la página.',
    'El footer aporta información de contacto, navegación secundaria, datos legales y señales de confianza cruciales para cerrar la visita.',
    'Añadir footer con información de contacto, links importantes, aviso legal y datos de la empresa.',
  );

  check(
    uxSignals.hasCta,
    'ux-cta',
    15,
    15,
    'critical',
    'CTA principal no detectado',
    'No se detectaron llamadas a la acción claras en la página.',
    'Sin CTA, el usuario no sabe qué hacer a continuación y las conversiones caen drásticamente. Es el problema de conversión más directo.',
    'Añadir CTAs claros y visibles en posición destacada: "Solicitar presupuesto", "Contactar" o "Empezar ahora".',
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
    'Añadir teléfono clickable (tel:), email (mailto:) y/o formulario de contacto bien visible en header y footer.',
  );

  // Phone number (bonus points for easy contact)
  if (uxSignals.hasPhoneNumber) {
    maxPoints += 6;
    totalPoints += 6;
  } else {
    findings.push({
      id: 'ux-phone-missing',
      category: 'ux',
      severity: 'important',
      title: 'Número de teléfono no visible',
      description: 'No se detectó un número de teléfono clickable en la página.',
      commercialImpact: 'Muchos clientes prefieren llamar antes de comprar o contratar. Un teléfono visible y clickable puede aumentar las conversiones en un 15-30%.',
      recommendation: 'Añadir el teléfono en formato clickable <a href="tel:+34XXXXXXXXX"> en el header y en la zona de contacto.',
      score: 0,
    });
    maxPoints += 6;
  }

  check(
    uxSignals.hasSocialLinks,
    'ux-social',
    5,
    5,
    'recommended',
    'Sin presencia en redes sociales detectada',
    'No se detectaron enlaces a redes sociales.',
    'La ausencia de redes sociales puede reducir la percepción de marca activa y confiable.',
    'Enlazar perfiles activos en las redes sociales relevantes para el negocio (Instagram, LinkedIn, Facebook…).',
  );

  // Content depth
  if (uxSignals.estimatedWordCount < 200) {
    findings.push({
      id: 'ux-content-thin',
      category: 'ux',
      severity: 'important',
      title: `Contenido muy escaso (~${uxSignals.estimatedWordCount} palabras)`,
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras. Esto es insuficiente para informar y convencer.`,
      commercialImpact: 'Poco contenido significa poca información para el usuario y para los motores de búsqueda. Reduce la confianza y la visibilidad SEO.',
      recommendation: 'Desarrollar contenido que explique el valor de la empresa, sus servicios y diferenciales. Mínimo 400-600 palabras con estructura clara.',
      score: 20,
    });
    maxPoints += 8;
  } else if (uxSignals.estimatedWordCount < 400) {
    findings.push({
      id: 'ux-content-sparse',
      category: 'ux',
      severity: 'recommended',
      title: `Contenido limitado (~${uxSignals.estimatedWordCount} palabras)`,
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras.`,
      commercialImpact: 'Un contenido más rico mejoraría la percepción de la empresa y el posicionamiento SEO.',
      recommendation: 'Enriquecer el contenido con más información sobre servicios, beneficios y propuesta de valor. Objetivo: 600+ palabras.',
      score: 60,
    });
    maxPoints += 8;
    totalPoints += 5;
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }

  // Images
  if (uxSignals.imagesCount === 0) {
    findings.push({
      id: 'ux-no-images',
      category: 'ux',
      severity: 'important',
      title: 'Sin imágenes detectadas',
      description: 'No se encontraron imágenes en la página.',
      commercialImpact: 'Las páginas sin imágenes son menos atractivas, reducen el tiempo de permanencia y transmiten menos profesionalidad.',
      recommendation: 'Añadir imágenes de calidad: foto del equipo, productos/servicios, oficina o gráficos representativos.',
      score: 0,
    });
    maxPoints += 6;
  } else {
    maxPoints += 6;
    totalPoints += 6;

    // Image accessibility
    if (uxSignals.imagesCount > 0) {
      const altRatio = uxSignals.imagesWithAltCount / uxSignals.imagesCount;
      if (altRatio < 0.7) {
        findings.push({
          id: 'ux-images-no-alt',
          category: 'ux',
          severity: 'recommended',
          title: `Imágenes sin descripción (${uxSignals.imagesCount - uxSignals.imagesWithAltCount} de ${uxSignals.imagesCount})`,
          description: `El ${Math.round((1 - altRatio) * 100)}% de las imágenes no tienen texto alternativo.`,
          commercialImpact: 'Las imágenes sin alt text no son accesibles para personas con discapacidad visual y pierden posicionamiento en Google Images.',
          recommendation: 'Añadir atributos alt descriptivos a todas las imágenes.',
          score: Math.round(altRatio * 100),
        });
        maxPoints += 4;
        totalPoints += Math.round(4 * altRatio);
      } else {
        maxPoints += 4;
        totalPoints += 4;
      }
    }
  }

  // Videos (positive signal)
  if (uxSignals.videosCount > 0) {
    maxPoints += 4;
    totalPoints += 4;
  }

  // Accessibility signals
  if (!uxSignals.hasAriaLabels && uxSignals.buttonCount > 2) {
    findings.push({
      id: 'ux-accessibility',
      category: 'ux',
      severity: 'recommended',
      title: 'Señales de accesibilidad no detectadas',
      description: `Se detectaron ${uxSignals.buttonCount} botones/acciones pero no se encontraron atributos ARIA (aria-label, role, etc.).`,
      commercialImpact: 'Una web accesible llega a un 15-20% más de usuarios (personas con discapacidad) y puede tener implicaciones legales en algunos sectores.',
      recommendation: 'Añadir atributos ARIA a botones, formularios y elementos interactivos. Verificar con herramientas como Lighthouse Accessibility.',
      score: 0,
    });
    maxPoints += 5;
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }

  // Trust signals
  if (!uxSignals.hasTrustSignals) {
    findings.push({
      id: 'ux-no-trust',
      category: 'ux',
      severity: 'important',
      title: 'Sin señales de confianza',
      description: 'No se detectaron testimonios, certificaciones, reseñas ni otros elementos de prueba social.',
      commercialImpact: 'El 92% de los consumidores lee reseñas antes de comprar. La ausencia de prueba social genera desconfianza y reduce conversiones.',
      recommendation: 'Añadir testimonios de clientes reales, casos de éxito, logos de clientes o certificaciones relevantes.',
      score: 0,
    });
    maxPoints += 8;
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }

  // Heading hierarchy (h1 + h2 structure)
  if (metadata.h1Count === 1 && metadata.h2Count > 0) {
    maxPoints += 5;
    totalPoints += 5;
  } else if (metadata.h1Count === 1 && metadata.h2Count === 0) {
    findings.push({
      id: 'ux-heading-structure',
      category: 'ux',
      severity: 'recommended',
      title: 'Estructura de titulares incompleta',
      description: 'La página tiene H1 pero no H2. El contenido no tiene una jerarquía visual clara.',
      commercialImpact: 'Una buena estructura de titulares mejora la legibilidad, el tiempo de permanencia y el SEO.',
      recommendation: 'Organizar el contenido con subtítulos H2 y H3 que guíen al lector y destaquen los puntos clave.',
      score: 50,
    });
    maxPoints += 5;
    totalPoints += 2;
  }

  // About/Team/Portfolio signals
  if (uxSignals.hasAboutPage || uxSignals.hasTeamInfo) {
    maxPoints += 4;
    totalPoints += 4;
  } else {
    findings.push({
      id: 'ux-no-about',
      category: 'ux',
      severity: 'recommended',
      title: 'Sin información "Sobre nosotros" o equipo',
      description: 'No se detectó información sobre la empresa, su historia o el equipo.',
      commercialImpact: 'Los usuarios quieren saber con quién trabajan. La transparencia sobre el equipo y la empresa aumenta la confianza y la tasa de contacto.',
      recommendation: 'Añadir una sección "Sobre nosotros" o "Quiénes somos" con información del equipo, historia y valores.',
      score: 0,
    });
    maxPoints += 4;
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'La experiencia de usuario es deficiente. Esto impacta directamente en la captación y retención de clientes.';

  if (score >= 80) {
    summary = 'La experiencia de usuario es razonablemente buena. Hay oportunidades de optimización puntual.';
  } else if (score >= 60) {
    summary = 'La UX presenta oportunidades de mejora notables que afectan a la experiencia y conversión.';
  } else if (score >= 40) {
    summary = 'La experiencia de usuario tiene carencias importantes que dificultan la conversión de visitantes en clientes.';
  }

  return { score, findings, summary };
}
