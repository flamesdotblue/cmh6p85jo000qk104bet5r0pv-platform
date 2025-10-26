import { Calendar, BookOpen, TrendingUp, ClipboardList, AlarmClock } from 'lucide-react';

export default function DashboardOverview({ loading, courses, assignments, exams, stats }) {
  const upcoming = [...assignments, ...exams]
    .filter((i) => !i.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <section id="dashboard" className="space-y-6">
      <h2 className="text-xl font-semibold text-white/90">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI loading={loading} icon={TrendingUp} label="GPA" value={stats.gpa?.toFixed(2) ?? '—'} badge="weighted" />
        <KPI loading={loading} icon={ClipboardList} label="On-time rate" value={`${Math.round((stats.onTimeRate ?? 0) * 100)}%`} badge="deadlines" />
        <KPI loading={loading} icon={Calendar} label="Due next 7d" value={stats.dueNext7d ?? 0} badge="items" />
        <KPI loading={loading} icon={BookOpen} label="Courses" value={courses.length} badge="active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white/90">Active Courses</h3>
            <span className="text-xs text-white/50">Unique IDs</span>
          </div>
          <ul className="mt-3 divide-y divide-white/10">
            {courses.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-white/50">{c.instructor} • ID: <span className="text-emerald-300">{c.id}</span></p>
                </div>
                <div className="text-sm text-white/60">Credits: {c.credits}</div>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="py-6 text-sm text-white/50">No courses yet.</li>
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-medium text-white/90 flex items-center gap-2"><AlarmClock className="h-4 w-4" /> Upcoming (IDs visible)</h3>
          <ul className="mt-3 divide-y divide-white/10">
            {upcoming.map((u) => (
              <li key={u.id} className="py-3">
                <p className="font-medium">
                  {u.title}
                  <span className="ml-2 text-xs text-white/50">{new Date(u.dueDate).toLocaleDateString()}</span>
                </p>
                <p className="text-xs text-white/50">Course: {u.courseName} • Type: {u.type} • ID: <span className="text-emerald-300">{u.id}</span></p>
              </li>
            ))}
            {upcoming.length === 0 && <li className="py-6 text-sm text-white/50">You're all caught up.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

function KPI({ icon: Icon, label, value, badge, loading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-xs text-white/50">{label}</p>
            <p className="text-xl font-semibold tracking-tight">{loading ? '…' : value}</p>
          </div>
        </div>
        <span className="text-[10px] rounded-full px-2 py-0.5 bg-white/5 border border-white/10 text-white/60">{badge}</span>
      </div>
    </div>
  );
}
