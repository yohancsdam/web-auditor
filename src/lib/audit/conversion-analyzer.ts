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
    'Definir un H1 que comunique claramente el beneficio principal para el cliente.',
  );

  check(
    uxSignals.hasCta,
    'conv-cta-visible',
    18,
    18,
    'critical',
    'Sin llamada a la acción visible',
    'No se detectaron CTAs claros para guiar al usuario.',
    'Sin CTA, el usuario no tiene claro el siguiente paso. Esto elimina oportunidades de conversión directa.',
    'Añadir CTAs claros como "Solicitar presupuesto gratuito", "Llamar ahora" o "Ver más información".',
  );

  check(
    uxSignals.hasForm,
    'conv-form',
    12,
    12,
    'important',
    'Sin formulario de contacto',
    'No se detectó ningún formulario en la página.',
    'El formulario es la vía más cómoda para que usuarios fuera de horario de oficina puedan contactar. Su ausencia reduce la captación.',
    'Añadir formulario de contacto simple: nombre, email, mensaje y botón de envío.',
  );

  check(
    uxSignals.hasTrustSignals,
    'conv-trust',
    12,
    12,
    'important',
    'Señales de confianza ausentes',
    'No se detectaron testimonios, certificaciones, premios u otras señales de confianza.',
    'La ausencia de prueba social reduce la credibilidad percibida del negocio y dificulta la decisión de compra.',
    'Añadir testimonios de clientes, logotipos de clientes, certificaciones o premios.',
  );

  check(
    uxSignals.hasContactInfo,
    'conv-contact-visible',
    10,
    10,
    'important',
    'Datos de contacto no visibles',
    'No se detectaron teléfono o email de forma evidente.',
    'Muchos usuarios quieren contactar directamente. Sin datos visibles, se pierden estas conversiones.',
    'Mostrar teléfono y/o email de forma prominente en header y/o footer.',
  );

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

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  let summary = 'Esta web está perdiendo la mayoría de sus oportunidades de conversión.';

  if (score >= 80) {
    summary = 'Los elementos de conversión básicos están presentes.';
  } else if (score >= 60) {
    summary = 'Hay oportunidades claras de mejora en los elementos de conversión.';
  } else if (score >= 40) {
    summary = 'La página carece de elementos clave para convertir visitantes en clientes.';
  }

  return { score, findings, summary };
}
