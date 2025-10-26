import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import DashboardOverview from './components/DashboardOverview';
import GradeForm from './components/GradeForm';
import PerformanceCharts from './components/PerformanceCharts';
import { api } from './lib/api';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const [c, a, e] = await Promise.all([
      api.list('courses'),
      api.list('assignments'),
      api.list('exams'),
    ]);
    setCourses(c);
    setAssignments(a);
    setExams(e);
    setLoading(false);
  };

  useEffect(() => {
    api.seed();
    refresh();
  }, []);

  const stats = useMemo(() => api.getStats(), [loading]);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <Hero />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <DashboardOverview
          loading={loading}
          courses={courses}
          assignments={assignments}
          exams={exams}
          stats={stats}
        />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PerformanceCharts courses={courses} assignments={assignments} exams={exams} />
          </div>
          <div className="xl:col-span-1">
            <GradeForm courses={courses} onChange={refresh} />
          </div>
        </div>
      </main>
      <footer className="border-t border-white/10 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-white/60 flex items-center justify-between">
          <span>Student Dashboard for Academic Tracking</span>
          <span>Local data • Unique IDs • Fast UI</span>
        </div>
      </footer>
    </div>
  );
}
