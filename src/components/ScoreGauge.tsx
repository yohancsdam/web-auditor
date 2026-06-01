interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  subtitle?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export default function ScoreGauge({ score, size = 184, label = 'Score global', subtitle }: ScoreGaugeProps) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset = circumference - (progress / 100) * circumference;
  const color = getScoreColor(progress);

  return (
    <div class="relative flex flex-col items-center justify-center gap-4">
      <div class="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg viewBox={`0 0 ${size} ${size}`} class="h-full w-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            stroke-width={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            stroke-linecap="round"
            stroke-width={stroke}
            stroke-dasharray={circumference}
            stroke-dashoffset={offset}
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950/80 shadow-2xl shadow-indigo-950/50 backdrop-blur-sm">
          <span class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</span>
          <span class="mt-2 text-5xl font-black text-white">{progress}</span>
          <span class="text-sm text-slate-400">sobre 100</span>
        </div>
      </div>
      {subtitle ? <p class="max-w-xs text-center text-sm text-slate-400">{subtitle}</p> : null}
    </div>
  );
}
