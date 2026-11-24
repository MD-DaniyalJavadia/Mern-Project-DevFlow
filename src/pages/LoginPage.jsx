import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Please try again.");
    } finally { setSubmitting(false); }
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue to your development workspace." footer={<span>Don't have an account? <Link className="font-semibold text-blue-400 hover:text-blue-300" to="/register">Create one</Link></span>}>
    <form onSubmit={submit} className="space-y-5">
      {error && <ErrorBox message={error} />}
      <Field label="Email address"><input className="input mt-1.5" type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" /></Field>
      <Field label="Password"><div className="relative"><input className="input mt-1.5 pr-11" type={showPassword?"text":"password"} autoComplete="current-password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password" /><button type="button" aria-label="Toggle password visibility" className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></Field>
      <button disabled={submitting} className="btn-primary w-full">{submitting?<><Loader2 size={17} className="animate-spin"/> Signing in...</>:"Sign in"}</button>
    </form>
  </AuthLayout>;
}
function Field({label,children}){return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>}
function ErrorBox({message}){return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{message}</div>}
