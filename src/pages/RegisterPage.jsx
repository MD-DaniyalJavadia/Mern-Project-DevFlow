import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form,setForm]=useState({name:"",email:"",password:"",confirmPassword:""});
  const [show,setShow]=useState(false); const [error,setError]=useState(""); const [submitting,setSubmitting]=useState(false);
  const update=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  const submit=async e=>{e.preventDefault();setError("");if(form.password!==form.confirmPassword){setError("Passwords do not match.");return;}if(form.password.length<8){setError("Password must be at least 8 characters.");return;}setSubmitting(true);try{await register(form);navigate("/dashboard",{replace:true});}catch(err){setError(err.response?.data?.message||"Unable to create your account. Please try again.");}finally{setSubmitting(false);}};
  return <AuthLayout title="Create your account" subtitle="Start organizing your development workflow with DevFlow." footer={<span>Already have an account? <Link className="font-semibold text-blue-400 hover:text-blue-300" to="/login">Sign in</Link></span>}>
    <form onSubmit={submit} className="space-y-4">
      {error&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</div>}
      <Field label="Full name"><input className="input mt-1.5" autoComplete="name" required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Daniyal Javadia" /></Field>
      <Field label="Email address"><input className="input mt-1.5" type="email" autoComplete="email" required value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" /></Field>
      <Field label="Password"><PasswordInput value={form.password} onChange={v=>update("password",v)} show={show} setShow={setShow} autoComplete="new-password" /></Field>
      <Field label="Confirm password"><PasswordInput value={form.confirmPassword} onChange={v=>update("confirmPassword",v)} show={show} setShow={setShow} autoComplete="new-password" /></Field>
      <p className="text-xs leading-5 text-slate-400">Use at least 8 characters. Your password is hashed on the server and is never returned by the API.</p>
      <button disabled={submitting} className="btn-primary w-full">{submitting?<><Loader2 size={17} className="animate-spin"/> Creating account...</>:"Create account"}</button>
    </form>
  </AuthLayout>;
}
function Field({label,children}){return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>}
function PasswordInput({value,onChange,show,setShow,autoComplete}){return <div className="relative"><input className="input mt-1.5 pr-11" type={show?"text":"password"} autoComplete={autoComplete} required minLength={8} value={value} onChange={e=>onChange(e.target.value)} placeholder="At least 8 characters"/><button type="button" aria-label="Toggle password visibility" className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>}
