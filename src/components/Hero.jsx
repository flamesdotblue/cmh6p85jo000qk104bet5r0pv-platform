import { Rocket, TrendingUp } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[68vh] w-full overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300 text-xs mb-4 ring-1 ring-emerald-400/30">
            <TrendingUp className="h-3.5 w-3.5" />
            Real-time insights • Actionable analytics • Exam-ready
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight">Win your semester with a dashing student analytics dashboard</h1>
          <p className="mt-4 text-white/70 max-w-2xl">Enter or sync grades, assignments, and exams. Visualize performance, track deadlines, and stay on top with smart indicators. Designed for clarity and speed.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#dashboard" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-3 font-medium transition">
              <Rocket className="h-5 w-5" />
              Launch Dashboard
            </a>
            <a href="#add" className="inline-flex items-center gap-2 rounded-lg border border-white/20 hover:border-white/40 text-white px-5 py-3 font-medium transition">
              Add Assignment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -inset-[30%] opacity-40 [filter:blur(100px)]">
        <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-emerald-500/40 animate-pulse" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-cyan-500/30 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute left-1/3 bottom-1/4 h-72 w-72 rounded-full bg-indigo-500/30 animate-[pulse_4s_ease-in-out_infinite]" />
      </div>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="grid" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
        <pattern id="p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#grid)" strokeWidth="0.6" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#p)" />
      </svg>
    </div>
  );
}
