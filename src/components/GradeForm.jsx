import { useMemo, useState } from 'react';
import { api } from '../lib/api';
import { PlusCircle } from 'lucide-react';

export default function GradeForm({ courses, onChange }) {
  const [type, setType] = useState('assignment');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState(10);
  const [score, setScore] = useState('');

  const selectedCourse = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!courseId || !title || !dueDate) return;
    const payload = {
      title,
      courseId,
      courseName: selectedCourse?.name || 'Unknown',
      dueDate: new Date(dueDate).toISOString(),
      weight: Number(weight),
      completed: false,
      score: score === '' ? null : Number(score),
      type: type === 'assignment' ? 'assignment' : 'exam',
    };
    if (type === 'assignment') await api.create('assignments', payload);
    else await api.create('exams', payload);

    setTitle('');
    setScore('');
    await onChange?.();
    const el = document.getElementById('dashboard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="add" className="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 className="font-medium text-white/90">Add Assignment or Exam</h3>
      <p className="text-sm text-white/60 mt-1">All entries are stored locally with unique IDs and synced across the dashboard.</p>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/60">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60">Course</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-white/60">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2" placeholder="e.g., Homework 3 or Midterm 1" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-white/60">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-white/60">Weight %</label>
            <input type="number" value={weight} min={1} max={100} step={1} onChange={(e) => setWeight(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-white/60">Score (optional)</label>
            <input type="number" value={score} min={0} max={100} step={0.1} onChange={(e) => setScore(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2" />
          </div>
        </div>
        <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 font-medium transition">
          <PlusCircle className="h-4 w-4" /> Add
        </button>
      </form>
      <div className="mt-4 text-xs text-white/50">
        Tip: Leave score empty to mark as upcoming; add score to track performance trend.
      </div>
    </section>
  );
}
