const STORAGE_KEY = 'sdat.v1';

const uid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

function getStore() {
  if (typeof localStorage === 'undefined') return { courses: [], assignments: [], exams: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { courses: [], assignments: [], exams: [] };
    const parsed = JSON.parse(raw);
    return { courses: [], assignments: [], exams: [], ...parsed };
  } catch {
    return { courses: [], assignments: [], exams: [] };
  }
}

function setStore(next) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function seed() {
  const s = getStore();
  if ((s.courses?.length ?? 0) > 0) return; // already seeded
  const c1 = { id: uid(), name: 'Data Structures', instructor: 'Dr. Chen', credits: 3 };
  const c2 = { id: uid(), name: 'Linear Algebra', instructor: 'Prof. Rivera', credits: 4 };
  const c3 = { id: uid(), name: 'Modern Physics', instructor: 'Dr. Singh', credits: 3 };

  const now = new Date();
  const day = 86400000;

  const a1 = { id: uid(), title: 'HW1 Arrays', courseId: c1.id, courseName: c1.name, dueDate: new Date(now.getTime() - 10 * day).toISOString(), weight: 10, completed: true, score: 88, type: 'assignment' };
  const a2 = { id: uid(), title: 'HW2 Trees', courseId: c1.id, courseName: c1.name, dueDate: new Date(now.getTime() - 3 * day).toISOString(), weight: 10, completed: true, score: 92, type: 'assignment' };
  const a3 = { id: uid(), title: 'Problem Set 1', courseId: c2.id, courseName: c2.name, dueDate: new Date(now.getTime() - 6 * day).toISOString(), weight: 5, completed: true, score: 81, type: 'assignment' };
  const a4 = { id: uid(), title: 'Lab Report 1', courseId: c3.id, courseName: c3.name, dueDate: new Date(now.getTime() - 1 * day).toISOString(), weight: 5, completed: true, score: 75, type: 'assignment' };
  const a5 = { id: uid(), title: 'Project Proposal', courseId: c1.id, courseName: c1.name, dueDate: new Date(now.getTime() + 2 * day).toISOString(), weight: 10, completed: false, score: null, type: 'assignment' };

  const e1 = { id: uid(), title: 'Midterm 1', courseId: c2.id, courseName: c2.name, dueDate: new Date(now.getTime() + 5 * day).toISOString(), weight: 25, completed: false, score: null, type: 'exam' };
  const e2 = { id: uid(), title: 'Quiz: Relativity', courseId: c3.id, courseName: c3.name, dueDate: new Date(now.getTime() + 1 * day).toISOString(), weight: 10, completed: false, score: null, type: 'exam' };

  const seeded = { courses: [c1, c2, c3], assignments: [a1, a2, a3, a4, a5], exams: [e1, e2] };
  setStore(seeded);
}

async function list(entity) {
  const s = getStore();
  return s[entity] || [];
}

async function create(entity, data) {
  const s = getStore();
  const record = { id: uid(), ...data };
  s[entity] = [record, ...(s[entity] || [])];
  setStore(s);
  return record;
}

async function update(entity, id, patch) {
  const s = getStore();
  s[entity] = (s[entity] || []).map((r) => (r.id === id ? { ...r, ...patch } : r));
  setStore(s);
}

async function remove(entity, id) {
  const s = getStore();
  s[entity] = (s[entity] || []).filter((r) => r.id !== id);
  setStore(s);
}

function getStats() {
  const s = getStore();
  const byCourse = new Map();
  for (const c of s.courses) byCourse.set(c.id, []);
  for (const item of [...s.assignments, ...s.exams]) {
    if (typeof item.score === 'number') {
      if (!byCourse.has(item.courseId)) byCourse.set(item.courseId, []);
      byCourse.get(item.courseId).push({ score: item.score, weight: item.weight });
    }
  }
  const courseGPAs = [];
  for (const [cid, arr] of byCourse) {
    if (arr.length === 0) continue;
    const totalWeight = arr.reduce((s, a) => s + a.weight, 0) || 1;
    const avg = arr.reduce((s, a) => s + (a.score * a.weight) / totalWeight, 0);
    const gpa = toGPA(avg);
    courseGPAs.push(gpa);
  }
  const gpa = courseGPAs.length ? courseGPAs.reduce((a, b) => a + b, 0) / courseGPAs.length : null;

  const now = Date.now();
  const next7 = 7 * 86400000;
  const allUpcoming = [...s.assignments, ...s.exams].filter((i) => !i.completed);
  const dueNext7d = allUpcoming.filter((i) => new Date(i.dueDate).getTime() - now <= next7 && new Date(i.dueDate).getTime() >= now).length;

  const allDone = [...s.assignments, ...s.exams].filter((i) => i.completed);
  const onTime = allDone.filter((i) => new Date(i.dueDate).getTime() >= now - 1);
  const onTimeRate = (allDone.length ? onTime.length / allDone.length : 0.9);

  return { gpa, dueNext7d, onTimeRate };
}

function toGPA(percent) {
  if (percent >= 93) return 4.0;
  if (percent >= 90) return 3.7;
  if (percent >= 87) return 3.3;
  if (percent >= 83) return 3.0;
  if (percent >= 80) return 2.7;
  if (percent >= 77) return 2.3;
  if (percent >= 73) return 2.0;
  if (percent >= 70) return 1.7;
  if (percent >= 67) return 1.3;
  if (percent >= 65) return 1.0;
  return 0.0;
}

export const api = { seed, list, create, update, remove, getStats };