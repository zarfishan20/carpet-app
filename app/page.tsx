import Link from "next/link";
import { Layers } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-sky-500/10 blur-[140px] rounded-full top-1/3 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-sm text-center space-y-8 relative z-10">

        {/* Branding */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <Layers className="text-sky-400" size={28} />
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Carpet Flow
          </h1>

          <p className="text-sm text-slate-400">
            Manage projects, surveys, and installations with ease
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">

          <Link
            href="/login"
            className="block w-full bg-sky-500 hover:bg-sky-600 text-black font-bold py-4 rounded-xl transition shadow-lg shadow-sky-500/10"
          >
            Login
          </Link>

          <Link
            href="/survey"
            className="block w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-4 rounded-xl transition"
          >
            Start Survey
          </Link>

        </div>

        {/* Footer note */}
        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
          Professional Flooring Workflow System
        </p>

      </div>
    </div>
  );
}