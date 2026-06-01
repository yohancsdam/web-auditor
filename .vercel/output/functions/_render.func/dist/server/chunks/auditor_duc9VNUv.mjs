import { c as createComponent } from './astro-component_CihPcvzb.mjs';
import 'piccolore';
import { o as renderHead, p as renderComponent, k as renderTemplate } from './entrypoint_D5hNBjf1.mjs';
import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { jsxs, jsx } from 'preact/jsx-runtime';
/* empty css                 */

const statusClasses$1 = {
  strong: "text-green-300 bg-green-500/10 border-green-400/20",
  competitive: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
  improvable: "text-amber-300 bg-amber-500/10 border-amber-400/20",
  critical: "text-red-300 bg-red-500/10 border-red-400/20"
};
function getBar(score) {
  if (score >= 80) return "from-green-400 to-emerald-500";
  if (score >= 60) return "from-emerald-400 to-cyan-500";
  if (score >= 40) return "from-amber-400 to-orange-500";
  return "from-red-400 to-rose-500";
}
function CategoryScoreCard({
  category,
  onSelect,
  active = false
}) {
  return jsxs("button", {
    type: "button",
    onClick: onSelect,
    class: `group flex h-full flex-col rounded-3xl border p-5 text-left transition duration-200 ${active ? "border-indigo-400/70 bg-slate-800/90 shadow-xl shadow-indigo-950/50" : "border-white/10 bg-slate-900/70 hover:border-white/20 hover:bg-slate-800/90"}`,
    children: [jsxs("div", {
      class: "flex items-start justify-between gap-3",
      children: [jsxs("div", {
        children: [jsx("p", {
          class: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
          children: "Categoría"
        }), jsx("h3", {
          class: "mt-2 text-xl font-semibold text-white",
          children: category.label
        })]
      }), jsx("span", {
        class: `rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses$1[category.status]}`,
        children: category.status
      })]
    }), jsxs("div", {
      class: "mt-6 flex items-end justify-between gap-4",
      children: [jsxs("div", {
        children: [jsx("p", {
          class: "text-sm text-slate-400",
          children: "Score"
        }), jsx("div", {
          class: "text-4xl font-black text-white",
          children: category.score
        })]
      }), jsxs("p", {
        class: "max-w-[9rem] text-right text-xs text-slate-500",
        children: [category.findings.length, " hallazgos priorizados"]
      })]
    }), jsx("div", {
      class: "mt-4 h-2 overflow-hidden rounded-full bg-slate-700/70",
      children: jsx("div", {
        class: `h-full rounded-full bg-gradient-to-r ${getBar(category.score)} transition-all duration-500`,
        style: {
          width: `${Math.max(category.score, 8)}%`
        }
      })
    }), jsx("p", {
      class: "mt-4 text-sm leading-6 text-slate-300",
      children: category.summary
    }), jsxs("div", {
      class: "mt-6 flex items-center gap-2 text-sm font-medium text-indigo-300",
      children: [jsx("span", {
        children: "Ver detalle"
      }), jsx("span", {
        class: "transition group-hover:translate-x-1",
        children: "→"
      })]
    })]
  });
}

const severityStyles = {
  critical: "border-red-400/30 bg-red-500/10 text-red-200",
  important: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  recommended: "border-blue-400/30 bg-blue-500/10 text-blue-200",
  info: "border-slate-400/20 bg-slate-500/10 text-slate-200"
};
function FindingsList({
  findings,
  recommendations = [],
  title,
  emptyLabel = "No se han detectado hallazgos en esta sección."
}) {
  if (findings.length === 0) {
    return jsxs("section", {
      class: "rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-emerald-100",
      children: [title ? jsx("h3", {
        class: "text-lg font-semibold",
        children: title
      }) : null, jsx("p", {
        class: title ? "mt-2 text-sm leading-6" : "text-sm leading-6",
        children: emptyLabel
      })]
    });
  }
  return jsxs("section", {
    class: "space-y-4",
    children: [title ? jsx("h3", {
      class: "text-2xl font-semibold text-white",
      children: title
    }) : null, findings.map((finding) => {
      const related = recommendations.find((item) => item.id === `rec-${finding.id}`);
      return jsxs("article", {
        class: "rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30",
        children: [jsxs("div", {
          class: "flex flex-wrap items-start justify-between gap-3",
          children: [jsxs("div", {
            children: [jsx("div", {
              class: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${severityStyles[finding.severity]}`,
              children: finding.severity
            }), jsx("h4", {
              class: "mt-4 text-xl font-semibold text-white",
              children: finding.title
            })]
          }), typeof finding.score === "number" ? jsxs("div", {
            class: "rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-center",
            children: [jsx("div", {
              class: "text-xs uppercase tracking-[0.18em] text-slate-500",
              children: "score"
            }), jsx("div", {
              class: "mt-1 text-2xl font-black text-white",
              children: finding.score
            })]
          }) : null]
        }), jsxs("div", {
          class: "mt-5 grid gap-4 lg:grid-cols-3",
          children: [jsxs("div", {
            class: "rounded-2xl border border-white/8 bg-slate-950/50 p-4",
            children: [jsx("p", {
              class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
              children: "Diagnóstico"
            }), jsx("p", {
              class: "mt-2 text-sm leading-6 text-slate-300",
              children: finding.description
            })]
          }), jsxs("div", {
            class: "rounded-2xl border border-amber-400/15 bg-amber-500/8 p-4",
            children: [jsx("p", {
              class: "text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80",
              children: "Impacto comercial"
            }), jsx("p", {
              class: "mt-2 text-sm leading-6 text-amber-50/90",
              children: finding.commercialImpact
            })]
          }), jsxs("div", {
            class: "rounded-2xl border border-indigo-400/15 bg-indigo-500/8 p-4",
            children: [jsx("p", {
              class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80",
              children: "Recomendación"
            }), jsx("p", {
              class: "mt-2 text-sm leading-6 text-indigo-50/90",
              children: related?.action || finding.recommendation
            })]
          })]
        })]
      }, finding.id);
    })]
  });
}

function getScoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}
function ScoreGauge({
  score,
  size = 184,
  label = "Score global",
  subtitle
}) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset = circumference - progress / 100 * circumference;
  const color = getScoreColor(progress);
  return jsxs("div", {
    class: "relative flex flex-col items-center justify-center gap-4",
    children: [jsxs("div", {
      class: "relative",
      style: {
        width: `${size}px`,
        height: `${size}px`
      },
      children: [jsxs("svg", {
        viewBox: `0 0 ${size} ${size}`,
        class: "h-full w-full -rotate-90",
        children: [jsx("circle", {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: "rgba(148,163,184,0.15)",
          "stroke-width": stroke
        }), jsx("circle", {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: color,
          "stroke-linecap": "round",
          "stroke-width": stroke,
          "stroke-dasharray": circumference,
          "stroke-dashoffset": offset
        })]
      }), jsxs("div", {
        class: "absolute inset-0 flex flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950/80 shadow-2xl shadow-indigo-950/50 backdrop-blur-sm",
        children: [jsx("span", {
          class: "text-xs font-semibold uppercase tracking-[0.28em] text-slate-400",
          children: label
        }), jsx("span", {
          class: "mt-2 text-5xl font-black text-white",
          children: progress
        }), jsx("span", {
          class: "text-sm text-slate-400",
          children: "sobre 100"
        })]
      })]
    }), subtitle ? jsx("p", {
      class: "max-w-xs text-center text-sm text-slate-400",
      children: subtitle
    }) : null]
  });
}

function AuditResults({
  result,
  activeTab,
  onSelectTab
}) {
  return jsxs("div", {
    class: "space-y-8",
    children: [jsxs("div", {
      class: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
      children: [jsx("div", {
        class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
        children: jsx(ScoreGauge, {
          score: result.globalScore,
          subtitle: result.executiveSummary
        })
      }), jsx("div", {
        class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
        children: Object.values(result.categoryScores).map((category) => jsx(CategoryScoreCard, {
          category,
          active: activeTab === category.category,
          onSelect: () => onSelectTab(category.category)
        }, category.category))
      })]
    }), jsx(FindingsList, {
      findings: activeTab === "overview" ? result.findings.slice(0, 5) : result.categoryScores[activeTab]?.findings || [],
      recommendations: result.recommendations
    })]
  });
}

function AuditorForm({
  url,
  onUrlChange,
  onSubmit,
  loading = false
}) {
  return jsxs("div", {
    class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
    children: [jsxs("div", {
      class: "max-w-3xl",
      children: [jsx("p", {
        class: "text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300",
        children: "Análisis instantáneo"
      }), jsx("h2", {
        class: "mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl",
        children: "Introduce una URL y genera un diagnóstico comercial completo"
      }), jsx("p", {
        class: "mt-4 text-base leading-7 text-slate-300",
        children: "Analizamos velocidad, SEO, UX, conversión y branding para detectar si la web necesita optimización o un rediseño completo."
      })]
    }), jsxs("div", {
      class: "mt-8 flex flex-col gap-4 lg:flex-row",
      children: [jsxs("label", {
        class: "flex-1",
        children: [jsx("span", {
          class: "sr-only",
          children: "URL a analizar"
        }), jsx("input", {
          type: "url",
          value: url,
          onInput: (event) => onUrlChange(event.currentTarget.value),
          placeholder: "Ejemplo: negocio.com o https://negocio.com",
          class: "h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-400"
        })]
      }), jsx("button", {
        type: "button",
        onClick: onSubmit,
        disabled: loading,
        class: "inline-flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60",
        children: loading ? "Analizando…" : "Analizar sitio web"
      })]
    }), jsxs("div", {
      class: "mt-4 flex flex-wrap gap-3 text-sm text-slate-400",
      children: [jsx("span", {
        class: "rounded-full border border-white/10 px-3 py-1",
        children: "Sin CORS: auditoría server-side"
      }), jsx("span", {
        class: "rounded-full border border-white/10 px-3 py-1",
        children: "PageSpeed móvil + escritorio"
      }), jsx("span", {
        class: "rounded-full border border-white/10 px-3 py-1",
        children: "Resultados listos para presentar"
      })]
    })]
  });
}

function statusLabel(status) {
  switch (status) {
    case "critical":
      return "Crítico";
    case "improvable":
      return "Mejorable";
    case "competitive":
      return "Competitivo";
    case "strong":
      return "Fuerte";
  }
}
function ProposalView({
  result
}) {
  const proposal = result.proposalNarrative;
  return jsxs("section", {
    class: "rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/30 sm:p-8 lg:p-10 print:shadow-none",
    children: [jsxs("div", {
      class: "flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between",
      children: [jsxs("div", {
        children: [jsx("div", {
          class: "inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700",
          children: "Propuesta comercial · Web Auditor"
        }), jsx("h2", {
          class: "mt-5 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl",
          children: proposal.headline
        }), jsx("p", {
          class: "mt-4 max-w-3xl text-base leading-7 text-slate-600",
          children: proposal.openingStatement
        })]
      }), jsx("button", {
        type: "button",
        onClick: () => window.print(),
        class: "inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 print:hidden",
        children: "Imprimir propuesta"
      })]
    }), jsxs("div", {
      class: "mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
      children: [jsxs("div", {
        class: "space-y-5",
        children: [jsxs("div", {
          class: "rounded-3xl border border-slate-200 bg-slate-50 p-6",
          children: [jsx("p", {
            class: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
            children: "Diagnóstico"
          }), jsx("p", {
            class: "mt-3 text-lg font-semibold text-slate-950",
            children: proposal.diagnosisSummary
          }), jsx("p", {
            class: "mt-3 text-sm leading-7 text-slate-600",
            children: result.executiveSummary
          })]
        }), jsxs("div", {
          class: "rounded-3xl border border-slate-200 p-6",
          children: [jsx("p", {
            class: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
            children: "Problemas clave"
          }), jsx("div", {
            class: "mt-5 space-y-4",
            children: proposal.keyProblems.length > 0 ? proposal.keyProblems.map((problem) => jsxs("div", {
              class: "rounded-2xl border border-rose-200 bg-rose-50 p-5",
              children: [jsx("div", {
                class: "text-xs font-semibold uppercase tracking-[0.18em] text-rose-600",
                children: problem.area
              }), jsx("h3", {
                class: "mt-2 text-lg font-semibold text-slate-950",
                children: problem.problem
              }), jsx("p", {
                class: "mt-2 text-sm leading-6 text-slate-700",
                children: problem.impact
              }), jsxs("p", {
                class: "mt-3 text-sm font-medium text-indigo-700",
                children: ["Solución sugerida: ", problem.solution]
              })]
            }, `${problem.area}-${problem.problem}`)) : jsx("div", {
              class: "rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-slate-700",
              children: "No se han detectado problemas críticos. La oportunidad está en optimizar y reforzar la ventaja competitiva."
            })
          })]
        })]
      }), jsxs("div", {
        class: "space-y-5",
        children: [jsxs("div", {
          class: "rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white",
          children: [jsx("p", {
            class: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-400",
            children: "Resumen ejecutivo"
          }), jsxs("div", {
            class: "mt-4 flex items-end justify-between gap-4",
            children: [jsxs("div", {
              children: [jsx("div", {
                class: "text-sm text-slate-400",
                children: "Estado actual"
              }), jsx("div", {
                class: "mt-1 text-2xl font-black",
                children: statusLabel(result.globalStatus)
              })]
            }), jsxs("div", {
              class: "text-right",
              children: [jsx("div", {
                class: "text-sm text-slate-400",
                children: "Score global"
              }), jsx("div", {
                class: "mt-1 text-5xl font-black text-indigo-300",
                children: result.globalScore
              })]
            })]
          }), jsx("p", {
            class: "mt-4 text-sm leading-7 text-slate-300",
            children: result.redesignOpportunity
          })]
        }), jsxs("div", {
          class: "rounded-3xl border border-slate-200 p-6",
          children: [jsx("p", {
            class: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
            children: "Solución propuesta"
          }), jsx("p", {
            class: "mt-4 text-sm leading-7 text-slate-700",
            children: proposal.proposedSolution
          }), jsx("ul", {
            class: "mt-5 space-y-3 text-sm leading-6 text-slate-700",
            children: proposal.expectedBenefits.map((benefit) => jsxs("li", {
              class: "flex gap-3",
              children: [jsx("span", {
                class: "mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700",
                children: "✓"
              }), jsx("span", {
                children: benefit
              })]
            }, benefit))
          })]
        }), jsxs("div", {
          class: "rounded-3xl border border-indigo-200 bg-indigo-50 p-6",
          children: [jsx("p", {
            class: "text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700",
            children: "Siguiente paso recomendado"
          }), jsx("p", {
            class: "mt-4 text-sm leading-7 text-slate-700",
            children: proposal.callToAction
          }), jsx("div", {
            class: "mt-5 rounded-2xl bg-white p-4 text-sm font-medium text-slate-800 shadow-sm",
            children: proposal.urgencyNote
          })]
        })]
      })]
    })]
  });
}

const loadingMessages = ["Conectando con la web objetivo…", "Extrayendo metadatos SEO y estructura principal…", "Comprobando rendimiento con PageSpeed Insights…", "Evaluando señales de UX, conversión y branding…", "Redactando diagnóstico y propuesta comercial…"];
const tabConfig = [{
  key: "overview",
  label: "Resumen"
}, {
  key: "seo",
  label: "SEO"
}, {
  key: "ux",
  label: "UX"
}, {
  key: "conversion",
  label: "Conversión"
}, {
  key: "performance",
  label: "Rendimiento"
}, {
  key: "branding",
  label: "Branding"
}, {
  key: "proposal",
  label: "Propuesta"
}];
const statusLabels = {
  critical: "Crítico",
  improvable: "Mejorable",
  competitive: "Competitivo",
  strong: "Fuerte"
};
const statusClasses = {
  critical: "border-red-400/30 bg-red-500/10 text-red-200",
  improvable: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  competitive: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  strong: "border-green-400/30 bg-green-500/10 text-green-100"
};
const businessSignalLabels = ["CTA visible", "Contacto visible", "Formulario", "Redes sociales", "Prueba social", "Header", "Footer"];
function formatMetric(value, type = "ms") {
  if (typeof value !== "number") return "N/D";
  if (type === "cls") return value.toFixed(2);
  if (type === "score") return `${value}/100`;
  return `${Math.round(value)} ms`;
}
function getCategoryFindings(result, tab) {
  if (tab === "overview" || tab === "proposal") return result.findings;
  return result.categoryScores[tab].findings;
}
function MetricCard({
  label,
  value,
  hint
}) {
  return jsxs("div", {
    class: "rounded-2xl border border-white/10 bg-slate-950/60 p-4",
    children: [jsx("div", {
      class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
      children: label
    }), jsx("div", {
      class: "mt-3 text-2xl font-black text-white",
      children: value
    }), jsx("p", {
      class: "mt-2 text-sm leading-6 text-slate-400",
      children: hint
    })]
  });
}
function EmptyState() {
  return jsxs("div", {
    class: "rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl",
    children: [jsx("div", {
      class: "mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-4xl text-indigo-300",
      children: "◎"
    }), jsx("h3", {
      class: "mt-6 text-2xl font-bold text-white",
      children: "Empieza con una URL"
    }), jsx("p", {
      class: "mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300",
      children: "El auditor analizará velocidad, señales SEO, experiencia de usuario, capacidad de conversión y elementos de confianza para detectar si el sitio necesita una optimización puntual o un rediseño de alto impacto."
    }), jsxs("div", {
      class: "mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400",
      children: [jsx("span", {
        class: "rounded-full border border-white/10 px-4 py-2",
        children: "Diagnóstico técnico"
      }), jsx("span", {
        class: "rounded-full border border-white/10 px-4 py-2",
        children: "Lectura comercial"
      }), jsx("span", {
        class: "rounded-full border border-white/10 px-4 py-2",
        children: "Propuesta lista para presentar"
      })]
    })]
  });
}
function LoadingState({
  step
}) {
  return jsxs("div", {
    class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl",
    children: [jsxs("div", {
      class: "flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between",
      children: [jsxs("div", {
        class: "max-w-xl",
        children: [jsxs("div", {
          class: "inline-flex items-center gap-3 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200",
          children: [jsx("span", {
            class: "inline-flex h-3 w-3 animate-pulse rounded-full bg-indigo-300"
          }), "Auditoría en progreso"]
        }), jsx("h3", {
          class: "mt-5 text-3xl font-black tracking-tight text-white",
          children: "Analizando la web y construyendo un diagnóstico comercial"
        }), jsx("p", {
          class: "mt-4 text-base leading-7 text-slate-300",
          children: "Estamos ejecutando la auditoría en el servidor para evitar limitaciones CORS, consultar PageSpeed Insights y extraer señales de negocio directamente del HTML."
        })]
      }), jsx("div", {
        class: "flex justify-center",
        children: jsxs("div", {
          class: "relative flex h-40 w-40 items-center justify-center rounded-full border border-indigo-400/20 bg-slate-950/70",
          children: [jsx("div", {
            class: "absolute inset-3 animate-spin rounded-full border-4 border-indigo-400/20 border-t-indigo-400"
          }), jsxs("div", {
            class: "text-center",
            children: [jsx("div", {
              class: "text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
              children: "Paso"
            }), jsx("div", {
              class: "mt-2 text-5xl font-black text-white",
              children: step + 1
            }), jsxs("div", {
              class: "text-sm text-slate-400",
              children: ["de ", loadingMessages.length]
            })]
          })]
        })
      })]
    }), jsx("div", {
      class: "mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-5",
      children: loadingMessages.map((message, index) => {
        const completed = index < step;
        const active = index === step;
        return jsxs("div", {
          class: `rounded-2xl border px-4 py-4 text-sm transition ${active ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-100" : completed ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100" : "border-white/8 bg-slate-950/50 text-slate-500"}`,
          children: [jsxs("div", {
            class: "text-xs font-semibold uppercase tracking-[0.18em]",
            children: ["Paso ", index + 1]
          }), jsx("div", {
            class: "mt-2 leading-6",
            children: message
          })]
        }, message);
      })
    })]
  });
}
function PerformanceSnapshot({
  data,
  title
}) {
  return jsxs("section", {
    class: "rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20",
    children: [jsxs("div", {
      class: "flex flex-wrap items-start justify-between gap-4",
      children: [jsxs("div", {
        children: [jsx("p", {
          class: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
          children: title
        }), jsx("h3", {
          class: "mt-3 text-2xl font-semibold text-white",
          children: data ? `Score ${data.performanceScore}/100` : "No disponible"
        }), jsx("p", {
          class: "mt-2 max-w-2xl text-sm leading-6 text-slate-400",
          children: "Datos obtenidos desde Google PageSpeed Insights. Útiles para argumentar mejoras de carga, estabilidad y tiempo hasta interacción."
        })]
      }), jsx("div", {
        class: `rounded-full px-4 py-2 text-sm font-semibold ${data ? data.performanceScore >= 80 ? "bg-green-500/10 text-green-200" : data.performanceScore >= 50 ? "bg-amber-500/10 text-amber-100" : "bg-red-500/10 text-red-200" : "bg-slate-500/10 text-slate-300"}`,
        children: data ? "Datos válidos" : "Sin respuesta"
      })]
    }), jsxs("div", {
      class: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
      children: [jsx(MetricCard, {
        label: "FCP",
        value: formatMetric(data?.fcp),
        hint: "Primer contenido visible."
      }), jsx(MetricCard, {
        label: "LCP",
        value: formatMetric(data?.lcp),
        hint: "Momento en el que el contenido principal termina de cargar."
      }), jsx(MetricCard, {
        label: "CLS",
        value: formatMetric(data?.cls, "cls"),
        hint: "Estabilidad visual durante la carga."
      }), jsx(MetricCard, {
        label: "TBT",
        value: formatMetric(data?.tbd),
        hint: "Tiempo total bloqueado por tareas pesadas."
      }), jsx(MetricCard, {
        label: "Speed Index",
        value: formatMetric(data?.si),
        hint: "Velocidad de aparición del contenido visible."
      }), jsx(MetricCard, {
        label: "TTI",
        value: formatMetric(data?.tti),
        hint: "Tiempo hasta poder interactuar con la página."
      })]
    })]
  });
}
function AuditorApp() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (state !== "loading") return;
    const interval = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % loadingMessages.length);
    }, 1400);
    return () => window.clearInterval(interval);
  }, [state]);
  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  const handleAudit = useCallback(async () => {
    if (!url.trim()) {
      setErrorMsg("Introduce una URL para iniciar la auditoría.");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg("");
    setResult(null);
    setActiveTab("overview");
    setLoadingStep(0);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al analizar la web");
      }
      setResult(data);
      setState("results");
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Error inesperado");
      setState("error");
    }
  }, [url]);
  const tabSummary = useMemo(() => {
    if (!result || activeTab === "overview" || activeTab === "proposal") return null;
    return result.categoryScores[activeTab];
  }, [activeTab, result]);
  const activeFindings = useMemo(() => {
    if (!result) return [];
    if (activeTab === "overview") {
      return result.findings.slice(0, 8);
    }
    if (activeTab === "proposal") {
      return result.findings.slice(0, 5);
    }
    return getCategoryFindings(result, activeTab);
  }, [activeTab, result]);
  const copyShareLink = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [result]);
  return jsxs("div", {
    class: "space-y-8",
    children: [jsxs("section", {
      class: "relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8 lg:p-10",
      children: [jsx("div", {
        class: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_30%)]"
      }), jsxs("div", {
        class: "relative",
        children: [jsxs("div", {
          class: "flex flex-wrap items-center gap-3 text-sm text-slate-400",
          children: [jsx("span", {
            class: "rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-indigo-200",
            children: "Web Auditor V1"
          }), jsx("span", {
            class: "rounded-full border border-white/10 px-3 py-1",
            children: "Astro SSR + Preact islands"
          }), jsx("span", {
            class: "rounded-full border border-white/10 px-3 py-1",
            children: "Diagnóstico técnico + comercial"
          })]
        }), jsxs("div", {
          class: "mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end",
          children: [jsxs("div", {
            children: [jsx("h1", {
              class: "max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl",
              children: "Detecta si una web está perdiendo negocio y genera una propuesta lista para vender."
            }), jsx("p", {
              class: "mt-6 max-w-3xl text-lg leading-8 text-slate-300",
              children: "Introduce una URL y obtén un informe premium con scores por categoría, hallazgos priorizados, quick wins y una narrativa comercial orientada a rediseño u optimización."
            })]
          }), jsxs("div", {
            class: "grid gap-4 sm:grid-cols-2",
            children: [jsxs("div", {
              class: "rounded-3xl border border-white/10 bg-white/5 p-5",
              children: [jsx("div", {
                class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
                children: "Qué cubre"
              }), jsx("div", {
                class: "mt-3 text-lg font-semibold text-white",
                children: "Rendimiento, SEO, UX, conversión y branding"
              })]
            }), jsxs("div", {
              class: "rounded-3xl border border-white/10 bg-white/5 p-5",
              children: [jsx("div", {
                class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
                children: "Output"
              }), jsx("div", {
                class: "mt-3 text-lg font-semibold text-white",
                children: "Diagnóstico + propuesta comercial imprimible"
              })]
            })]
          })]
        })]
      })]
    }), jsx(AuditorForm, {
      url,
      onUrlChange: setUrl,
      onSubmit: handleAudit,
      loading: state === "loading"
    }), state === "idle" ? jsx(EmptyState, {}) : null, state === "loading" ? jsx(LoadingState, {
      step: loadingStep
    }) : null, state === "error" ? jsxs("div", {
      class: "rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6 text-red-100 shadow-2xl shadow-black/20 backdrop-blur-xl",
      children: [jsx("div", {
        class: "text-sm font-semibold uppercase tracking-[0.2em] text-red-200",
        children: "No se pudo completar la auditoría"
      }), jsx("p", {
        class: "mt-3 text-base leading-7",
        children: errorMsg
      }), jsx("button", {
        type: "button",
        onClick: () => {
          setState("idle");
          setErrorMsg("");
        },
        class: "mt-5 rounded-full border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10",
        children: "Volver a intentarlo"
      })]
    }) : null, state === "results" && result ? jsxs("div", {
      class: "space-y-8",
      children: [jsx("section", {
        class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
        children: jsxs("div", {
          class: "flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between",
          children: [jsxs("div", {
            class: "max-w-3xl",
            children: [jsxs("div", {
              class: "flex flex-wrap items-center gap-3",
              children: [jsxs("span", {
                class: `rounded-full border px-4 py-2 text-sm font-semibold ${statusClasses[result.globalStatus]}`,
                children: ["Estado ", statusLabels[result.globalStatus]]
              }), jsx("span", {
                class: "rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300",
                children: new URL(result.url).hostname
              }), jsxs("span", {
                class: "rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300",
                children: ["Analizado el ", new Date(result.analyzedAt).toLocaleString("es-ES")]
              })]
            }), jsx("h2", {
              class: "mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl",
              children: result.proposalNarrative.headline
            }), jsx("p", {
              class: "mt-4 max-w-3xl text-base leading-7 text-slate-300",
              children: result.executiveSummary
            }), jsxs("div", {
              class: "mt-6 flex flex-wrap gap-3",
              children: [jsx("button", {
                type: "button",
                onClick: () => setActiveTab("proposal"),
                class: "rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200",
                children: "Ver propuesta premium"
              }), jsx("button", {
                type: "button",
                onClick: copyShareLink,
                class: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5",
                children: copied ? "URL copiada" : "Copiar URL auditada"
              })]
            })]
          }), jsx("div", {
            class: "flex justify-center",
            children: jsx(ScoreGauge, {
              score: result.globalScore,
              subtitle: result.redesignOpportunity
            })
          })]
        })
      }), jsx("section", {
        class: "grid gap-5 lg:grid-cols-2 xl:grid-cols-5",
        children: Object.values(result.categoryScores).map((category) => jsx(CategoryScoreCard, {
          category,
          active: activeTab === category.category,
          onSelect: () => setActiveTab(category.category)
        }, category.category))
      }), jsx("section", {
        class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5",
        children: jsx("div", {
          class: "flex flex-wrap gap-3",
          children: tabConfig.map((tab) => jsx("button", {
            type: "button",
            onClick: () => setActiveTab(tab.key),
            class: `rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/40" : "border border-white/10 bg-slate-950/70 text-slate-300 hover:bg-slate-800"}`,
            children: tab.label
          }, tab.key))
        })
      }), activeTab === "overview" ? jsxs("div", {
        class: "grid gap-8 xl:grid-cols-[1.15fr_0.85fr]",
        children: [jsxs("div", {
          class: "space-y-8",
          children: [jsxs("section", {
            class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
            children: [jsxs("div", {
              class: "flex flex-wrap items-center justify-between gap-4",
              children: [jsxs("div", {
                children: [jsx("p", {
                  class: "text-sm font-semibold uppercase tracking-[0.22em] text-slate-500",
                  children: "Resumen ejecutivo"
                }), jsx("h3", {
                  class: "mt-3 text-2xl font-semibold text-white",
                  children: "Diagnóstico general del activo digital"
                })]
              }), jsxs("div", {
                class: "rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300",
                children: ["Impacto prioritario: ", result.estimatedImpactAreas.join(", ") || "Optimización continua"]
              })]
            }), jsx("p", {
              class: "mt-5 text-base leading-8 text-slate-300",
              children: result.redesignOpportunity
            }), jsxs("div", {
              class: "mt-8 grid gap-4 md:grid-cols-2",
              children: [jsxs("div", {
                class: "rounded-3xl border border-indigo-400/15 bg-indigo-500/10 p-5",
                children: [jsx("p", {
                  class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200",
                  children: "Quick wins"
                }), jsx("ul", {
                  class: "mt-4 space-y-3 text-sm leading-6 text-indigo-50/90",
                  children: result.quickWins.map((item) => jsxs("li", {
                    class: "flex gap-3",
                    children: [jsx("span", {
                      class: "mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-300/15 text-indigo-200",
                      children: "•"
                    }), jsx("span", {
                      children: item
                    })]
                  }, item))
                })]
              }), jsxs("div", {
                class: "rounded-3xl border border-rose-400/15 bg-rose-500/10 p-5",
                children: [jsx("p", {
                  class: "text-xs font-semibold uppercase tracking-[0.18em] text-rose-200",
                  children: "Dolores principales"
                }), jsx("ul", {
                  class: "mt-4 space-y-3 text-sm leading-6 text-rose-50/90",
                  children: (result.primaryPainPoints.length > 0 ? result.primaryPainPoints : ["No se detectaron bloqueos críticos."]).map((item) => jsxs("li", {
                    class: "flex gap-3",
                    children: [jsx("span", {
                      class: "mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-300/15 text-rose-200",
                      children: "•"
                    }), jsx("span", {
                      children: item
                    })]
                  }, item))
                })]
              })]
            })]
          }), jsx(AuditResults, {
            result,
            activeTab,
            onSelectTab: setActiveTab
          })]
        }), jsxs("aside", {
          class: "space-y-6",
          children: [jsxs("section", {
            class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl",
            children: [jsx("p", {
              class: "text-sm font-semibold uppercase tracking-[0.22em] text-slate-500",
              children: "SEO detectado"
            }), jsxs("div", {
              class: "mt-5 space-y-4 text-sm leading-7 text-slate-300",
              children: [jsxs("div", {
                class: "rounded-2xl border border-white/8 bg-slate-950/50 p-4",
                children: [jsx("span", {
                  class: "block text-xs uppercase tracking-[0.18em] text-slate-500",
                  children: "Title"
                }), jsx("span", {
                  class: "mt-2 block font-medium text-white",
                  children: result.seoMetadata.title || "No detectado"
                })]
              }), jsxs("div", {
                class: "rounded-2xl border border-white/8 bg-slate-950/50 p-4",
                children: [jsx("span", {
                  class: "block text-xs uppercase tracking-[0.18em] text-slate-500",
                  children: "Meta description"
                }), jsx("span", {
                  class: "mt-2 block",
                  children: result.seoMetadata.metaDescription || "No detectada"
                })]
              }), jsxs("div", {
                class: "grid grid-cols-2 gap-3",
                children: [jsx(MetricCard, {
                  label: "H1",
                  value: String(result.seoMetadata.h1Count),
                  hint: result.seoMetadata.h1 || "Sin H1 principal detectado."
                }), jsx(MetricCard, {
                  label: "Lang",
                  value: result.seoMetadata.langAttribute || "N/D",
                  hint: "Idioma declarado del documento HTML."
                })]
              })]
            })]
          }), jsxs("section", {
            class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl",
            children: [jsx("p", {
              class: "text-sm font-semibold uppercase tracking-[0.22em] text-slate-500",
              children: "Señales UX / negocio"
            }), jsxs("div", {
              class: "mt-5 grid gap-3 text-sm text-slate-300",
              children: [jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[0]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasCta ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasCta ? "Sí" : "No"
                })]
              }), jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[1]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasContactInfo ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasContactInfo ? "Sí" : "No"
                })]
              }), jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[2]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasForm ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasForm ? "Sí" : "No"
                })]
              }), jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[3]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasSocialLinks ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasSocialLinks ? "Sí" : "No"
                })]
              }), jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[4]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasTrustSignals ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasTrustSignals ? "Sí" : "No"
                })]
              }), jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[5]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasHeader ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasHeader ? "Sí" : "No"
                })]
              }), jsxs("div", {
                class: "flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3",
                children: [jsx("span", {
                  children: businessSignalLabels[6]
                }), jsx("span", {
                  class: `rounded-full px-3 py-1 text-xs font-semibold ${result.uxSignals.hasFooter ? "bg-emerald-500/10 text-emerald-100" : "bg-red-500/10 text-red-200"}`,
                  children: result.uxSignals.hasFooter ? "Sí" : "No"
                })]
              })]
            })]
          })]
        })]
      }) : null, tabSummary ? jsxs("div", {
        class: "space-y-8",
        children: [jsxs("section", {
          class: "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]",
          children: [jsxs("div", {
            class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
            children: [jsxs("div", {
              class: "flex flex-wrap items-start justify-between gap-4",
              children: [jsxs("div", {
                children: [jsx("p", {
                  class: "text-sm font-semibold uppercase tracking-[0.22em] text-slate-500",
                  children: "Detalle de categoría"
                }), jsx("h3", {
                  class: "mt-3 text-3xl font-black tracking-tight text-white",
                  children: tabSummary.label
                }), jsx("p", {
                  class: "mt-4 text-base leading-7 text-slate-300",
                  children: tabSummary.summary
                })]
              }), jsx("div", {
                class: `rounded-full border px-4 py-2 text-sm font-semibold ${statusClasses[tabSummary.status]}`,
                children: statusLabels[tabSummary.status]
              })]
            }), jsx("div", {
              class: "mt-8",
              children: jsx(ScoreGauge, {
                score: tabSummary.score,
                label: tabSummary.label,
                subtitle: "Score calculado a partir de heurísticas y señales reales detectadas."
              })
            })]
          }), jsxs("div", {
            class: "rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8",
            children: [jsx("p", {
              class: "text-sm font-semibold uppercase tracking-[0.22em] text-slate-500",
              children: "Recomendaciones prioritarias"
            }), jsx("div", {
              class: "mt-5 space-y-4",
              children: result.recommendations.filter((item) => item.category === tabSummary.category).slice(0, 4).map((item) => jsxs("div", {
                class: "rounded-2xl border border-white/8 bg-slate-950/50 p-4",
                children: [jsxs("div", {
                  class: "flex items-center justify-between gap-3",
                  children: [jsx("div", {
                    class: "text-lg font-semibold text-white",
                    children: item.title
                  }), jsx("span", {
                    class: `rounded-full px-3 py-1 text-xs font-semibold uppercase ${item.priority === "critical" ? "bg-red-500/10 text-red-200" : item.priority === "important" ? "bg-amber-500/10 text-amber-100" : "bg-blue-500/10 text-blue-100"}`,
                    children: item.priority
                  })]
                }), jsx("p", {
                  class: "mt-3 text-sm leading-6 text-slate-300",
                  children: item.action
                })]
              }, item.id))
            })]
          })]
        }), activeTab === "performance" ? jsxs("div", {
          class: "grid gap-6 xl:grid-cols-2",
          children: [jsx(PerformanceSnapshot, {
            title: "PageSpeed móvil",
            data: result.pageSpeedMobile
          }), jsx(PerformanceSnapshot, {
            title: "PageSpeed escritorio",
            data: result.pageSpeedDesktop
          })]
        }) : null, jsx(FindingsList, {
          title: `Hallazgos detectados en ${tabSummary.label}`,
          findings: activeFindings,
          recommendations: result.recommendations,
          emptyLabel: `No se detectaron incidencias relevantes en ${tabSummary.label.toLowerCase()}.`
        })]
      }) : null, activeTab === "proposal" ? jsx(ProposalView, {
        result
      }) : null]
    }) : null]
  });
}

const $$Auditor = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Auditor Web · Informe premium de diagnóstico</title><meta name="description" content="Herramienta de auditoría web con diagnóstico técnico, lectura comercial y propuesta premium orientada a rediseño y optimización.">${renderHead()}</head> <body> <main class="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14"> ${renderComponent($$result, "AuditorApp", AuditorApp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/tmp/workspace/yohancsdam/web-auditor/src/components/AuditorApp", "client:component-export": "default" })} </main> </body></html>`;
}, "/tmp/workspace/yohancsdam/web-auditor/src/pages/auditor.astro", void 0);

const $$file = "/tmp/workspace/yohancsdam/web-auditor/src/pages/auditor.astro";
const $$url = "/auditor";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Auditor,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
