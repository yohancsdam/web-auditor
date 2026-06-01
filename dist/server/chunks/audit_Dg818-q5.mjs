function analyzeConversion(metadata, uxSignals, _html) {
  const findings = [];
  let totalPoints = 0;
  let maxPoints = 0;
  const check = (condition, id, points, max, severity, title, description, commercialImpact, recommendation) => {
    maxPoints += max;
    if (condition) {
      totalPoints += points;
    } else {
      findings.push({
        id,
        category: "conversion",
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: 0
      });
    }
  };
  const hasValueProp = Boolean(metadata.title || metadata.h1);
  check(hasValueProp, "conv-value-prop", 15, 15, "critical", "Propuesta de valor no clara", "No se detecta una propuesta de valor clara en el título o H1.", "El usuario necesita entender en segundos qué ofrece el negocio y por qué elegirlo. Sin esto, el abandono es inmediato.", "Definir un H1 que comunique claramente el beneficio principal para el cliente.");
  check(uxSignals.hasCta, "conv-cta-visible", 18, 18, "critical", "Sin llamada a la acción visible", "No se detectaron CTAs claros para guiar al usuario.", "Sin CTA, el usuario no tiene claro el siguiente paso. Esto elimina oportunidades de conversión directa.", 'Añadir CTAs claros como "Solicitar presupuesto gratuito", "Llamar ahora" o "Ver más información".');
  check(uxSignals.hasForm, "conv-form", 12, 12, "important", "Sin formulario de contacto", "No se detectó ningún formulario en la página.", "El formulario es la vía más cómoda para que usuarios fuera de horario de oficina puedan contactar. Su ausencia reduce la captación.", "Añadir formulario de contacto simple: nombre, email, mensaje y botón de envío.");
  check(uxSignals.hasTrustSignals, "conv-trust", 12, 12, "important", "Señales de confianza ausentes", "No se detectaron testimonios, certificaciones, premios u otras señales de confianza.", "La ausencia de prueba social reduce la credibilidad percibida del negocio y dificulta la decisión de compra.", "Añadir testimonios de clientes, logotipos de clientes, certificaciones o premios.");
  check(uxSignals.hasContactInfo, "conv-contact-visible", 10, 10, "important", "Datos de contacto no visibles", "No se detectaron teléfono o email de forma evidente.", "Muchos usuarios quieren contactar directamente. Sin datos visibles, se pierden estas conversiones.", "Mostrar teléfono y/o email de forma prominente en header y/o footer.");
  check(uxSignals.hasSocialLinks, "conv-social-proof", 5, 5, "recommended", "Sin redes sociales visibles", "No se detectaron enlaces a redes sociales.", "Las redes sociales activas son una señal de marca viva y confiable para el usuario.", "Enlazar perfiles de redes sociales activos del negocio.");
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "Esta web está perdiendo la mayoría de sus oportunidades de conversión.";
  if (score >= 80) {
    summary = "Los elementos de conversión básicos están presentes.";
  } else if (score >= 60) {
    summary = "Hay oportunidades claras de mejora en los elementos de conversión.";
  } else if (score >= 40) {
    summary = "La página carece de elementos clave para convertir visitantes en clientes.";
  }
  return {
    score,
    findings,
    summary
  };
}

function generateExecutiveSummary(result) {
  const statusMessages = {
    critical: "La web presenta problemas graves en múltiples áreas clave. El estado actual representa una pérdida de oportunidades de negocio significativa.",
    improvable: "La web funciona pero tiene carencias importantes que limitan su efectividad como herramienta de captación. Hay oportunidades claras de mejora.",
    competitive: "La web tiene una base razonable pero existe margen de mejora para maximizar su impacto comercial.",
    strong: "La web está bien configurada en la mayoría de áreas analizadas."
  };
  return statusMessages[result.globalStatus];
}
function generateRedesignOpportunity(result) {
  const criticalFindings = result.findings.filter((finding) => finding.severity === "critical").length;
  const importantFindings = result.findings.filter((finding) => finding.severity === "important").length;
  if (criticalFindings > 5) {
    return "Esta web necesita urgentemente una revisión completa. Los problemas críticos detectados en rendimiento, SEO, UX y conversión representan una pérdida directa de clientes potenciales. Un rediseño integral devolvería competitividad a este negocio.";
  }
  if (criticalFindings > 2) {
    return "La web tiene problemas críticos que justifican un rediseño. Las oportunidades de mejora en experiencia de usuario y conversión son claras y tienen impacto directo en el negocio.";
  }
  if (importantFindings > 4) {
    return "Aunque la web funciona, tiene carencias importantes que limitan su efectividad. Un rediseño enfocado en UX y conversión mejoraría notablemente los resultados comerciales.";
  }
  return "La web tiene una base funcional pero hay oportunidades de optimización que mejorarían la experiencia y la conversión.";
}
function generateQuickWins(findings) {
  const quickWins = [];
  const seoQuickWins = findings.filter((finding) => ["seo-title-missing", "seo-meta-missing", "seo-viewport-missing", "seo-h1-missing"].includes(finding.id));
  if (seoQuickWins.length > 0) {
    quickWins.push("Completar las etiquetas SEO básicas (título, meta description, H1 y viewport) para mejorar visibilidad en buscadores.");
  }
  if (findings.some((finding) => finding.id === "ux-cta")) {
    quickWins.push("Añadir CTA claros y visibles que guíen al usuario hacia el contacto o la solicitud de presupuesto.");
  }
  if (findings.some((finding) => ["ux-contact", "conv-contact-visible"].includes(finding.id))) {
    quickWins.push("Mostrar información de contacto prominently en header y footer para reducir fricción.");
  }
  if (findings.some((finding) => finding.id === "seo-og-missing")) {
    quickWins.push("Configurar Open Graph para mejorar el aspecto cuando la web se comparte en redes sociales.");
  }
  if (findings.some((finding) => ["brand-trust", "conv-trust"].includes(finding.id))) {
    quickWins.push("Añadir testimonios, reseñas o sellos de confianza para mejorar credibilidad inmediata.");
  }
  if (quickWins.length === 0) {
    quickWins.push("Mantener la base técnica y optimizar microcopys, pruebas sociales y tiempos de carga para seguir creciendo.");
  }
  return quickWins.slice(0, 5);
}
function generateRecommendations(findings, performanceScore) {
  const recommendations = findings.map((finding) => ({
    id: `rec-${finding.id}`,
    category: finding.category,
    priority: finding.severity === "critical" ? "critical" : finding.severity === "important" ? "important" : "recommended",
    title: finding.title,
    problem: finding.description,
    whyItMatters: finding.commercialImpact,
    commercialImpact: finding.commercialImpact,
    action: finding.recommendation,
    estimatedImpact: finding.severity === "critical" ? "high" : finding.severity === "important" ? "medium" : "low"
  }));
  if (typeof performanceScore === "number" && performanceScore < 50) {
    recommendations.unshift({
      id: "rec-performance-critical",
      category: "performance",
      priority: "critical",
      title: "Rendimiento crítico",
      problem: `El score de rendimiento es ${performanceScore}/100.`,
      whyItMatters: "Una web lenta pierde usuarios antes de que vean el contenido. Google también penaliza la lentitud en el ranking.",
      commercialImpact: "Cada segundo de retraso puede reducir las conversiones entre un 7% y un 20%.",
      action: "Optimizar imágenes, implementar lazy loading, minificar CSS/JS y considerar un CDN.",
      estimatedImpact: "high"
    });
  }
  const priorityOrder = {
    critical: 0,
    important: 1,
    recommended: 2
  };
  return recommendations.sort((left, right) => priorityOrder[left.priority] - priorityOrder[right.priority]);
}

const PAGESPEED_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
async function fetchPageSpeedData(url, strategy) {
  try {
    const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance`;
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(3e4)
    });
    if (!response.ok) {
      console.warn(`PageSpeed API returned ${response.status} for ${url}`);
      return null;
    }
    const data = await response.json();
    const categories = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;
    if (!categories || !audits) {
      return null;
    }
    const performanceScore = Math.round((categories.performance?.score ?? 0) * 100);
    const getMetricValue = (key) => {
      const audit = audits[key];
      if (typeof audit?.numericValue !== "number") {
        return void 0;
      }
      return Math.round(audit.numericValue);
    };
    return {
      performanceScore,
      fcp: getMetricValue("first-contentful-paint"),
      lcp: getMetricValue("largest-contentful-paint"),
      cls: typeof audits["cumulative-layout-shift"]?.numericValue === "number" ? Number(audits["cumulative-layout-shift"].numericValue.toFixed(2)) : void 0,
      tbd: getMetricValue("total-blocking-time"),
      si: getMetricValue("speed-index"),
      tti: getMetricValue("interactive"),
      strategy
    };
  } catch (error) {
    console.warn(`PageSpeed fetch failed for ${url}:`, error);
    return null;
  }
}

function generateProposalNarrative(result) {
  const domain = new URL(result.url).hostname.replace(/^www\./, "");
  const businessName = result.seoMetadata?.title?.split("|")[0]?.split("-")[0]?.trim() || domain;
  const statusHeadlines = {
    critical: `${businessName} necesita un rediseño urgente para no perder más clientes`,
    improvable: `${businessName} está dejando oportunidades sobre la mesa`,
    competitive: `${businessName} puede mejorar significativamente su presencia digital`,
    strong: `${businessName} tiene una buena base para seguir creciendo`
  };
  const openingStatements = {
    critical: `Tras analizar la presencia digital de ${businessName}, hemos identificado problemas críticos que están afectando directamente la captación de nuevos clientes. Este informe detalla los hallazgos y presenta una propuesta concreta de mejora.`,
    improvable: `Hemos auditado la web de ${businessName} y encontrado oportunidades claras de mejora que, una vez implementadas, aumentarían notablemente la efectividad digital del negocio.`,
    competitive: `La web de ${businessName} tiene una base funcional. Hemos identificado áreas estratégicas donde una inversión en mejora generaría un retorno significativo.`,
    strong: `La web de ${businessName} está bien posicionada. Presentamos oportunidades para llevarla al siguiente nivel.`
  };
  const criticalFindings = (result.findings || []).filter((finding) => finding.severity === "critical").slice(0, 4);
  const keyProblems = criticalFindings.map((finding) => ({
    area: finding.category === "performance" ? "Rendimiento" : finding.category === "seo" ? "SEO" : finding.category === "ux" ? "Experiencia de usuario" : finding.category === "conversion" ? "Conversión" : "Branding",
    problem: finding.title,
    impact: finding.commercialImpact,
    solution: finding.recommendation
  }));
  return {
    businessName,
    headline: statusHeadlines[result.globalStatus] || `Propuesta de rediseño web para ${businessName}`,
    openingStatement: openingStatements[result.globalStatus] || openingStatements.improvable,
    diagnosisSummary: `Hemos analizado ${businessName} en 5 áreas clave: rendimiento, SEO, experiencia de usuario, conversión y branding. El resultado global es ${result.globalScore}/100.`,
    keyProblems,
    proposedSolution: `Proponemos un rediseño completo de la web de ${businessName} orientado a resultados de negocio: más visibilidad, más conversiones y una imagen profesional que genere confianza. El proyecto incluiría estrategia de contenido, diseño UX/UI moderno, optimización SEO y una base técnica sólida.`,
    expectedBenefits: [...result.globalScore < 50 ? ["Corrección de problemas críticos que están frenando el negocio"] : [], "Mayor visibilidad en buscadores y redes sociales", "Mejor experiencia de usuario en móvil y escritorio", "Incremento de solicitudes de contacto y conversiones", "Imagen profesional que genera confianza en los visitantes", "Base técnica sólida para seguir creciendo"],
    callToAction: `Conversemos sobre cómo podemos transformar la presencia digital de ${businessName}. Sin compromiso.`,
    urgencyNote: result.globalStatus === "critical" || result.globalStatus === "improvable" ? "Cada día sin mejoras es un día perdiendo clientes potenciales ante competidores con mejor presencia digital." : "Optimizar ahora supone ventaja competitiva frente a quienes aún no han dado el paso."
  };
}

function calculatePerformanceScore(pageSpeed) {
  if (!pageSpeed) {
    return {
      score: 50,
      summary: "No se pudo obtener datos de rendimiento de PageSpeed Insights."
    };
  }
  const score = pageSpeed.performanceScore;
  let summary = "El rendimiento es muy bajo. Una carga lenta provoca abandono antes de que el usuario vea la propuesta de valor.";
  if (score >= 90) {
    summary = "El rendimiento es excelente. La velocidad de carga es un punto fuerte de esta web.";
  } else if (score >= 70) {
    summary = "El rendimiento es aceptable pero tiene margen de mejora.";
  } else if (score >= 50) {
    summary = "El rendimiento es deficiente. La velocidad de carga puede estar afectando la experiencia del usuario.";
  }
  return {
    score,
    summary
  };
}
function calculateBrandingScore(uxSignals, metadata) {
  let score = 40;
  const findings = [];
  if (uxSignals.hasSocialLinks) {
    score += 15;
  } else {
    findings.push({
      id: "brand-social",
      category: "branding",
      severity: "recommended",
      title: "Sin presencia en redes",
      description: "No se detectaron links a redes sociales.",
      commercialImpact: "Una marca sin redes activas parece desactualizada o poco activa.",
      recommendation: "Mantener y enlazar perfiles sociales activos."
    });
  }
  if (uxSignals.hasTrustSignals) {
    score += 20;
  } else {
    findings.push({
      id: "brand-trust",
      category: "branding",
      severity: "important",
      title: "Sin señales de confianza visuales",
      description: "No se detectaron testimonios, premios, certificaciones u otros elementos de confianza.",
      commercialImpact: "La ausencia de prueba social reduce la credibilidad percibida y dificulta la decisión de contacto.",
      recommendation: "Añadir testimonios reales, logos de clientes, certificaciones o garantías."
    });
  }
  if (uxSignals.hasFavicon) {
    score += 5;
  }
  if (metadata.hasOpenGraph && metadata.ogImage) {
    score += 10;
  } else {
    findings.push({
      id: "brand-og-image",
      category: "branding",
      severity: "recommended",
      title: "Sin imagen Open Graph",
      description: "No se detectó imagen para preview en redes sociales.",
      commercialImpact: "Sin imagen OG, los shares en redes sociales muestran un preview genérico y poco atractivo.",
      recommendation: "Añadir og:image con una imagen de marca de calidad."
    });
  }
  score = Math.min(100, score);
  let summary = "El branding y las señales de confianza son débiles, lo que puede generar desconfianza en los visitantes.";
  if (score >= 80) {
    summary = "El branding y las señales de confianza son adecuados.";
  } else if (score >= 60) {
    summary = "El branding presenta áreas de mejora para reforzar la confianza.";
  }
  return {
    score,
    findings,
    summary
  };
}
function calculateGlobalScore(scores) {
  const weights = {
    performance: 0.25,
    seo: 0.2,
    ux: 0.25,
    conversion: 0.2,
    branding: 0.1
  };
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (typeof scores[key] === "number") {
      weightedSum += scores[key] * weight;
      totalWeight += weight;
    }
  }
  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  let status = "critical";
  if (globalScore >= 80) {
    status = "strong";
  } else if (globalScore >= 60) {
    status = "competitive";
  } else if (globalScore >= 40) {
    status = "improvable";
  }
  return {
    globalScore,
    status
  };
}

function analyzeSeo(metadata) {
  const findings = [];
  let totalPoints = 0;
  let maxPoints = 0;
  const addFinding = (id, points, max, severity, title, description, commercialImpact, recommendation) => {
    maxPoints += max;
    totalPoints += points;
    if (points < max) {
      findings.push({
        id,
        category: "seo",
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: Math.round(points / max * 100)
      });
    }
  };
  if (!metadata.title) {
    addFinding("seo-title-missing", 0, 15, "critical", "Título de página ausente", "La página no tiene etiqueta <title>.", "Sin título, Google no sabe cómo presentar esta página en resultados de búsqueda. Reduce drásticamente la visibilidad orgánica.", "Añadir un <title> descriptivo y único entre 50-60 caracteres.");
  } else if ((metadata.titleLength || 0) < 30) {
    addFinding("seo-title-short", 8, 15, "important", "Título demasiado corto", `El título tiene solo ${metadata.titleLength} caracteres.`, "Un título muy corto no aprovecha el potencial SEO y puede resultar poco informativo en buscadores.", "Ampliar el título a entre 50-60 caracteres incluyendo la keyword principal.");
  } else if ((metadata.titleLength || 0) > 70) {
    addFinding("seo-title-long", 10, 15, "recommended", "Título demasiado largo", `El título tiene ${metadata.titleLength} caracteres (recomendado: 50-60).`, "Google recortará el título en los resultados, perdiendo parte del mensaje.", "Acortar el título a 50-60 caracteres manteniendo la keyword principal al inicio.");
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }
  if (!metadata.metaDescription) {
    addFinding("seo-meta-missing", 0, 12, "critical", "Meta description ausente", "No hay meta description en la página.", "Sin meta description, Google puede generar automáticamente un fragmento poco atractivo que reduce el CTR.", "Añadir una meta description persuasiva de 150-160 caracteres con llamada a la acción.");
  } else if ((metadata.metaDescriptionLength || 0) < 80) {
    addFinding("seo-meta-short", 7, 12, "important", "Meta description demasiado corta", `La meta description tiene solo ${metadata.metaDescriptionLength} caracteres.`, "Una descripción corta no aprovecha el espacio disponible para convencer al usuario de hacer clic.", "Ampliar la meta description a 150-160 caracteres con propuesta de valor clara.");
  } else if ((metadata.metaDescriptionLength || 0) > 165) {
    addFinding("seo-meta-long", 9, 12, "recommended", "Meta description demasiado larga", `La meta description tiene ${metadata.metaDescriptionLength} caracteres (recomendado: 150-160).`, "Google recortará la descripción, cortando posiblemente el mensaje más importante.", "Acortar la meta description a un máximo de 160 caracteres.");
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }
  if (!metadata.hasViewport) {
    addFinding("seo-viewport-missing", 0, 12, "critical", "Meta viewport ausente", "La página no tiene meta viewport configurado.", "Sin viewport, la experiencia móvil es deficiente y puede perjudicar el índice mobile-first.", 'Añadir <meta name="viewport" content="width=device-width, initial-scale=1">.');
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }
  if (metadata.h1Count === 0) {
    addFinding("seo-h1-missing", 0, 10, "critical", "H1 ausente", "La página no tiene ninguna etiqueta H1.", "El H1 es una señal jerárquica importante para buscadores y usuarios. Su ausencia confunde el foco de la página.", "Añadir un H1 claro y descriptivo con la keyword principal de la página.");
  } else if (metadata.h1Count > 1) {
    addFinding("seo-h1-multiple", 7, 10, "important", "Múltiples H1 detectados", `La página tiene ${metadata.h1Count} etiquetas H1.`, "Múltiples H1 diluyen la señal SEO y confunden la jerarquía visual.", "Usar un único H1 con el mensaje principal de la página.");
  } else {
    maxPoints += 10;
    totalPoints += 10;
  }
  if (!metadata.hasOpenGraph) {
    addFinding("seo-og-missing", 0, 8, "important", "Open Graph ausente", "No hay etiquetas Open Graph para redes sociales.", "Sin Open Graph, al compartir la web en redes el preview es genérico y poco atractivo.", "Añadir og:title, og:description, og:image y og:url.");
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }
  if (!metadata.hasFavicon) {
    addFinding("seo-favicon-missing", 0, 5, "recommended", "Favicon ausente", "No se detectó favicon en la página.", "El favicon refuerza la identidad visual y la percepción de profesionalidad.", "Añadir un favicon representativo de la marca.");
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (!metadata.langAttribute) {
    addFinding("seo-lang-missing", 0, 5, "recommended", "Atributo lang ausente", "El HTML no especifica el idioma de la página.", "Sin atributo lang, los motores de búsqueda y lectores de pantalla no identifican correctamente el idioma.", 'Añadir lang="es" (o el idioma correspondiente) al elemento <html>.');
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (metadata.hasStructuredData) {
    maxPoints += 5;
    totalPoints += 5;
  }
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "El SEO está muy deficiente, la web tiene poca visibilidad orgánica.";
  if (score >= 80) {
    summary = "El SEO básico está bien configurado.";
  } else if (score >= 60) {
    summary = "El SEO presenta algunas carencias importantes que limitan la visibilidad.";
  } else if (score >= 40) {
    summary = "El SEO tiene problemas significativos que reducen la visibilidad en buscadores.";
  }
  return {
    score,
    findings,
    summary
  };
}

function analyzeUx(_metadata, uxSignals, _html) {
  const findings = [];
  let totalPoints = 0;
  let maxPoints = 0;
  const check = (condition, id, points, max, severity, title, description, commercialImpact, recommendation) => {
    maxPoints += max;
    if (condition) {
      totalPoints += points;
    } else {
      findings.push({
        id,
        category: "ux",
        severity,
        title,
        description,
        commercialImpact,
        recommendation,
        score: 0
      });
    }
  };
  check(uxSignals.hasMobileOptimization, "ux-mobile", 15, 15, "critical", "Experiencia móvil deficiente", "La web no parece estar optimizada para dispositivos móviles.", "Más del 60% del tráfico web es móvil. Una mala experiencia móvil significa perder buena parte de los visitantes potenciales.", "Implementar diseño responsive con viewport meta y layouts adaptados a móvil.");
  check(uxSignals.hasHeader, "ux-header", 8, 8, "important", "Estructura de header no detectada", "No se detectó un elemento <header> semántico en la página.", "Un header claro es clave para la navegación. Sin él la experiencia de usuario se fragmenta.", "Definir un header con logo, navegación principal y CTA visible.");
  check(uxSignals.hasFooter, "ux-footer", 5, 5, "recommended", "Footer no detectado", "No se detectó un elemento <footer> en la página.", "El footer aporta información de contacto, navegación secundaria y señales de confianza importantes.", "Añadir footer con información de contacto, links importantes y datos legales.");
  check(uxSignals.hasCta, "ux-cta", 15, 15, "critical", "CTA principal no detectado", "No se detectaron llamadas a la acción claras en la página.", "Sin CTA, el usuario no sabe qué hacer a continuación y las conversiones se reducen drásticamente.", 'Añadir CTAs claros y visibles: "Solicitar presupuesto", "Contactar" o "Empezar ahora".');
  check(uxSignals.hasContactInfo, "ux-contact", 12, 12, "critical", "Información de contacto no detectada", "No se encontraron vías de contacto claras (teléfono, email o formulario).", "Si el usuario no puede contactar fácilmente, simplemente se irá. Esto representa pérdida directa de clientes potenciales.", "Añadir teléfono, email y/o formulario de contacto bien visible.");
  check(uxSignals.hasSocialLinks, "ux-social", 6, 6, "recommended", "Sin presencia en redes sociales detectada", "No se detectaron enlaces a redes sociales.", "La ausencia de redes sociales puede reducir la percepción de marca activa y confiable.", "Enlazar perfiles activos en redes sociales relevantes para el negocio.");
  if (uxSignals.estimatedWordCount < 200) {
    findings.push({
      id: "ux-content-thin",
      category: "ux",
      severity: "important",
      title: "Contenido escaso",
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras. Esto es insuficiente.`,
      commercialImpact: "Poco contenido significa poca información para el usuario y para los motores de búsqueda. Reduce confianza y visibilidad.",
      recommendation: "Desarrollar contenido que explique el valor de la empresa, sus servicios y diferenciales. Mínimo 400-600 palabras.",
      score: 30
    });
    maxPoints += 8;
  } else if (uxSignals.estimatedWordCount < 400) {
    findings.push({
      id: "ux-content-sparse",
      category: "ux",
      severity: "recommended",
      title: "Contenido limitado",
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras.`,
      commercialImpact: "Un contenido más rico mejoraría la percepción de la empresa y el posicionamiento SEO.",
      recommendation: "Enriquecer el contenido con más información sobre servicios, beneficios y propuesta de valor.",
      score: 60
    });
    maxPoints += 8;
    totalPoints += 5;
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }
  if (uxSignals.imagesCount === 0) {
    findings.push({
      id: "ux-no-images",
      category: "ux",
      severity: "important",
      title: "Sin imágenes detectadas",
      description: "No se encontraron imágenes en la página.",
      commercialImpact: "Las páginas sin imágenes son menos atractivas y reducen el tiempo de permanencia del usuario.",
      recommendation: "Añadir imágenes de calidad: foto del equipo, productos, oficina o gráficos representativos.",
      score: 0
    });
    maxPoints += 6;
  } else {
    maxPoints += 6;
    totalPoints += 6;
  }
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "La experiencia de usuario es deficiente. Esto impacta directamente en la captación de clientes.";
  if (score >= 80) {
    summary = "La experiencia de usuario es razonablemente buena.";
  } else if (score >= 60) {
    summary = "La UX presenta oportunidades de mejora notables.";
  } else if (score >= 40) {
    summary = "La experiencia de usuario tiene carencias importantes que afectan la conversión.";
  }
  return {
    score,
    findings,
    summary
  };
}

function decodeHtmlEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}
function extractSeoMetadata(html, _baseUrl) {
  const getTag = (pattern) => {
    const match = html.match(pattern);
    return match?.[1] ? decodeHtmlEntities(match[1].trim()) : void 0;
  };
  const hasTag = (pattern) => pattern.test(html);
  const title = getTag(/<title[^>]*>([^<]+)<\/title>/i);
  const metaDescription = getTag(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const hasViewport = hasTag(/<meta[^>]*name=["']viewport["']/i);
  const h1Matches = html.match(/<h1[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  const h1Raw = h1Matches[0] || "";
  const h1 = h1Raw.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const hasOpenGraph = hasTag(/<meta[^>]*property=["']og:/i);
  const ogTitle = getTag(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogDescription = getTag(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  const ogImage = getTag(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const hasFavicon = hasTag(/<link[^>]*rel=["'][^"']*icon[^"']*["']/i);
  const hasCanonical = hasTag(/<link[^>]*rel=["']canonical["']/i);
  const robotsMeta = getTag(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  const hasStructuredData = hasTag(/<script[^>]*type=["']application\/ld\+json["']/i);
  const langAttribute = getTag(/<html[^>]*lang=["']([^"']+)["']/i);
  return {
    title,
    titleLength: title?.length,
    metaDescription,
    metaDescriptionLength: metaDescription?.length,
    hasViewport,
    h1: h1 || void 0,
    h1Count,
    hasOpenGraph,
    ogTitle,
    ogDescription,
    ogImage,
    hasFavicon,
    hasCanonical,
    robotsMeta,
    hasStructuredData,
    langAttribute
  };
}
function extractUxSignals(html) {
  const lower = html.toLowerCase();
  const hasTag = (pattern) => pattern.test(lower);
  const hasMobileOptimization = hasTag(/<meta[^>]*viewport/i);
  const hasContactInfo = hasTag(/tel:|mailto:|whatsapp|contacto|contact|llámanos|llamanos/i) || hasTag(/\+\d{7,}/) || hasTag(/<a[^>]*href=["']tel:/i) || hasTag(/<a[^>]*href=["']mailto:/i);
  const hasCta = hasTag(/presupuesto|cotización|cotizaci|quote|demo|prueba|gratis|free|empezar|start|contáctanos|contact us|llamar|call now|reservar|booking|solicitar/i);
  const hasForm = hasTag(/<form[\s>]/i);
  const hasSocialLinks = hasTag(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com|x\.com/i);
  const hasTrustSignals = hasTag(/garantía|guarantee|certificad|award|premio|review|reseña|testimoni|trusted|confianza|ssl|seguro|caso de éxito|casos de éxito/i);
  const hasExternalLinks = hasTag(/<a[^>]*href=["']https?:\/\//i);
  const strippedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const estimatedWordCount = strippedHtml ? strippedHtml.split(/\s+/).length : 0;
  const imagesCount = (html.match(/<img[\s>]/gi) || []).length;
  const videosCount = (html.match(/<video[\s>]|youtube\.com\/embed|vimeo\.com\/video/gi) || []).length;
  const navMatches = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi) || [];
  const navigationLinksCount = navMatches.reduce((count, nav) => count + (nav.match(/<a[\s>]/gi) || []).length, 0);
  const hasFooter = hasTag(/<footer[\s>]/i);
  const hasHeader = hasTag(/<header[\s>]/i);
  return {
    hasMobileOptimization,
    hasContactInfo,
    hasCta,
    hasForm,
    hasSocialLinks,
    hasTrustSignals,
    hasExternalLinks,
    estimatedWordCount,
    imagesCount,
    videosCount,
    navigationLinksCount,
    hasFooter,
    hasHeader
  };
}

function statusFromScore(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "competitive";
  if (score >= 40) return "improvable";
  return "critical";
}
async function runAudit(request) {
  const {
    url
  } = request;
  let html = "";
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WebAuditor/1.0)",
        Accept: "text/html,application/xhtml+xml"
      },
      signal: AbortSignal.timeout(15e3)
    });
    if (response.ok) {
      html = await response.text();
    }
  } catch (error) {
    console.warn("Failed to fetch target URL:", error);
  }
  const seoMetadata = extractSeoMetadata(html);
  const uxSignals = extractUxSignals(html);
  const pagespeedSettled = await Promise.allSettled([fetchPageSpeedData(url, "mobile"), fetchPageSpeedData(url, "desktop")]);
  const pageSpeedMobile = pagespeedSettled[0].status === "fulfilled" ? pagespeedSettled[0].value : null;
  const pageSpeedDesktop = pagespeedSettled[1].status === "fulfilled" ? pagespeedSettled[1].value : null;
  const seoAnalysis = analyzeSeo(seoMetadata);
  const uxAnalysis = analyzeUx(seoMetadata, uxSignals);
  const conversionAnalysis = analyzeConversion(seoMetadata, uxSignals);
  const performanceAnalysis = calculatePerformanceScore(pageSpeedMobile || void 0);
  const brandingAnalysis = calculateBrandingScore({
    hasSocialLinks: uxSignals.hasSocialLinks,
    hasTrustSignals: uxSignals.hasTrustSignals,
    hasFavicon: seoMetadata.hasFavicon
  }, {
    title: seoMetadata.title,
    ogImage: seoMetadata.ogImage,
    hasOpenGraph: seoMetadata.hasOpenGraph
  });
  const allFindings = [...seoAnalysis.findings, ...uxAnalysis.findings, ...conversionAnalysis.findings, ...brandingAnalysis.findings];
  if (pageSpeedMobile && pageSpeedMobile.performanceScore < 70) {
    allFindings.push({
      id: "perf-low-score",
      category: "performance",
      severity: pageSpeedMobile.performanceScore < 50 ? "critical" : "important",
      title: "Rendimiento bajo en móvil",
      description: `El score de rendimiento móvil es ${pageSpeedMobile.performanceScore}/100.`,
      commercialImpact: "Una carga lenta provoca que los usuarios abandonen antes de ver el contenido. Impacta directamente en conversiones.",
      recommendation: "Optimizar imágenes, implementar lazy loading, reducir JavaScript bloqueante y considerar un CDN.",
      score: pageSpeedMobile.performanceScore
    });
  }
  const scores = {
    performance: performanceAnalysis.score,
    seo: seoAnalysis.score,
    ux: uxAnalysis.score,
    conversion: conversionAnalysis.score,
    branding: brandingAnalysis.score
  };
  const {
    globalScore,
    status: globalStatus
  } = calculateGlobalScore(scores);
  const categoryScores = {
    performance: {
      category: "performance",
      label: "Rendimiento",
      score: performanceAnalysis.score,
      status: statusFromScore(performanceAnalysis.score),
      summary: performanceAnalysis.summary,
      findings: allFindings.filter((finding) => finding.category === "performance")
    },
    seo: {
      category: "seo",
      label: "SEO",
      score: seoAnalysis.score,
      status: statusFromScore(seoAnalysis.score),
      summary: seoAnalysis.summary,
      findings: seoAnalysis.findings
    },
    ux: {
      category: "ux",
      label: "UX / Diseño",
      score: uxAnalysis.score,
      status: statusFromScore(uxAnalysis.score),
      summary: uxAnalysis.summary,
      findings: uxAnalysis.findings
    },
    conversion: {
      category: "conversion",
      label: "Conversión",
      score: conversionAnalysis.score,
      status: statusFromScore(conversionAnalysis.score),
      summary: conversionAnalysis.summary,
      findings: conversionAnalysis.findings
    },
    branding: {
      category: "branding",
      label: "Branding",
      score: brandingAnalysis.score,
      status: statusFromScore(brandingAnalysis.score),
      summary: brandingAnalysis.summary,
      findings: brandingAnalysis.findings
    }
  };
  const executiveSummary = generateExecutiveSummary({
    globalStatus});
  const redesignOpportunity = generateRedesignOpportunity({
    findings: allFindings
  });
  const quickWins = generateQuickWins(allFindings);
  const primaryPainPoints = allFindings.filter((finding) => finding.severity === "critical").slice(0, 5).map((finding) => finding.commercialImpact);
  const estimatedImpactAreas = Object.values(categoryScores).filter((score) => score.score < 60).map((score) => score.label);
  const recommendations = generateRecommendations(allFindings, pageSpeedMobile?.performanceScore);
  const proposalNarrative = generateProposalNarrative({
    url,
    globalStatus,
    globalScore,
    findings: allFindings,
    seoMetadata
  });
  return {
    url,
    analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
    siteName: seoMetadata.title?.split("|")[0]?.split("-")[0]?.trim(),
    siteDescription: seoMetadata.metaDescription,
    globalScore,
    globalStatus,
    categoryScores,
    seoMetadata,
    pageSpeedMobile: pageSpeedMobile || void 0,
    pageSpeedDesktop: pageSpeedDesktop || void 0,
    uxSignals,
    findings: allFindings,
    recommendations,
    executiveSummary,
    redesignOpportunity,
    quickWins,
    primaryPainPoints,
    estimatedImpactAreas,
    proposalNarrative
  };
}

function validateUrl(input) {
  let url = input.trim();
  if (!url) {
    return {
      valid: false,
      error: "Por favor, introduce una URL"
    };
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return {
        valid: false,
        error: "La URL no parece válida. Incluye el dominio completo (ej: ejemplo.com)"
      };
    }
    return {
      valid: true,
      url: parsed.toString()
    };
  } catch {
    return {
      valid: false,
      error: "La URL no tiene un formato válido"
    };
  }
}

const POST = async ({
  request
}) => {
  try {
    const body = await request.json();
    const rawUrl = typeof body?.url === "string" ? body.url : "";
    const validation = validateUrl(rawUrl);
    if (!validation.valid || !validation.url) {
      return new Response(JSON.stringify({
        error: validation.error,
        code: "INVALID_URL"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const result = await runAudit({
      url: validation.url
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Audit error:", error);
    return new Response(JSON.stringify({
      error: "Error interno al analizar la web. Por favor, inténtalo de nuevo.",
      code: "INTERNAL_ERROR"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
