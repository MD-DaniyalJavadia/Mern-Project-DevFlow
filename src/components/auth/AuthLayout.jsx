import { Zap } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
      <div className="mb-7 flex justify-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Zap size={20} fill="currentColor" /></div>
          <div><span className="text-xl font-extrabold tracking-tight text-white">Dev</span><span className="text-xl font-extrabold tracking-tight text-blue-400">Flow</span></div>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm text-slate-400">{footer}</div>}
    </div>
  </div>;
}
