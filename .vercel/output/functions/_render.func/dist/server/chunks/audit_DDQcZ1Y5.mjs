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
  check(hasValueProp, "conv-value-prop", 15, 15, "critical", "Propuesta de valor no clara", "No se detecta una propuesta de valor clara en el título o H1.", "El usuario necesita entender en segundos qué ofrece el negocio y por qué elegirlo. Sin esto, el abandono es inmediato.", "Definir un H1 que comunique claramente el beneficio principal para el cliente, no solo el nombre del negocio.");
  check(uxSignals.hasCta, "conv-cta-visible", 18, 18, "critical", "Sin llamada a la acción visible", "No se detectaron CTAs claros para guiar al usuario.", "Sin CTA, el usuario no tiene claro el siguiente paso. Esto elimina oportunidades de conversión directa. Es el fallo más costoso en términos de negocio.", 'Añadir CTAs claros como "Solicitar presupuesto gratuito", "Llamar ahora" o "Ver más información" en la parte superior de la página.');
  check(uxSignals.hasForm, "conv-form", 12, 12, "important", "Sin formulario de contacto", "No se detectó ningún formulario en la página.", "El formulario es la vía más cómoda para que usuarios fuera de horario de oficina puedan contactar. Su ausencia elimina conversiones asincrónicas.", "Añadir formulario de contacto simple: nombre, email, mensaje y botón de envío. Mantenerlo corto para reducir fricción.");
  check(uxSignals.hasTrustSignals, "conv-trust", 12, 12, "important", "Señales de confianza ausentes", "No se detectaron testimonios, certificaciones, premios u otras señales de confianza.", "El 92% de los consumidores lee opiniones antes de decidir. La ausencia de prueba social aumenta la desconfianza y reduce la tasa de contacto.", "Añadir testimonios de clientes reales (con foto y nombre), logotipos de clientes, certificaciones o números de clientes atendidos.");
  check(uxSignals.hasContactInfo, "conv-contact-visible", 10, 10, "important", "Datos de contacto no visibles", "No se detectaron teléfono o email de forma evidente.", "Muchos usuarios quieren contactar directamente. Sin datos visibles, se pierden estas conversiones de alta intención.", "Mostrar teléfono y/o email de forma prominente en header y footer.");
  check(uxSignals.hasPhoneNumber, "conv-phone", 10, 10, "important", "Teléfono de contacto no detectado", "No se detectó un número de teléfono en la página.", "El teléfono es el canal de mayor intención de compra. Su ausencia hace perder a los usuarios más comprometidos que quieren una respuesta inmediata.", "Añadir el teléfono en formato clickable (tel:) en el header y en zona de contacto. En móvil, es la acción de conversión más directa.");
  check(uxSignals.hasEmailAddress, "conv-email", 6, 6, "recommended", "Email de contacto no visible", "No se detectó una dirección de email en la página.", "Algunos usuarios prefieren el email para consultas detalladas. Su ausencia reduce las opciones de contacto.", "Añadir un email de contacto visible, preferiblemente del dominio propio (no Hotmail/Gmail).");
  check(uxSignals.hasPricingInfo, "conv-pricing", 10, 10, "important", "Sin información de precios o presupuesto", "No se detecta información sobre precios, tarifas o cómo obtener un presupuesto.", "La incertidumbre sobre el precio es uno de los principales frenos para contactar. Los usuarios quieren al menos orientación de precio antes de llamar.", 'Añadir precios orientativos, rangos de presupuesto o un módulo de "solicitar presupuesto gratis" prominente.');
  if (uxSignals.hasGuarantee) {
    maxPoints += 6;
    totalPoints += 6;
  } else {
    findings.push({
      id: "conv-no-guarantee",
      category: "conversion",
      severity: "recommended",
      title: "Sin garantías o políticas de devolución",
      description: 'No se detectó ninguna mención a garantías, políticas de devolución o "sin compromiso".',
      commercialImpact: "Las garantías reducen el riesgo percibido y aumentan la probabilidad de contacto. Son especialmente efectivas en servicios de alto valor.",
      recommendation: 'Añadir mensajes de garantía: "Presupuesto sin compromiso", "Satisfacción garantizada" o condiciones claras de trabajo.',
      score: 0
    });
    maxPoints += 6;
  }
  check(uxSignals.hasSocialLinks, "conv-social-proof", 5, 5, "recommended", "Sin redes sociales visibles", "No se detectaron enlaces a redes sociales.", "Las redes sociales activas son una señal de marca viva y confiable para el usuario.", "Enlazar perfiles de redes sociales activos del negocio.");
  if (uxSignals.hasLiveChat) {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (!uxSignals.hasUrgency) {
    findings.push({
      id: "conv-no-urgency",
      category: "conversion",
      severity: "recommended",
      title: "Sin elementos de urgencia o escasez",
      description: "No se detectaron elementos que generen urgencia en la decisión del usuario.",
      commercialImpact: "Los elementos de urgencia (ofertas limitadas, plazas, tiempo) pueden aumentar la tasa de conversión entre un 10-30%.",
      recommendation: "Considerar añadir ofertas por tiempo limitado, plazas disponibles o promociones estacionales cuando sea honesto y relevante.",
      score: 0
    });
    maxPoints += 4;
  } else {
    maxPoints += 4;
    totalPoints += 4;
  }
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "Esta web está perdiendo la mayoría de sus oportunidades de conversión. Cambios relativamente simples pueden multiplicar los contactos recibidos.";
  if (score >= 80) {
    summary = "Los elementos de conversión básicos están presentes y bien configurados.";
  } else if (score >= 60) {
    summary = "Hay oportunidades claras de mejora en los elementos de conversión que aumentarían los contactos recibidos.";
  } else if (score >= 40) {
    summary = "La página carece de elementos clave para convertir visitantes en clientes. Corregirlos tiene impacto directo en el negocio.";
  }
  return {
    score,
    findings,
    summary
  };
}

function generateExecutiveSummary(result) {
  const criticalCount = result.findings.filter((finding) => finding.severity === "critical").length;
  const importantCount = result.findings.filter((finding) => finding.severity === "important").length;
  const weakAreas = Object.values(result.categoryScores).filter((cat) => cat.score < 50).map((cat) => cat.label).join(", ");
  const perfScore = result.pageSpeedMobile?.performanceScore;
  const perfNote = perfScore !== void 0 ? ` El rendimiento móvil es de ${perfScore}/100${perfScore < 50 ? " (crítico)" : perfScore < 70 ? " (mejorable)" : ""}.` : "";
  if (result.globalStatus === "critical") {
    return `La web presenta ${criticalCount} problema${criticalCount !== 1 ? "s" : ""} crítico${criticalCount !== 1 ? "s" : ""} y ${importantCount} importante${importantCount !== 1 ? "s" : ""} en áreas clave.${perfNote} Las áreas más débiles son: ${weakAreas || "múltiples categorías"}. El estado actual representa una pérdida significativa de oportunidades de negocio que se puede corregir.`;
  }
  if (result.globalStatus === "improvable") {
    return `La web funciona pero tiene ${criticalCount} problema${criticalCount !== 1 ? "s" : ""} crítico${criticalCount !== 1 ? "s" : ""} y ${importantCount} mejora${importantCount !== 1 ? "s" : ""} importantes que limitan su efectividad.${perfNote}${weakAreas ? ` Las áreas con mayor oportunidad son: ${weakAreas}.` : ""} Implementar las mejoras recomendadas aumentaría notablemente los contactos y conversiones.`;
  }
  if (result.globalStatus === "competitive") {
    return `La web tiene una base razonable con ${criticalCount + importantCount} puntos de mejora detectados.${perfNote} Hay oportunidades estratégicas para maximizar el retorno de la presencia digital.`;
  }
  return `La web está bien configurada en la mayoría de áreas.${perfNote} Se han detectado ${criticalCount + importantCount} optimizaciones que podrían mejorar aún más los resultados.`;
}
function generateRedesignOpportunity(result) {
  const criticalFindings = result.findings.filter((finding) => finding.severity === "critical").length;
  const importantFindings = result.findings.filter((finding) => finding.severity === "important").length;
  const totalProblems = criticalFindings + importantFindings;
  const hasPerfProblems = result.findings.some((finding) => finding.category === "performance" && finding.severity === "critical");
  const hasSeoProblems = result.findings.some((finding) => finding.category === "seo" && finding.severity === "critical");
  const hasConvProblems = result.findings.some((finding) => finding.category === "conversion" && finding.severity === "critical");
  const hasUxProblems = result.findings.some((finding) => finding.category === "ux" && finding.severity === "critical");
  const problemAreas = [];
  if (hasPerfProblems) problemAreas.push("rendimiento");
  if (hasSeoProblems) problemAreas.push("SEO");
  if (hasUxProblems) problemAreas.push("experiencia de usuario");
  if (hasConvProblems) problemAreas.push("conversión");
  if (criticalFindings > 5) {
    return `Esta web necesita urgentemente una revisión completa. Se detectaron ${criticalFindings} problemas críticos en ${problemAreas.join(", ")}, que representan una pérdida directa de clientes potenciales cada día. Un rediseño integral eliminaría estas barreras y devolvería competitividad al negocio de forma inmediata.`;
  }
  if (criticalFindings > 2) {
    return `La web tiene ${criticalFindings} problemas críticos en ${problemAreas.join(" y ")} que justifican una intervención prioritaria. Un rediseño enfocado en estos puntos tendría un impacto directo y medible en las conversiones del negocio.`;
  }
  if (totalProblems > 6) {
    return `Aunque no hay fallos críticos graves, la web acumula ${totalProblems} problemas entre importantes y recomendados. Un rediseño estratégico resolvería todos de una vez y elevaría la efectividad comercial de forma sostenida.`;
  }
  if (importantFindings > 3) {
    return `La web tiene una base funcional pero ${importantFindings} carencias importantes limitan su efectividad. Mejorar la UX y los elementos de conversión generaría resultados comerciales notablemente mejores.`;
  }
  return "La web tiene una base funcional sólida. Hay oportunidades de optimización incremental que mejorarían la experiencia y la conversión sin necesidad de un rediseño completo.";
}
function generateQuickWins(findings) {
  const quickWins = [];
  if (findings.some((finding) => finding.id === "seo-no-https")) {
    quickWins.push(`Instalar certificado SSL (gratis con Let's Encrypt) para pasar a HTTPS y eliminar el aviso "No seguro" que espanta visitantes.`);
  }
  const seoBasicProblems = findings.filter((finding) => ["seo-title-missing", "seo-meta-missing", "seo-viewport-missing", "seo-h1-missing"].includes(finding.id));
  if (seoBasicProblems.length > 0) {
    quickWins.push(`Completar las ${seoBasicProblems.length} etiqueta${seoBasicProblems.length > 1 ? "s" : ""} SEO básica${seoBasicProblems.length > 1 ? "s" : ""} ausente${seoBasicProblems.length > 1 ? "s" : ""} (${seoBasicProblems.map((finding) => finding.title.split(" ")[0]).join(", ")}) para mejorar visibilidad en buscadores.`);
  }
  if (findings.some((finding) => finding.id === "seo-robots-noindex")) {
    quickWins.push('Eliminar "noindex" del meta robots — la página está invisible para Google y otros buscadores.');
  }
  if (findings.some((finding) => finding.id === "ux-cta" || finding.id === "conv-cta-visible")) {
    quickWins.push("Añadir CTAs claros y visibles en la zona superior de la página que guíen al usuario hacia el contacto o la solicitud de presupuesto.");
  }
  if (findings.some((finding) => finding.id === "ux-phone-missing" || finding.id === "conv-phone")) {
    quickWins.push("Añadir el teléfono en formato clickable (tel:) en el header — es la acción de conversión más directa para usuarios móviles.");
  }
  if (findings.some((finding) => ["ux-contact", "conv-contact-visible"].includes(finding.id))) {
    quickWins.push("Mostrar información de contacto (teléfono y email) de forma prominente en header y footer para reducir la fricción de contacto.");
  }
  if (findings.some((finding) => finding.id === "seo-canonical-missing")) {
    quickWins.push("Añadir etiqueta canonical para evitar contenido duplicado y consolidar la autoridad SEO en una única URL.");
  }
  if (findings.some((finding) => finding.id === "seo-og-missing")) {
    quickWins.push("Configurar Open Graph (og:title, og:description, og:image) para mejorar el aspecto al compartir en redes sociales.");
  }
  if (findings.some((finding) => ["brand-trust", "conv-trust", "ux-no-trust"].includes(finding.id))) {
    quickWins.push("Añadir testimonios de clientes reales con foto y nombre — es el elemento que más aumenta la tasa de contacto en servicios locales.");
  }
  if (findings.some((finding) => finding.id === "seo-structured-data-missing")) {
    quickWins.push("Implementar Schema.org (LocalBusiness o Organization) para obtener rich snippets en Google y aumentar la visibilidad.");
  }
  if (quickWins.length === 0) {
    quickWins.push("Mantener la base técnica actual, optimizar el contenido con más prueba social y realizar pruebas A/B en los CTAs para seguir mejorando.");
  }
  return quickWins.slice(0, 6);
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
      title: `Rendimiento crítico: ${performanceScore}/100`,
      problem: `El score de rendimiento es ${performanceScore}/100. La web carga demasiado lento en dispositivos móviles.`,
      whyItMatters: "Una web lenta pierde usuarios antes de que vean el contenido. Google también penaliza la lentitud en el ranking con los Core Web Vitals.",
      commercialImpact: "Cada segundo de retraso puede reducir las conversiones entre un 7% y un 20%. Con un score tan bajo, el impacto puede ser mayor.",
      action: "Optimizar imágenes (convertir a WebP, comprimir), implementar lazy loading, minificar CSS/JS, diferir JavaScript no crítico y considerar un CDN.",
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
  const criticalCount = result.findings.filter((finding) => finding.severity === "critical").length;
  const importantCount = result.findings.filter((finding) => finding.severity === "important").length;
  const statusHeadlines = {
    critical: `${businessName}: ${criticalCount} problema${criticalCount !== 1 ? "s" : ""} crítico${criticalCount !== 1 ? "s" : ""} que está${criticalCount !== 1 ? "n" : ""} frenando el negocio`,
    improvable: `${businessName} está dejando oportunidades de negocio sobre la mesa`,
    competitive: `${businessName} puede mejorar significativamente su captación digital`,
    strong: `${businessName} tiene una buena base para seguir creciendo`
  };
  const openingStatements = {
    critical: `Tras analizar en profundidad la presencia digital de ${businessName}, hemos identificado ${criticalCount} problema${criticalCount !== 1 ? "s" : ""} crítico${criticalCount !== 1 ? "s" : ""} y ${importantCount} mejora${importantCount !== 1 ? "s" : ""} importantes que están afectando directamente la captación de nuevos clientes. Este informe detalla los hallazgos con precisión y presenta una propuesta concreta de mejora.`,
    improvable: `Hemos auditado la presencia digital de ${businessName} y encontrado ${criticalCount + importantCount} oportunidades de mejora que, una vez implementadas, aumentarían notablemente la efectividad de la web como herramienta de negocio.`,
    competitive: `La web de ${businessName} tiene una base funcional. Hemos identificado ${criticalCount + importantCount} áreas estratégicas donde una inversión en mejora generaría un retorno significativo en contactos y conversiones.`,
    strong: `La web de ${businessName} está bien posicionada. Hemos identificado optimizaciones que permitirían llevarla al siguiente nivel de rendimiento y conversión.`
  };
  const criticalFindings = (result.findings || []).filter((finding) => finding.severity === "critical").slice(0, 4);
  const keyProblems = criticalFindings.map((finding) => ({
    area: finding.category === "performance" ? "Rendimiento" : finding.category === "seo" ? "SEO y Visibilidad" : finding.category === "ux" ? "Experiencia de Usuario" : finding.category === "conversion" ? "Conversión y Captación" : "Branding y Confianza",
    problem: finding.title,
    impact: finding.commercialImpact,
    solution: finding.recommendation
  }));
  const expectedBenefits = [];
  const hasPerfIssues = result.findings.some((finding) => finding.category === "performance" && (finding.severity === "critical" || finding.severity === "important"));
  const hasSeoIssues = result.findings.some((finding) => finding.category === "seo" && (finding.severity === "critical" || finding.severity === "important"));
  const hasConvIssues = result.findings.some((finding) => finding.category === "conversion" && (finding.severity === "critical" || finding.severity === "important"));
  const hasTrustIssues = result.findings.some((finding) => ["brand-trust", "conv-trust", "ux-no-trust"].includes(finding.id));
  const hasNoHttps = result.findings.some((finding) => finding.id === "seo-no-https");
  const hasMobileIssues = result.findings.some((finding) => finding.id === "ux-mobile" || finding.id === "perf-mobile-desktop-gap");
  if (result.globalScore < 50) {
    expectedBenefits.push(`Resolución de los ${criticalCount} problemas críticos que frenan actualmente el negocio`);
  }
  if (hasNoHttps) {
    expectedBenefits.push('Activación de HTTPS para eliminar el aviso "No seguro" y recuperar la confianza del visitante');
  }
  if (hasSeoIssues) {
    expectedBenefits.push("Mayor visibilidad en Google y otros buscadores, atrayendo tráfico orgánico cualificado");
  }
  if (hasMobileIssues) {
    expectedBenefits.push("Experiencia óptima en móvil, donde llega más del 60% del tráfico");
  }
  if (hasPerfIssues) {
    expectedBenefits.push("Carga más rápida que reduce el abandono y mejora el posicionamiento en Google");
  }
  if (hasConvIssues) {
    expectedBenefits.push("Incremento de solicitudes de contacto y conversiones con CTAs y formularios efectivos");
  }
  if (hasTrustIssues) {
    expectedBenefits.push("Mayor credibilidad y confianza con testimonios, garantías y señales de profesionalidad");
  }
  expectedBenefits.push("Imagen profesional coherente que genera confianza desde el primer segundo");
  expectedBenefits.push("Base técnica sólida y escalable para seguir creciendo");
  const solutionParts = [`un rediseño de ${businessName} orientado a resultados de negocio`];
  if (hasSeoIssues) solutionParts.push("estrategia de contenido y SEO");
  if (hasMobileIssues || hasPerfIssues) solutionParts.push("optimización de rendimiento y experiencia móvil");
  solutionParts.push("diseño UX/UI moderno");
  if (hasConvIssues) solutionParts.push("elementos de conversión efectivos");
  if (hasTrustIssues) solutionParts.push("prueba social y señales de confianza");
  const diagnosisSummary = `Hemos analizado ${businessName} en 5 áreas clave: rendimiento, SEO, experiencia de usuario, conversión y branding. El resultado global es ${result.globalScore}/100, con ${criticalCount} problema${criticalCount !== 1 ? "s" : ""} crítico${criticalCount !== 1 ? "s" : ""} y ${importantCount} punto${importantCount !== 1 ? "s" : ""} importante${importantCount !== 1 ? "s" : ""} de mejora identificados.`;
  return {
    businessName,
    headline: statusHeadlines[result.globalStatus] || `Propuesta de mejora web para ${businessName}`,
    openingStatement: openingStatements[result.globalStatus] || openingStatements.improvable,
    diagnosisSummary,
    keyProblems,
    proposedSolution: `Proponemos ${solutionParts.join(", ")}: más visibilidad, más conversiones y una imagen profesional que genere confianza. Cada mejora está directamente vinculada a los problemas detectados en esta auditoría.`,
    expectedBenefits: expectedBenefits.slice(0, 7),
    callToAction: `Conversemos sobre cómo transformar la presencia digital de ${businessName} en una herramienta real de captación de clientes. Sin compromiso, con resultados medibles.`,
    urgencyNote: result.globalStatus === "critical" || result.globalStatus === "improvable" ? `Cada día sin mejoras es un día en el que ${businessName} pierde clientes potenciales ante competidores con mejor presencia digital.` : `Optimizar ahora supone ventaja competitiva frente a quienes aún no han dado el paso digital.`
  };
}

function calculatePerformanceScore(pageSpeed) {
  const findings = [];
  if (!pageSpeed) {
    return {
      score: 50,
      summary: "No se pudo obtener datos de rendimiento de PageSpeed Insights.",
      findings
    };
  }
  const score = pageSpeed.performanceScore;
  if (typeof pageSpeed.lcp === "number") {
    const lcpSeconds = pageSpeed.lcp / 1e3;
    if (lcpSeconds > 4) {
      findings.push({
        id: "perf-lcp-poor",
        category: "performance",
        severity: "critical",
        title: `LCP muy lento: ${lcpSeconds.toFixed(1)}s (objetivo: <2.5s)`,
        description: `El Largest Contentful Paint tarda ${lcpSeconds.toFixed(1)} segundos. Google considera cualquier valor >4s como "pobre".`,
        commercialImpact: "Un LCP lento significa que el usuario ve la página en blanco varios segundos. Cada segundo de retraso reduce las conversiones entre un 7-20%. Google también penaliza esta métrica en rankings.",
        recommendation: "Optimizar imágenes (WebP, compresión), usar un CDN, implementar preload para recursos críticos y mejorar el tiempo de respuesta del servidor.",
        score: Math.max(0, Math.round(100 - (lcpSeconds - 2.5) * 15))
      });
    } else if (lcpSeconds > 2.5) {
      findings.push({
        id: "perf-lcp-moderate",
        category: "performance",
        severity: "important",
        title: `LCP mejorable: ${lcpSeconds.toFixed(1)}s (objetivo: <2.5s)`,
        description: `El Largest Contentful Paint tarda ${lcpSeconds.toFixed(1)} segundos. Google recomienda menos de 2.5s.`,
        commercialImpact: "Un LCP entre 2.5-4s afecta negativamente la experiencia y el posicionamiento en Google.",
        recommendation: "Optimizar imágenes, usar lazy loading para contenido fuera de pantalla y considerar un CDN.",
        score: Math.round(100 - (lcpSeconds - 2.5) * 10)
      });
    }
  }
  if (typeof pageSpeed.cls === "number") {
    if (pageSpeed.cls > 0.25) {
      findings.push({
        id: "perf-cls-poor",
        category: "performance",
        severity: "critical",
        title: `CLS muy alto: ${pageSpeed.cls.toFixed(3)} (objetivo: <0.1)`,
        description: `El Cumulative Layout Shift es ${pageSpeed.cls.toFixed(3)}. Los elementos de la página saltan visiblemente al cargar.`,
        commercialImpact: "Los saltos visuales provocan clicks accidentales y frustración. Google penaliza directamente el CLS alto en sus rankings y puede hacer que el usuario cierre la página por frustración.",
        recommendation: "Definir dimensiones explícitas para imágenes y vídeos, evitar insertar contenido dinámico arriba del pliegue y usar fuentes con font-display: swap.",
        score: Math.max(0, Math.round(100 - pageSpeed.cls * 250))
      });
    } else if (pageSpeed.cls > 0.1) {
      findings.push({
        id: "perf-cls-moderate",
        category: "performance",
        severity: "important",
        title: `CLS mejorable: ${pageSpeed.cls.toFixed(3)} (objetivo: <0.1)`,
        description: `El Cumulative Layout Shift es ${pageSpeed.cls.toFixed(3)}. Hay cierta inestabilidad visual al cargar.`,
        commercialImpact: "El CLS es uno de los Core Web Vitals que Google usa para posicionamiento. Un valor >0.1 perjudica el ranking.",
        recommendation: "Definir dimensiones en imágenes y elementos dinámicos para evitar reflows al cargar.",
        score: Math.round(100 - pageSpeed.cls * 200)
      });
    }
  }
  if (typeof pageSpeed.tbd === "number") {
    const tbt = pageSpeed.tbd;
    if (tbt > 600) {
      findings.push({
        id: "perf-tbt-poor",
        category: "performance",
        severity: "critical",
        title: `Tiempo de bloqueo muy alto: ${tbt}ms (objetivo: <200ms)`,
        description: `El Total Blocking Time es ${tbt}ms. JavaScript bloqueante impide la interacción del usuario durante ${(tbt / 1e3).toFixed(1)}s.`,
        commercialImpact: "Una página bloqueada parece rota al usuario. Aumenta drásticamente la tasa de abandono, especialmente en móvil.",
        recommendation: "Diferir o fragmentar JavaScript no crítico, eliminar plugins innecesarios y dividir bundles grandes.",
        score: Math.max(0, Math.round(100 - tbt / 600 * 40))
      });
    } else if (tbt > 200) {
      findings.push({
        id: "perf-tbt-moderate",
        category: "performance",
        severity: "important",
        title: `Tiempo de bloqueo elevado: ${tbt}ms (objetivo: <200ms)`,
        description: `El Total Blocking Time es ${tbt}ms. Hay JavaScript que bloquea la interactividad de la página.`,
        commercialImpact: "El TBT alto correlaciona con una mala puntuación de rendimiento en Google, afectando el posicionamiento.",
        recommendation: "Auditar y diferir JavaScript no crítico. Usar code splitting y cargar scripts de terceros de forma asíncrona.",
        score: Math.round(100 - tbt / 600 * 30)
      });
    }
  }
  if (typeof pageSpeed.fcp === "number") {
    const fcpSeconds = pageSpeed.fcp / 1e3;
    if (fcpSeconds > 3) {
      findings.push({
        id: "perf-fcp-poor",
        category: "performance",
        severity: "important",
        title: `Primera pintura lenta: ${fcpSeconds.toFixed(1)}s (objetivo: <1.8s)`,
        description: `El First Contentful Paint tarda ${fcpSeconds.toFixed(1)} segundos. El usuario ve pantalla en blanco durante ese tiempo.`,
        commercialImpact: "Un FCP lento aumenta la tasa de abandono. Los usuarios móviles son especialmente intolerantes a esperas largas.",
        recommendation: "Reducir el tiempo de respuesta del servidor (TTFB), eliminar CSS bloqueante y optimizar el renderizado crítico.",
        score: Math.max(0, Math.round(100 - (fcpSeconds - 1.8) * 20))
      });
    }
  }
  let summary = "El rendimiento es muy bajo. Una carga lenta provoca abandono masivo antes de que el usuario vea la propuesta de valor.";
  if (score >= 90) {
    summary = "El rendimiento es excelente. La velocidad de carga es un punto fuerte de esta web.";
  } else if (score >= 70) {
    summary = "El rendimiento es aceptable pero tiene margen de mejora en métricas Core Web Vitals.";
  } else if (score >= 50) {
    summary = "El rendimiento es deficiente. La velocidad de carga está afectando la experiencia y el posicionamiento en Google.";
  }
  return {
    score,
    summary,
    findings
  };
}
function calculateBrandingScore(uxSignals, metadata) {
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
        category: "branding",
        severity,
        title,
        description,
        commercialImpact,
        recommendation
      });
    }
  };
  check(uxSignals.hasTrustSignals, "brand-trust", 20, 20, "important", "Sin señales de confianza visuales", "No se detectaron testimonios, premios, certificaciones u otros elementos de confianza.", "La ausencia de prueba social reduce la credibilidad percibida y dificulta la decisión de contacto. El 88% de los usuarios confía en las opiniones online tanto como en recomendaciones personales.", "Añadir testimonios reales con foto y nombre, logos de clientes, certificaciones o garantías visibles.");
  check(uxSignals.hasSocialLinks, "brand-social", 12, 12, "recommended", "Sin presencia en redes", "No se detectaron links a redes sociales.", "Una marca sin redes sociales activas parece desactualizada o poco activa, generando desconfianza.", "Mantener y enlazar perfiles sociales activos. La actividad en redes sociales refuerza la credibilidad de marca.");
  check(uxSignals.hasFavicon, "brand-favicon", 5, 5, "recommended", "Sin favicon de marca", "No se detectó favicon en la página.", "El favicon es la primera señal visual de marca que ve el usuario en la pestaña del navegador.", "Añadir un favicon de alta calidad representativo de la marca.");
  check(metadata.hasOpenGraph && Boolean(metadata.ogImage), "brand-og-image", 10, 10, "recommended", "Sin imagen Open Graph", "No se detectó imagen para preview en redes sociales.", "Sin imagen OG, los shares en redes sociales muestran un preview genérico que reduce el CTR y la percepción de marca.", "Añadir og:image con una imagen de marca de calidad (mínimo 1200x630px).");
  check(uxSignals.hasAboutPage || uxSignals.hasTeamInfo, "brand-about", 13, 13, "important", 'Sin página o sección "Sobre nosotros"', "No se detectó información sobre la empresa, su historia o el equipo.", "La transparencia sobre quién está detrás del negocio genera confianza. Los clientes quieren saber con quién trabajan antes de contactar.", 'Añadir sección "Sobre nosotros" con historia, equipo, valores y diferenciadores del negocio.');
  check(uxSignals.hasPortfolio, "brand-portfolio", 10, 10, "recommended", "Sin portfolio o casos de éxito", "No se detectó un portfolio, galería de proyectos o casos de éxito.", "Mostrar trabajos realizados es la forma más efectiva de demostrar competencia. Un portfolio puede aumentar la tasa de contacto significativamente.", "Añadir portfolio con proyectos reales, fotos de trabajos, antes/después o casos de éxito con resultados medibles.");
  if (uxSignals.hasBlogOrNews) {
    maxPoints += 10;
    totalPoints += 10;
  }
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "El branding y las señales de confianza son débiles, lo que puede generar desconfianza en los visitantes.";
  if (score >= 80) {
    summary = "El branding y las señales de confianza son adecuados y refuerzan la credibilidad.";
  } else if (score >= 60) {
    summary = "El branding tiene áreas de mejora importantes para reforzar la confianza y la percepción de marca.";
  } else if (score >= 40) {
    summary = "El branding es débil. Mejorar las señales de confianza puede aumentar significativamente la tasa de conversión.";
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
  if (!metadata.isHttps) {
    addFinding("seo-no-https", 0, 15, "critical", "Sitio web sin HTTPS", 'La web no usa HTTPS. Los navegadores muestran un aviso de "No seguro" a los visitantes.', "Google penaliza las webs sin HTTPS en sus rankings. Además, los visitantes ven una advertencia de seguridad que destruye la confianza y genera abandonos inmediatos.", "Instalar un certificado SSL (gratuito con Let's Encrypt) y redirigir todo el tráfico HTTP a HTTPS.");
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }
  if (!metadata.title) {
    addFinding("seo-title-missing", 0, 15, "critical", "Título de página ausente", "La página no tiene etiqueta <title>.", "Sin título, Google no sabe cómo presentar esta página en resultados de búsqueda. Reduce drásticamente la visibilidad orgánica.", "Añadir un <title> descriptivo y único entre 50-60 caracteres con la keyword principal al inicio.");
  } else if ((metadata.titleLength || 0) < 30) {
    addFinding("seo-title-short", 8, 15, "important", "Título demasiado corto", `El título tiene solo ${metadata.titleLength} caracteres: "${metadata.title}".`, "Un título muy corto no aprovecha el potencial SEO y puede resultar poco informativo en buscadores.", "Ampliar el título a entre 50-60 caracteres incluyendo la keyword principal.");
  } else if ((metadata.titleLength || 0) > 70) {
    addFinding("seo-title-long", 10, 15, "recommended", "Título demasiado largo", `El título tiene ${metadata.titleLength} caracteres (recomendado: 50-60): "${metadata.title?.slice(0, 60)}…".`, "Google recortará el título en los resultados, perdiendo parte del mensaje y del CTR.", "Acortar el título a 50-60 caracteres manteniendo la keyword principal al inicio.");
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }
  if (!metadata.metaDescription) {
    addFinding("seo-meta-missing", 0, 12, "critical", "Meta description ausente", "No hay meta description en la página.", "Sin meta description, Google puede generar automáticamente un fragmento poco atractivo que reduce el CTR en un 5-30%.", "Añadir una meta description persuasiva de 150-160 caracteres con una llamada a la acción clara.");
  } else if ((metadata.metaDescriptionLength || 0) < 80) {
    addFinding("seo-meta-short", 7, 12, "important", "Meta description demasiado corta", `La meta description tiene solo ${metadata.metaDescriptionLength} caracteres.`, "Una descripción corta no aprovecha el espacio disponible para convencer al usuario de hacer clic.", "Ampliar la meta description a 150-160 caracteres con propuesta de valor clara y CTA.");
  } else if ((metadata.metaDescriptionLength || 0) > 165) {
    addFinding("seo-meta-long", 9, 12, "recommended", "Meta description demasiado larga", `La meta description tiene ${metadata.metaDescriptionLength} caracteres (recomendado: 150-160).`, "Google recortará la descripción, cortando posiblemente el mensaje más importante.", "Acortar la meta description a un máximo de 160 caracteres.");
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }
  if (!metadata.hasViewport) {
    addFinding("seo-viewport-missing", 0, 12, "critical", "Meta viewport ausente", "La página no tiene meta viewport configurado.", "Sin viewport, la experiencia móvil es deficiente y puede perjudicar el índice mobile-first de Google.", 'Añadir <meta name="viewport" content="width=device-width, initial-scale=1">.');
  } else {
    maxPoints += 12;
    totalPoints += 12;
  }
  if (metadata.h1Count === 0) {
    addFinding("seo-h1-missing", 0, 10, "critical", "H1 ausente", "La página no tiene ninguna etiqueta H1.", "El H1 es la señal más importante para buscadores sobre el tema de la página. Su ausencia confunde el foco SEO y la jerarquía visual.", "Añadir un H1 claro y descriptivo con la keyword principal de la página.");
  } else if (metadata.h1Count > 1) {
    addFinding("seo-h1-multiple", 7, 10, "important", `Múltiples H1 detectados (${metadata.h1Count})`, `La página tiene ${metadata.h1Count} etiquetas H1, cuando debe tener exactamente 1.`, "Múltiples H1 diluyen la señal SEO y confunden la jerarquía visual para usuarios y buscadores.", "Usar un único H1 con el mensaje principal de la página.");
  } else {
    maxPoints += 10;
    totalPoints += 10;
  }
  if (metadata.h2Count === 0 && (metadata.estimatedWordCount || 0) > 300) {
    addFinding("seo-h2-missing", 0, 6, "recommended", "Sin subtítulos H2", "No se detectaron subtítulos H2 en el contenido de la página.", "La ausencia de subtítulos dificulta la lectura y perjudica el posicionamiento para palabras clave secundarias.", "Estructurar el contenido con H2 descriptivos que incluyan keywords relevantes.");
  } else {
    maxPoints += 6;
    totalPoints += 6;
  }
  if (!metadata.hasOpenGraph) {
    addFinding("seo-og-missing", 0, 8, "important", "Open Graph ausente", "No hay etiquetas Open Graph para redes sociales.", "Sin Open Graph, al compartir la web en LinkedIn, Facebook o WhatsApp el preview es genérico y poco atractivo, reduciendo el CTR social.", "Añadir og:title, og:description, og:image y og:url.");
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }
  if (!metadata.hasTwitterCard) {
    addFinding("seo-twitter-card-missing", 0, 4, "recommended", "Twitter Cards no configuradas", "No se detectaron metaetiquetas de Twitter Cards.", "Sin Twitter Cards, los links compartidos en X/Twitter muestran un preview básico de texto, sin imagen ni descripción atractiva.", "Añadir twitter:card, twitter:title, twitter:description y twitter:image.");
  } else {
    maxPoints += 4;
    totalPoints += 4;
  }
  if (!metadata.hasFavicon) {
    addFinding("seo-favicon-missing", 0, 5, "recommended", "Favicon ausente", "No se detectó favicon en la página.", "El favicon refuerza la identidad visual y la percepción de profesionalidad. Su ausencia resta credibilidad.", "Añadir un favicon representativo de la marca (idealmente en múltiples tamaños).");
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (!metadata.hasCanonical) {
    addFinding("seo-canonical-missing", 0, 6, "important", "URL canónica no definida", "No hay etiqueta canonical en la página.", "Sin canonical, Google puede indexar versiones duplicadas de la misma página (con/sin www, con/sin trailing slash), diluyendo el posicionamiento.", 'Añadir <link rel="canonical" href="URL-absoluta-de-la-página"> en el head.');
  } else {
    maxPoints += 6;
    totalPoints += 6;
  }
  if (metadata.robotsMeta && /noindex/i.test(metadata.robotsMeta)) {
    addFinding("seo-robots-noindex", 0, 15, "critical", "Página marcada como noindex", `La meta robots contiene "noindex": "${metadata.robotsMeta}". Google no indexará esta página.`, "Esta página está completamente excluida de los resultados de búsqueda. Es invisible para cualquier búsqueda orgánica.", 'Eliminar "noindex" del meta robots si se quiere que la página aparezca en buscadores.');
  } else {
    maxPoints += 15;
    totalPoints += 15;
  }
  if (!metadata.langAttribute) {
    addFinding("seo-lang-missing", 0, 5, "recommended", "Atributo lang ausente", "El HTML no especifica el idioma de la página.", "Sin atributo lang, los motores de búsqueda y lectores de pantalla no identifican correctamente el idioma, afectando la accesibilidad y el SEO internacional.", 'Añadir lang="es" (o el idioma correspondiente) al elemento <html>.');
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (!metadata.hasStructuredData) {
    addFinding("seo-structured-data-missing", 0, 8, "important", "Sin datos estructurados (Schema.org)", "No se detectaron datos estructurados JSON-LD en la página.", "Los datos estructurados permiten a Google mostrar rich snippets (reseñas, FAQs, precios, etc.) que aumentan el CTR hasta un 30%.", "Implementar Schema.org relevante: Organization, LocalBusiness, FAQPage, Product o Service según el negocio.");
  } else {
    maxPoints += 8;
    totalPoints += 8;
    if (metadata.structuredDataTypes.length > 0) ;
  }
  if (!metadata.hasSitemap) {
    addFinding("seo-sitemap-missing", 0, 5, "recommended", "Sitemap XML no detectado", "No se encontró un sitemap.xml accesible en la raíz del dominio.", "Sin sitemap, Google puede tardar más en descubrir e indexar todas las páginas del sitio.", "Crear y publicar un sitemap.xml en la raíz del dominio y enviarlo en Google Search Console.");
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (!metadata.hasRobotsTxt) {
    addFinding("seo-robots-txt-missing", 0, 4, "recommended", "Archivo robots.txt no detectado", "No se encontró un archivo robots.txt en la raíz del dominio.", "Sin robots.txt, los motores de búsqueda no tienen instrucciones claras sobre qué rastrear. Puede llevar a indexar páginas no deseadas.", "Crear un archivo robots.txt en la raíz e incluir la URL del sitemap.");
  } else {
    maxPoints += 4;
    totalPoints += 4;
  }
  if (metadata.totalImages > 0) {
    const altRatio = (metadata.totalImages - metadata.imagesWithoutAlt) / metadata.totalImages;
    if (altRatio < 0.5) {
      addFinding("seo-images-no-alt", Math.round(4 * altRatio), 8, "important", `Imágenes sin texto alternativo (${metadata.imagesWithoutAlt} de ${metadata.totalImages})`, `El ${Math.round((1 - altRatio) * 100)}% de las imágenes no tienen atributo alt.`, "Las imágenes sin alt son invisibles para Google Images y perjudican la accesibilidad. Google no puede entender qué muestran.", "Añadir atributos alt descriptivos a todas las imágenes, incluyendo keywords relevantes donde sea natural.");
    } else if (altRatio < 0.9) {
      addFinding("seo-images-no-alt", 6, 8, "recommended", `Algunas imágenes sin texto alternativo (${metadata.imagesWithoutAlt} de ${metadata.totalImages})`, `El ${Math.round((1 - altRatio) * 100)}% de las imágenes no tienen atributo alt.`, "Las imágenes sin alt reducen la accesibilidad y pierden oportunidades de posicionamiento en Google Images.", "Añadir atributos alt descriptivos a todas las imágenes.");
    } else {
      maxPoints += 8;
      totalPoints += 8;
    }
  }
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "El SEO está muy deficiente. La web tiene poca visibilidad orgánica y está perdiendo tráfico gratuito.";
  if (score >= 80) {
    summary = "El SEO básico está bien configurado. La web tiene buena visibilidad en buscadores.";
  } else if (score >= 60) {
    summary = "El SEO presenta algunas carencias importantes que limitan la visibilidad orgánica.";
  } else if (score >= 40) {
    summary = "El SEO tiene problemas significativos que reducen la visibilidad. Se están perdiendo visitas y clientes potenciales.";
  }
  return {
    score,
    findings,
    summary
  };
}

function analyzeUx(metadata, uxSignals, _html) {
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
  check(uxSignals.hasMobileOptimization, "ux-mobile", 15, 15, "critical", "Experiencia móvil deficiente", "La web no parece estar optimizada para dispositivos móviles.", "Más del 60% del tráfico web es móvil. Una mala experiencia móvil significa perder la mayoría de visitantes potenciales y un peor ranking en Google.", "Implementar diseño responsive con viewport meta y layouts adaptados a móvil. Verificar en Google Mobile-Friendly Test.");
  check(uxSignals.hasHeader, "ux-header", 8, 8, "important", "Estructura de header no detectada", "No se detectó un elemento <header> semántico en la página.", "Un header claro y visible es clave para la navegación. Sin él, la experiencia de usuario se fragmenta y dificulta encontrar información.", "Definir un header semántico con logo, navegación principal, datos de contacto y CTA visible.");
  check(uxSignals.hasFooter, "ux-footer", 5, 5, "recommended", "Footer no detectado", "No se detectó un elemento <footer> en la página.", "El footer aporta información de contacto, navegación secundaria, datos legales y señales de confianza cruciales para cerrar la visita.", "Añadir footer con información de contacto, links importantes, aviso legal y datos de la empresa.");
  check(uxSignals.hasCta, "ux-cta", 15, 15, "critical", "CTA principal no detectado", "No se detectaron llamadas a la acción claras en la página.", "Sin CTA, el usuario no sabe qué hacer a continuación y las conversiones caen drásticamente. Es el problema de conversión más directo.", 'Añadir CTAs claros y visibles en posición destacada: "Solicitar presupuesto", "Contactar" o "Empezar ahora".');
  check(uxSignals.hasContactInfo, "ux-contact", 12, 12, "critical", "Información de contacto no detectada", "No se encontraron vías de contacto claras (teléfono, email o formulario).", "Si el usuario no puede contactar fácilmente, simplemente se irá. Esto representa pérdida directa de clientes potenciales.", "Añadir teléfono clickable (tel:), email (mailto:) y/o formulario de contacto bien visible en header y footer.");
  if (uxSignals.hasPhoneNumber) {
    maxPoints += 6;
    totalPoints += 6;
  } else {
    findings.push({
      id: "ux-phone-missing",
      category: "ux",
      severity: "important",
      title: "Número de teléfono no visible",
      description: "No se detectó un número de teléfono clickable en la página.",
      commercialImpact: "Muchos clientes prefieren llamar antes de comprar o contratar. Un teléfono visible y clickable puede aumentar las conversiones en un 15-30%.",
      recommendation: 'Añadir el teléfono en formato clickable <a href="tel:+34XXXXXXXXX"> en el header y en la zona de contacto.',
      score: 0
    });
    maxPoints += 6;
  }
  check(uxSignals.hasSocialLinks, "ux-social", 5, 5, "recommended", "Sin presencia en redes sociales detectada", "No se detectaron enlaces a redes sociales.", "La ausencia de redes sociales puede reducir la percepción de marca activa y confiable.", "Enlazar perfiles activos en las redes sociales relevantes para el negocio (Instagram, LinkedIn, Facebook…).");
  if (uxSignals.estimatedWordCount < 200) {
    findings.push({
      id: "ux-content-thin",
      category: "ux",
      severity: "important",
      title: `Contenido muy escaso (~${uxSignals.estimatedWordCount} palabras)`,
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras. Esto es insuficiente para informar y convencer.`,
      commercialImpact: "Poco contenido significa poca información para el usuario y para los motores de búsqueda. Reduce la confianza y la visibilidad SEO.",
      recommendation: "Desarrollar contenido que explique el valor de la empresa, sus servicios y diferenciales. Mínimo 400-600 palabras con estructura clara.",
      score: 20
    });
    maxPoints += 8;
  } else if (uxSignals.estimatedWordCount < 400) {
    findings.push({
      id: "ux-content-sparse",
      category: "ux",
      severity: "recommended",
      title: `Contenido limitado (~${uxSignals.estimatedWordCount} palabras)`,
      description: `La página tiene aproximadamente ${uxSignals.estimatedWordCount} palabras.`,
      commercialImpact: "Un contenido más rico mejoraría la percepción de la empresa y el posicionamiento SEO.",
      recommendation: "Enriquecer el contenido con más información sobre servicios, beneficios y propuesta de valor. Objetivo: 600+ palabras.",
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
      commercialImpact: "Las páginas sin imágenes son menos atractivas, reducen el tiempo de permanencia y transmiten menos profesionalidad.",
      recommendation: "Añadir imágenes de calidad: foto del equipo, productos/servicios, oficina o gráficos representativos.",
      score: 0
    });
    maxPoints += 6;
  } else {
    maxPoints += 6;
    totalPoints += 6;
    if (uxSignals.imagesCount > 0) {
      const altRatio = uxSignals.imagesWithAltCount / uxSignals.imagesCount;
      if (altRatio < 0.7) {
        findings.push({
          id: "ux-images-no-alt",
          category: "ux",
          severity: "recommended",
          title: `Imágenes sin descripción (${uxSignals.imagesCount - uxSignals.imagesWithAltCount} de ${uxSignals.imagesCount})`,
          description: `El ${Math.round((1 - altRatio) * 100)}% de las imágenes no tienen texto alternativo.`,
          commercialImpact: "Las imágenes sin alt text no son accesibles para personas con discapacidad visual y pierden posicionamiento en Google Images.",
          recommendation: "Añadir atributos alt descriptivos a todas las imágenes.",
          score: Math.round(altRatio * 100)
        });
        maxPoints += 4;
        totalPoints += Math.round(4 * altRatio);
      } else {
        maxPoints += 4;
        totalPoints += 4;
      }
    }
  }
  if (uxSignals.videosCount > 0) {
    maxPoints += 4;
    totalPoints += 4;
  }
  if (!uxSignals.hasAriaLabels && uxSignals.buttonCount > 2) {
    findings.push({
      id: "ux-accessibility",
      category: "ux",
      severity: "recommended",
      title: "Señales de accesibilidad no detectadas",
      description: `Se detectaron ${uxSignals.buttonCount} botones/acciones pero no se encontraron atributos ARIA (aria-label, role, etc.).`,
      commercialImpact: "Una web accesible llega a un 15-20% más de usuarios (personas con discapacidad) y puede tener implicaciones legales en algunos sectores.",
      recommendation: "Añadir atributos ARIA a botones, formularios y elementos interactivos. Verificar con herramientas como Lighthouse Accessibility.",
      score: 0
    });
    maxPoints += 5;
  } else {
    maxPoints += 5;
    totalPoints += 5;
  }
  if (!uxSignals.hasTrustSignals) {
    findings.push({
      id: "ux-no-trust",
      category: "ux",
      severity: "important",
      title: "Sin señales de confianza",
      description: "No se detectaron testimonios, certificaciones, reseñas ni otros elementos de prueba social.",
      commercialImpact: "El 92% de los consumidores lee reseñas antes de comprar. La ausencia de prueba social genera desconfianza y reduce conversiones.",
      recommendation: "Añadir testimonios de clientes reales, casos de éxito, logos de clientes o certificaciones relevantes.",
      score: 0
    });
    maxPoints += 8;
  } else {
    maxPoints += 8;
    totalPoints += 8;
  }
  if (metadata.h1Count === 1 && metadata.h2Count > 0) {
    maxPoints += 5;
    totalPoints += 5;
  } else if (metadata.h1Count === 1 && metadata.h2Count === 0) {
    findings.push({
      id: "ux-heading-structure",
      category: "ux",
      severity: "recommended",
      title: "Estructura de titulares incompleta",
      description: "La página tiene H1 pero no H2. El contenido no tiene una jerarquía visual clara.",
      commercialImpact: "Una buena estructura de titulares mejora la legibilidad, el tiempo de permanencia y el SEO.",
      recommendation: "Organizar el contenido con subtítulos H2 y H3 que guíen al lector y destaquen los puntos clave.",
      score: 50
    });
    maxPoints += 5;
    totalPoints += 2;
  }
  if (uxSignals.hasAboutPage || uxSignals.hasTeamInfo) {
    maxPoints += 4;
    totalPoints += 4;
  } else {
    findings.push({
      id: "ux-no-about",
      category: "ux",
      severity: "recommended",
      title: 'Sin información "Sobre nosotros" o equipo',
      description: "No se detectó información sobre la empresa, su historia o el equipo.",
      commercialImpact: "Los usuarios quieren saber con quién trabajan. La transparencia sobre el equipo y la empresa aumenta la confianza y la tasa de contacto.",
      recommendation: 'Añadir una sección "Sobre nosotros" o "Quiénes somos" con información del equipo, historia y valores.',
      score: 0
    });
    maxPoints += 4;
  }
  const score = maxPoints > 0 ? Math.round(totalPoints / maxPoints * 100) : 0;
  let summary = "La experiencia de usuario es deficiente. Esto impacta directamente en la captación y retención de clientes.";
  if (score >= 80) {
    summary = "La experiencia de usuario es razonablemente buena. Hay oportunidades de optimización puntual.";
  } else if (score >= 60) {
    summary = "La UX presenta oportunidades de mejora notables que afectan a la experiencia y conversión.";
  } else if (score >= 40) {
    summary = "La experiencia de usuario tiene carencias importantes que dificultan la conversión de visitantes en clientes.";
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
function extractSeoMetadata(html, baseUrl) {
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
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const h3Count = (html.match(/<h3[\s>]/gi) || []).length;
  const hasOpenGraph = hasTag(/<meta[^>]*property=["']og:/i);
  const ogTitle = getTag(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogDescription = getTag(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  const ogImage = getTag(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const hasTwitterCard = hasTag(/<meta[^>]*name=["']twitter:card["']/i) || hasTag(/<meta[^>]*name=["']twitter:title["']/i);
  const twitterCard = getTag(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:card["']/i);
  const hasFavicon = hasTag(/<link[^>]*rel=["'][^"']*icon[^"']*["']/i);
  const hasCanonical = hasTag(/<link[^>]*rel=["']canonical["']/i);
  const canonicalUrl = getTag(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || getTag(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const robotsMeta = getTag(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  const hasStructuredData = hasTag(/<script[^>]*type=["']application\/ld\+json["']/i);
  const structuredDataTypes = [];
  if (hasStructuredData) {
    const ldJsonBlocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of ldJsonBlocks) {
      try {
        const jsonContent = block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
        const parsed = JSON.parse(jsonContent);
        const type = parsed["@type"] || "";
        if (type && !structuredDataTypes.includes(type)) {
          structuredDataTypes.push(type);
        }
      } catch {
      }
    }
  }
  const langAttribute = getTag(/<html[^>]*lang=["']([^"']+)["']/i);
  const metaKeywords = getTag(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i) || getTag(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["']/i);
  const isHttps = baseUrl.startsWith("https://");
  const allImgTags = html.match(/<img[^>]*>/gi) || [];
  const totalImages = allImgTags.length;
  const imagesWithoutAlt = allImgTags.filter((img) => !/alt=["'][^"']/i.test(img)).length;
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  try {
    const baseDomain = new URL(baseUrl).hostname;
    const allLinks = html.match(/<a[^>]*href=["']([^"']+)["']/gi) || [];
    for (const link of allLinks) {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) continue;
      const href = hrefMatch[1];
      if (href.startsWith("http://") || href.startsWith("https://")) {
        if (href.includes(baseDomain)) {
          internalLinksCount++;
        } else {
          externalLinksCount++;
        }
      } else if (href.startsWith("/") || href.startsWith("#") || href.startsWith(".")) {
        internalLinksCount++;
      }
    }
  } catch {
  }
  const hasSitemap = false;
  const hasRobotsTxt = false;
  return {
    title,
    titleLength: title?.length,
    metaDescription,
    metaDescriptionLength: metaDescription?.length,
    hasViewport,
    h1: h1 || void 0,
    h1Count,
    h2Count,
    h3Count,
    hasOpenGraph,
    ogTitle,
    ogDescription,
    ogImage,
    hasTwitterCard,
    twitterCard,
    hasFavicon,
    hasCanonical,
    canonicalUrl,
    robotsMeta,
    hasStructuredData,
    structuredDataTypes,
    langAttribute,
    metaKeywords,
    isHttps,
    hasSitemap,
    hasRobotsTxt,
    imagesWithoutAlt,
    totalImages,
    internalLinksCount,
    externalLinksCount
  };
}
function extractUxSignals(html) {
  const lower = html.toLowerCase();
  const hasTag = (pattern) => pattern.test(lower);
  const hasMobileOptimization = hasTag(/<meta[^>]*viewport/i);
  const hasPhoneNumber = hasTag(/<a[^>]*href=["']tel:/i) || /\+?\d[\d\s\-().]{7,}\d/.test(html) || hasTag(/tel\s*:/i);
  const hasEmailAddress = hasTag(/<a[^>]*href=["']mailto:/i) || /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(html);
  const hasContactInfo = hasPhoneNumber || hasEmailAddress || hasTag(/contacto|contact|llámanos|llamanos|whatsapp/i);
  const hasCta = hasTag(/presupuesto|cotizaci[oó]n|quote|demo|prueba\s+gratis|gratis|free\s+trial|empezar|start|cont[áa]ctanos|contact\s+us|llamar|call\s+now|reservar|booking|solicitar|pedir\s+cita|agenda\s+tu/i);
  const hasForm = hasTag(/<form[\s>]/i);
  const hasSocialLinks = hasTag(/facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com|x\.com/i);
  const hasTrustSignals = hasTag(/garant[íi]a|guarantee|certificad|award|premio|review|rese[ñn]a|testimoni|trusted|confianza|ssl|seguro|caso\s+de\s+[eé]xito|casos\s+de\s+[eé]xito|clientes\s+satisfechos|a[ñn]os\s+de\s+experiencia|iso\s*\d|confian\s+en\s+nosotros/i);
  const hasExternalLinks = hasTag(/<a[^>]*href=["']https?:\/\//i);
  const strippedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const estimatedWordCount = strippedHtml ? strippedHtml.split(/\s+/).length : 0;
  const allImgTags = html.match(/<img[^>]*>/gi) || [];
  const imagesCount = allImgTags.length;
  const imagesWithAltCount = allImgTags.filter((img) => /alt=["'][^"']/i.test(img)).length;
  const videosCount = (html.match(/<video[\s>]|youtube\.com\/embed|vimeo\.com\/video|<iframe[^>]*youtube|<iframe[^>]*vimeo/gi) || []).length;
  const navMatches = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi) || [];
  const navigationLinksCount = navMatches.reduce((count, nav) => count + (nav.match(/<a[\s>]/gi) || []).length, 0);
  const hasFooter = hasTag(/<footer[\s>]/i);
  const hasHeader = hasTag(/<header[\s>]/i);
  const hasAriaLabels = hasTag(/aria-label=|aria-labelledby=|aria-describedby=|role=/i);
  const buttonCount = (html.match(/<button[\s>]|<input[^>]*type=["']submit["']/gi) || []).length;
  const hasLiveChat = hasTag(/tawk\.to|intercom|crisp\.chat|livechat|zendesk|hubspot|drift\.com|freshchat|tidio/i);
  const hasPricingInfo = hasTag(/precio|price|tarifa|plan\s+\w|desde\s+\d|€|precio\s+por|paquete|mensual|anual|tarifas|presupuesto\s+desde/i);
  const hasGuarantee = hasTag(/garant[íi]a|garantizamos|devoluci[oó]n|reembolso|satisfaction\s+guaranteed|money\s+back|sin\s+compromiso|riesgo\s+cero/i);
  const hasUrgency = hasTag(/oferta\s+limitada|solo\s+hoy|plazas\s+limitadas|quedan\s+pocos|[úu]ltimas\s+unidades|termina\s+el|expira|ahorra\s+ahora|descuento\s+por\s+tiempo/i);
  const hasNewsletterSignup = hasTag(/newsletter|suscri[bv]|subscribe|bolet[íi]n|recibe\s+(noticias|actualizaciones)|mantente\s+informado/i);
  const hasAboutPage = hasTag(/sobre\s+nosotros|quiénes\s+somos|quienes\s+somos|about\s+us|who\s+we\s+are|nuestra\s+historia|nuestra\s+empresa/i);
  const hasTeamInfo = hasTag(/nuestro\s+equipo|our\s+team|conoce\s+al\s+equipo|el\s+equipo|fundador|ceo|director|experto|especialista/i);
  const hasBlogOrNews = hasTag(/blog|noticias|news|art[íi]culos|publicaciones|novedades|recursos/i);
  const hasPortfolio = hasTag(/portfolio|portafolio|proyectos|trabajos|casos\s+de\s+[eé]xito|clientes|galería|gallery/i);
  return {
    hasMobileOptimization,
    hasContactInfo,
    hasPhoneNumber,
    hasEmailAddress,
    hasCta,
    hasForm,
    hasSocialLinks,
    hasTrustSignals,
    hasExternalLinks,
    estimatedWordCount,
    imagesCount,
    imagesWithAltCount,
    videosCount,
    navigationLinksCount,
    hasFooter,
    hasHeader,
    hasAriaLabels,
    buttonCount,
    hasLiveChat,
    hasPricingInfo,
    hasGuarantee,
    hasUrgency,
    hasNewsletterSignup,
    hasAboutPage,
    hasTeamInfo,
    hasBlogOrNews,
    hasPortfolio
  };
}

function statusFromScore(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "competitive";
  if (score >= 40) return "improvable";
  return "critical";
}
async function checkUrlExists(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(8e3)
    });
    return response.ok;
  } catch {
    return false;
  }
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
  const seoMetadata = extractSeoMetadata(html, url);
  const uxSignals = extractUxSignals(html);
  const origin = new URL(url).origin;
  const [pagespeedSettled, sitemapExists, robotsExists] = await Promise.all([Promise.allSettled([fetchPageSpeedData(url, "mobile"), fetchPageSpeedData(url, "desktop")]), checkUrlExists(`${origin}/sitemap.xml`), checkUrlExists(`${origin}/robots.txt`)]);
  seoMetadata.hasSitemap = sitemapExists;
  seoMetadata.hasRobotsTxt = robotsExists;
  const pageSpeedMobile = pagespeedSettled[0].status === "fulfilled" ? pagespeedSettled[0].value : null;
  const pageSpeedDesktop = pagespeedSettled[1].status === "fulfilled" ? pagespeedSettled[1].value : null;
  const seoAnalysis = analyzeSeo(seoMetadata);
  const uxAnalysis = analyzeUx(seoMetadata, uxSignals);
  const conversionAnalysis = analyzeConversion(seoMetadata, uxSignals);
  const performanceAnalysis = calculatePerformanceScore(pageSpeedMobile || void 0);
  const brandingAnalysis = calculateBrandingScore({
    hasSocialLinks: uxSignals.hasSocialLinks,
    hasTrustSignals: uxSignals.hasTrustSignals,
    hasFavicon: seoMetadata.hasFavicon,
    hasAboutPage: uxSignals.hasAboutPage,
    hasTeamInfo: uxSignals.hasTeamInfo,
    hasBlogOrNews: uxSignals.hasBlogOrNews,
    hasPortfolio: uxSignals.hasPortfolio
  }, {
    title: seoMetadata.title,
    ogImage: seoMetadata.ogImage,
    hasOpenGraph: seoMetadata.hasOpenGraph,
    hasStructuredData: seoMetadata.hasStructuredData
  });
  const allFindings = [...seoAnalysis.findings, ...uxAnalysis.findings, ...conversionAnalysis.findings, ...brandingAnalysis.findings, ...performanceAnalysis.findings];
  if (pageSpeedMobile && pageSpeedMobile.performanceScore < 70) {
    allFindings.push({
      id: "perf-low-score",
      category: "performance",
      severity: pageSpeedMobile.performanceScore < 50 ? "critical" : "important",
      title: `Rendimiento móvil bajo: ${pageSpeedMobile.performanceScore}/100`,
      description: `PageSpeed Insights puntúa el rendimiento móvil con ${pageSpeedMobile.performanceScore}/100.`,
      commercialImpact: "Una carga lenta provoca que los usuarios abandonen antes de ver el contenido. Google usa esta métrica para posicionamiento. Impacta directamente en conversiones y ranking.",
      recommendation: "Optimizar imágenes (WebP, compresión), implementar lazy loading, reducir JavaScript bloqueante, usar un CDN y mejorar el tiempo de respuesta del servidor.",
      score: pageSpeedMobile.performanceScore
    });
  }
  if (pageSpeedMobile && pageSpeedDesktop) {
    const gap = pageSpeedDesktop.performanceScore - pageSpeedMobile.performanceScore;
    if (gap > 30) {
      allFindings.push({
        id: "perf-mobile-desktop-gap",
        category: "performance",
        severity: "important",
        title: `Gran diferencia móvil vs escritorio (${pageSpeedMobile.performanceScore} vs ${pageSpeedDesktop.performanceScore})`,
        description: `Hay una diferencia de ${gap} puntos entre el rendimiento móvil (${pageSpeedMobile.performanceScore}) y el de escritorio (${pageSpeedDesktop.performanceScore}).`,
        commercialImpact: "La mayoría del tráfico es móvil. Si la versión móvil rinde mucho peor, se está perdiendo la mayor parte de los visitantes potenciales.",
        recommendation: "Priorizar la optimización móvil: imágenes responsive, reducción de JavaScript no esencial y mejora del tiempo de respuesta del servidor.",
        score: pageSpeedMobile.performanceScore
      });
    }
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
  const performanceFindings = allFindings.filter((finding) => finding.category === "performance");
  const categoryScores = {
    performance: {
      category: "performance",
      label: "Rendimiento",
      score: performanceAnalysis.score,
      status: statusFromScore(performanceAnalysis.score),
      summary: performanceAnalysis.summary,
      findings: performanceFindings
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
    globalStatus,
    categoryScores,
    pageSpeedMobile: pageSpeedMobile || void 0,
    findings: allFindings
  });
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
