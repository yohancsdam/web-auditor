import type { AuditFinding, SeoMetadata, UxSignals } from './types';

export function analyzeConversion(
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
        category: 'conversion',
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: 0,
      });
    }
  };

  const hasValueProp = Boolean(metadata.title || metadata.h1);
  check(
    hasValueProp,
    'conv-value-prop',
    15,
    15,
    'critical',
    'Propuesta de valor no clara',
    'No se detecta una propuesta de valor clara en el título o H1.',
    'El usuario necesita entender en segundos qué ofrece el negocio y por qué elegirlo. Sin esto, el abandono es inmediato.',
    'Definir un H1 que comunique claramente el beneficio principal para el cliente, no solo el nombre del negocio.',
  );

  check(
    uxSignals.hasCta,
    'conv-cta-visible',
    18,
    18,
    'critical',
    'Sin llamada a la acción visible',
    'No se detectaron CTAs claros para guiar al usuario.',
    'Sin CTA, el usuario no tiene claro el siguiente paso. Esto elimina oportunidades de conversión directa. Es el fallo más costoso en términos de negocio.',
    'Añadir CTAs claros como "Solicitar presupuesto gratuito", "Llamar ahora" o "Ver más información" en la parte superior de la página.',
  );

  check(
    uxSignals.hasForm,
    'conv-form',
    12,
    12,
    'important',
    'Sin formulario de contacto',
    'No se detectó ningún formulario en la página.',
    'El formulario es la vía más cómoda para que usuarios fuera de horario de oficina puedan contactar. Su ausencia elimina conversiones asincrónicas.',
    'Añadir formulario de contacto simple: nombre, email, mensaje y botón de envío. Mantenerlo corto para reducir fricción.',
  );

  check(
    uxSignals.hasTrustSignals,
    'conv-trust',
    12,
    12,
    'important',
    'Señales de confianza ausentes',
    'No se detectaron testimonios, certificaciones, premios u otras señales de confianza.',
    'El 92% de los consumidores lee opiniones antes de decidir. La ausencia de prueba social aumenta la desconfianza y reduce la tasa de contacto.',
    'Añadir testimonios de clientes reales (con foto y nombre), logotipos de clientes, certificaciones o números de clientes atendidos.',
  );

  check(
    uxSignals.hasContactInfo,
    'conv-contact-visible',
    10,
    10,
    'important',
    'Datos de contacto no visibles',
    'No se detectaron teléfono o email de forma evidente.',
    'Muchos usuarios quieren contactar directamente. Sin datos visibles, se pierden estas conversiones de alta intención.',
    'Mostrar teléfono y/o email de forma prominente en header y footer.',
  );

  // Phone number (high-intent conversion)
  check(
    uxSignals.hasPhoneNumber,
    'conv-phone',
    10,
    10,
    'important',
    'Teléfono de contacto no detectado',
    'No se detectó un número de teléfono en la página.',
    'El teléfono es el canal de mayor intención de compra. Su ausencia hace perder a los usuarios más comprometidos que quieren una respuesta inmediata.',
    'Añadir el teléfono en formato clickable (tel:) en el header y en zona de contacto. En móvil, es la acción de conversión más directa.',
  );

  // Email
  check(
    uxSignals.hasEmailAddress,
    'conv-email',
    6,
    6,
    'recommended',
    'Email de contacto no visible',
    'No se detectó una dirección de email en la página.',
    'Algunos usuarios prefieren el email para consultas detalladas. Su ausencia reduce las opciones de contacto.',
    'Añadir un email de contacto visible, preferiblemente del dominio propio (no Hotmail/Gmail).',
  );

  // Pricing information
  check(
    uxSignals.hasPricingInfo,
    'conv-pricing',
    10,
    10,
    'important',
    'Sin información de precios o presupuesto',
    'No se detecta información sobre precios, tarifas o cómo obtener un presupuesto.',
    'La incertidumbre sobre el precio es uno de los principales frenos para contactar. Los usuarios quieren al menos orientación de precio antes de llamar.',
    'Añadir precios orientativos, rangos de presupuesto o un módulo de "solicitar presupuesto gratis" prominente.',
  );

  // Guarantee
  if (uxSignals.hasGuarantee) {
    maxPoints += 6;
    totalPoints += 6;
  } else {
    findings.push({
      id: 'conv-no-guarantee',
      category: 'conversion',
      severity: 'recommended',
      title: 'Sin garantías o políticas de devolución',
      description: 'No se detectó ninguna mención a garantías, políticas de devolución o "sin compromiso".',
      commercialImpact: 'Las garantías reducen el riesgo percibido y aumentan la probabilidad de contacto. Son especialmente efectivas en servicios de alto valor.',
      recommendation: 'Añadir mensajes de garantía: "Presupuesto sin compromiso", "Satisfacción garantizada" o condiciones claras de trabajo.',
      score: 0,
    });
    maxPoints += 6;
  }

  // Social proof / social links
  check(
    uxSignals.hasSocialLinks,
    'conv-social-proof',
    5,
    5,
    'recommended',
    'Sin redes sociales visibles',
    'No se detectaron enlaces a redes sociales.',
    'Las redes sociales activas son una señal de marca viva y confiable para el usuario.',
    'Enlazar perfiles de redes sociales activos del negocio.',
  );

  // Live chat (bonus)
  if (uxSignals.hasLiveChat) {
    maxPoints += 5;
    totalPoints += 5;
  }

  // Urgency/scarcity signals
  if (!uxSignals.hasUrgency) {
    findings.push({
      id: 'conv-no-urgency',
      category: 'conversion',
      severity: 'recommended',
      title: 'Sin elementos de urgencia o escasez',
      description: 'No se detectaron elementos que generen urgencia en la decisión del usuario.',
      commercialImpact: 'Los elementos de urgencia (ofertas limitadas, plazas, tiempo) pueden aumentar la tasa de conversión entre un 10-30%.',
      recommendation: 'Considerar añadir ofertas por tiempo limitado, plazas disponibles o promociones estacionales cuando sea honesto y relevante.',
      score: 0,
    });
    maxPoints += 4;
  } else {
    maxPoints += 4;
    totalPoints += 4;
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'Esta web está perdiendo la mayoría de sus oportunidades de conversión. Cambios relativamente simples pueden multiplicar los contactos recibidos.';

  if (score >= 80) {
    summary = 'Los elementos de conversión básicos están presentes y bien configurados.';
  } else if (score >= 60) {
    summary = 'Hay oportunidades claras de mejora en los elementos de conversión que aumentarían los contactos recibidos.';
  } else if (score >= 40) {
    summary = 'La página carece de elementos clave para convertir visitantes en clientes. Corregirlos tiene impacto directo en el negocio.';
  }

  return { score, findings, summary };
}
