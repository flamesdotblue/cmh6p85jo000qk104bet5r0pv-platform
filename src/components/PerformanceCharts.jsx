import { useMemo } from 'react';

export default function PerformanceCharts({ courses, assignments, exams }) {
  const series = useMemo(() => {
    const items = [...assignments, ...exams]
      .filter((i) => typeof i.score === 'number')
      .map((i) => ({
        date: new Date(i.dueDate).getTime(),
        score: i.score,
        courseId: i.courseId,
        courseName: i.courseName,
      }))
      .sort((a, b) => a.date - b.date);

    return items;
  }, [assignments, exams]);

  const byCourse = useMemo(() => {
    const map = new Map();
    for (const c of courses) map.set(c.id, []);
    for (const p of series) {
      if (!map.has(p.courseId)) map.set(p.courseId, []);
      map.get(p.courseId).push(p);
    }
    return map;
  }, [courses, series]);

  return (
    <section className="space-y-6">
      <h3 className="font-medium text-white/90">Performance Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Overall Trend">
          <LineChart data={series} height={200} />
          <p className="mt-3 text-xs text-white/60">All scored assignments and exams over time. Hover for details.</p>
        </Card>
        <Card title="Course Averages">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((c) => {
              const points = byCourse.get(c.id) || [];
              const avg = points.length ? points.reduce((s, p) => s + p.score, 0) / points.length : null;
              return (
                <div key={c.id} className="rounded-lg border border-white/10 p-3 bg-white/5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{c.name}</p>
                    <span className="text-[10px] text-white/50">ID: <span className="text-emerald-300">{c.id}</span></span>
                  </div>
                  <div className="mt-2">
                    {avg !== null ? (
                      <div className="flex items-center gap-3">
                        <Donut value={avg} />
                        <div>
                          <p className="text-lg font-semibold">{avg.toFixed(1)}%</p>
                          <p className="text-xs text-white/60">based on {points.length} graded</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-white/50">No graded items yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
            {courses.length === 0 && <div className="text-sm text-white/50">No courses to analyze.</div>}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white/90">{title}</h4>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function LineChart({ data, height = 160 }) {
  const padding = 28;
  const width = 600;
  const h = height;

  if (!data || data.length === 0) {
    return <div className="h-[200px] flex items-center justify-center text-white/50 text-sm">No data yet. Add scores to see trends.</div>;
  }

  const xs = data.map((d) => d.date);
  const ys = data.map((d) => d.score);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(0, Math.min(...ys));
  const maxY = Math.max(100, Math.max(...ys));

  const scaleX = (x) => padding + ((x - minX) / Math.max(1, maxX - minX)) * (width - padding * 2);
  const scaleY = (y) => h - padding - ((y - minY) / Math.max(1, maxY - minY)) * (h - padding * 2);

  const path = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(d.date)},${scaleY(d.score)}`)
    .join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${h}`} className="block">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={h} fill="transparent" />
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={padding} x2={width - padding} y1={scaleY(g)} y2={scaleY(g)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x={8} y={scaleY(g) + 4} fontSize="10" fill="rgba(255,255,255,0.4)">{g}%</text>
        </g>
      ))}
      <path d={`${path} L ${scaleX(maxX)},${scaleY(0)} L ${scaleX(minX)},${scaleY(0)} Z`} fill="url(#grad)" />
      <path d={path} fill="none" stroke="#34d399" strokeWidth="2" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={scaleX(d.date)} cy={scaleY(d.score)} r={3} fill="#34d399" />
          <title>{`${d.courseName} • ${new Date(d.date).toLocaleDateString()} • ${d.score}%`}</title>
        </g>
      ))}
    </svg>
  );
}

function Donut({ value, size = 52, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#34d399" strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="#fff">{Math.round(value)}</text>
    </svg>
  );
}
