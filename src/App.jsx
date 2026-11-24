import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import {
  AlertCircle, BarChart3, Bookmark, Bug, Check, CheckCircle2, ChevronDown,
  ClipboardList, Code2, Copy, Edit3, FileText, Filter, FolderCode, LayoutDashboard,
  LogOut, Menu, MoreHorizontal, NotebookPen, Play, Plus, Search, Settings, Timer,
  Trash2, X, Zap
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "./api/axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", to: "/tasks", icon: ClipboardList },
  { label: "Code Snippets", to: "/snippets", icon: Code2 },
  { label: "Bug Tracker", to: "/bugs", icon: Bug },
  { label: "Notes", to: "/notes", icon: NotebookPen },
  { label: "Coding Sessions", to: "/sessions", icon: Timer },
  { label: "Bookmarks", to: "/bookmarks", icon: Bookmark },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error("DevFlow UI error:", error); }
  render() {
    if (this.state.hasError) return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="card max-w-md p-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertCircle size={22}/></div><h1 className="mt-4 text-xl font-bold">Something went wrong</h1><p className="mt-2 text-sm text-slate-500">The page could not be rendered. Refresh the page and try again.</p><button className="btn-primary mt-6" onClick={() => window.location.reload()}>Refresh page</button></div></div>;
    return this.props.children;
  }
}

function App() {
  return <AppErrorBoundary><AuthProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/snippets" element={<SnippetsPage />} />
          <Route path="/bugs" element={<BugsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  </AuthProvider></AppErrorBoundary>;
}

function AppShell() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = navItems.find(x => x.to === location.pathname)?.label || "Dashboard";

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <Logo />
          <button className="icon-btn lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Workspace</p>
          <div className="space-y-1">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
                <Icon size={18} strokeWidth={1.9} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{initials(user?.name)}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name || "Developer"}</p>
              <p className="truncate text-xs text-slate-500">Developer</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button className="icon-btn lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400">Workspace /</p>
            <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
            <Search size={16} className="text-slate-400" />
            <span className="text-xs text-slate-400">Search anything...</span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] text-slate-400 shadow-sm">⌘ K</kbd>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{initials(user?.name)}</div>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Logo({ centered = false }) {
  return <div className={`flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><Zap size={19} fill="currentColor" /></div>
    <div><span className="text-lg font-extrabold tracking-tight text-slate-950">Dev</span><span className="text-lg font-extrabold tracking-tight text-blue-600">Flow</span></div>
  </div>;
}

function PageHeader({ title, description, action }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div><h1 className="page-title">{title}</h1>{description && <p className="mt-1.5 muted">{description}</p>}</div>
    {action}
  </div>;
}

function StatCard({ label, value, change, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-violet-50 text-violet-600"
  };
  return <div className="card p-5">
    <div className="flex items-start justify-between"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={21} /></div><span className="text-xs font-semibold text-emerald-600">{change}</span></div>
    <p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
  </div>;
}

function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get("/tasks"), api.get("/analytics")])
      .then(([tasksResponse, analyticsResponse]) => {
        if (!mounted) return;
        setItems(tasksResponse.data.data || []);
        setAnalytics(analyticsResponse.data.data || null);
      })
      .catch(() => {
        if (mounted) {
          setItems([]);
          setAnalytics(null);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const weeklyHoursData = analytics?.weekly || [];
  const completed = analytics?.completedTasks ?? items.filter(t => t.status === "Completed").length;
  const openBugs = analytics?.openBugs ?? 0;
  const totalTasks = analytics?.totalTasks ?? items.length;

  return <>
    <PageHeader title={`Good Afternoon, ${user?.name?.split(" ")[0] || "Developer"} 👋`} description="Here's what's happening with your development workflow today." action={<NavLink to="/tasks" className="btn-primary"><Plus size={17}/> Add Task</NavLink>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Tasks" value={loading ? "—" : totalTasks} change="Live" icon={ClipboardList} />
      <StatCard label="Completed Tasks" value={loading ? "—" : completed} change="Live" icon={CheckCircle2} tone="green" />
      <StatCard label="Open Bugs" value={loading ? "—" : openBugs} change="Live" icon={Bug} tone="amber" />
      <StatCard label="Coding Hours" value={loading ? "—" : `${analytics?.codingHours ?? 0}h`} change="Live" icon={Timer} tone="purple" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-950">Productivity</h2><p className="mt-1 text-xs text-slate-500">Coding hours this week</p></div><NavLink to="/analytics" className="btn-secondary px-3 py-2 text-xs">View analytics <ChevronDown size={14}/></NavLink></div>
        <div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyHoursData}><defs><linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22}/><stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e2e8f0"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:12,fill:"#64748b"}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:12,fill:"#64748b"}} width={28}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e2e8f0"}}/><Area type="monotone" dataKey="codingHours" stroke="#3b82f6" strokeWidth={2.5} fill="url(#hoursFill)"/></AreaChart></ResponsiveContainer></div>
      </div>
      <div className="card p-5 sm:p-6"><h2 className="font-bold">Recent tasks</h2><p className="mt-1 text-xs text-slate-500">Latest work from your workspace</p><div className="mt-5 space-y-3">{items.slice(0,5).map(t=><div className="flex items-center gap-3" key={t._id}><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{t.status === "Completed" ? <Check size={15}/> : <ClipboardList size={15}/>}</div><div className="min-w-0 flex-1"><p className={`truncate text-sm font-semibold ${t.status === "Completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>{t.title}</p><p className="mt-0.5 text-xs text-slate-400">{t.status}</p></div></div>)}{!loading && !items.length && <p className="py-8 text-center text-sm text-slate-400">No tasks yet.</p>}</div></div>
    </div>
  </>;
}

function formatTaskDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function EmptyState({ title, description, action }) {
  return <div className="flex flex-col items-center justify-center px-6 py-12 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><ClipboardList size={21}/></div><h3 className="mt-4 font-bold text-slate-900">{title}</h3><p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
function Priority({ value }) {
  const cls = {Low:"bg-slate-100 text-slate-600",Medium:"bg-amber-50 text-amber-700",High:"bg-red-50 text-red-600",Critical:"bg-red-100 text-red-700"}[value] || "bg-slate-100 text-slate-600";
  return <span className={`badge ${cls}`}>{value}</span>;
}
function Status({ value }) {
  const cls = {"Todo":"bg-slate-100 text-slate-600","In Progress":"bg-blue-50 text-blue-700","Completed":"bg-emerald-50 text-emerald-700","Open":"bg-red-50 text-red-600","Resolved":"bg-emerald-50 text-emerald-700","Closed":"bg-slate-100 text-slate-600"}[value] || "bg-slate-100 text-slate-600";
  return <span className={`badge ${cls}`}>{value}</span>;
}

function Toolbar({ search, setSearch, placeholder="Search...", filter, setFilter, options=[] , action }) {
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row">
    <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input pl-10" value={search} onChange={e=>setSearch(e.target.value)} placeholder={placeholder}/></div>
    {options.length > 0 && <div className="relative sm:w-48"><Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><select className="input appearance-none pl-10" value={filter} onChange={e=>setFilter(e.target.value)}><option value="">All</option>{options.map(x=><option key={x}>{x}</option>)}</select></div>}
    {action}
  </div>;
}

function Modal({ title, onClose, children, footer }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-bold text-slate-950">{title}</h2><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><div className="p-5">{children}</div>{footer && <div className="flex justify-end gap-2 border-t border-slate-100 p-4">{footer}</div>}</div></div>;
}

function TasksPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    setLoading(true); setError("");
    try { const { data } = await api.get("/tasks"); setItems(data.data || []); }
    catch (err) { setError(err.response?.data?.message || "Unable to load tasks."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTasks(); }, []);

  const filtered = useMemo(() => {
    return [...items].filter(t => `${t.title} ${t.description || ""} ${t.category || ""}`.toLowerCase().includes(search.toLowerCase()) && (!filter || t.status === filter)).sort((a,b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "due") return (new Date(a.dueDate || "2999-12-31")) - (new Date(b.dueDate || "2999-12-31"));
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [items, search, filter, sort]);

  const saveTask = async (payload) => {
    setSaving(true); setError("");
    try {
      if (editing) {
        const { data } = await api.put(`/tasks/${editing._id}`, payload);
        setItems(prev => prev.map(t => t._id === editing._id ? data.data : t));
      } else {
        const { data } = await api.post("/tasks", payload);
        setItems(prev => [data.data, ...prev]);
      }
      setOpen(false); setEditing(null);
    } catch (err) { setError(err.response?.data?.message || "Unable to save task."); }
    finally { setSaving(false); }
  };

  const toggleTask = async (task) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status: task.status === "Completed" ? "Todo" : "Completed" });
      setItems(prev => prev.map(t => t._id === task._id ? data.data : t));
    } catch (err) { setError(err.response?.data?.message || "Unable to update task."); }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try { await api.delete(`/tasks/${task._id}`); setItems(prev => prev.filter(t => t._id !== task._id)); }
    catch (err) { setError(err.response?.data?.message || "Unable to delete task."); }
  };

  return <>
    <PageHeader title="Tasks" description="Plan, prioritize and track your development work." action={<button className="btn-primary" onClick={() => {setEditing(null);setOpen(true)}}><Plus size={17}/> Add Task</button>}/>
    {error && <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0"/><span>{error}</span><button className="ml-auto" onClick={()=>setError("")}><X size={16}/></button></div>}
    <Toolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={["Todo","In Progress","Completed"]} placeholder="Search tasks..." action={<select className="input sm:w-40" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="title">Title</option><option value="due">Due date</option></select>}/>
    <div className="card overflow-hidden">
      <div className="hidden grid-cols-[1fr_100px_120px_100px_96px] gap-4 border-b border-slate-100 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:grid"><span>Task</span><span>Priority</span><span>Status</span><span>Due</span><span>Actions</span></div>
      {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading tasks...</div> : filtered.length ? filtered.map(t => <div key={t._id} className="group flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-0 md:grid md:grid-cols-[1fr_100px_120px_100px_96px] md:gap-4 md:px-6"><button aria-label="Toggle completion" onClick={()=>toggleTask(t)} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${t.status==="Completed"?"border-emerald-500 bg-emerald-500 text-white":"border-slate-300"}`}>{t.status==="Completed"&&<Check size={13}/>}</button><div className="min-w-[180px] flex-1 md:min-w-0"><p className={`text-sm font-semibold ${t.status==="Completed"?"text-slate-400 line-through":"text-slate-800"}`}>{t.title}</p><p className="mt-1 text-xs text-slate-400">{t.category || "Uncategorized"}</p></div><Priority value={t.priority}/><Status value={t.status}/><span className="text-xs text-slate-500">{formatTaskDate(t.dueDate)}</span><div className="ml-auto flex gap-1"><button className="icon-btn" title="Edit" onClick={()=>{setEditing(t);setOpen(true)}}><Edit3 size={16}/></button><button className="icon-btn text-red-500 hover:bg-red-50 hover:text-red-600" title="Delete" onClick={()=>deleteTask(t)}><Trash2 size={16}/></button></div></div>) : <EmptyState title="No tasks found" description={search || filter ? "Try changing your search or filter." : "Create your first task to start tracking your work."} action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={16}/> Create Task</button>} />}
    </div>
    {open && <Modal title={editing ? "Edit Task" : "Create Task"} onClose={()=>{setOpen(false);setEditing(null)}}><TaskForm initial={editing} saving={saving} onCancel={()=>{setOpen(false);setEditing(null)}} onSubmit={saveTask}/></Modal>}
  </>;
}
function TaskForm({ initial, saving, onCancel, onSubmit }) {
  const [form,setForm]=useState({title:initial?.title||"",description:initial?.description||"",priority:initial?.priority||"Medium",status:initial?.status||"Todo",dueDate:initial?.dueDate ? new Date(initial.dueDate).toISOString().slice(0,10) : "",category:initial?.category||""});
  const [validation,setValidation]=useState("");
  const change=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  const submit=e=>{e.preventDefault();if(!form.title.trim()){setValidation("Task title is required.");return;}setValidation("");onSubmit({...form,title:form.title.trim(),dueDate:form.dueDate||undefined});};
  return <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Title<input className="input mt-1.5" value={form.title} onChange={e=>change("title",e.target.value)} placeholder="e.g. Build API endpoint" maxLength={160}/></label><label className="block text-sm font-medium">Description<textarea className="input mt-1.5 min-h-24" value={form.description} onChange={e=>change("description",e.target.value)} placeholder="Describe the task..." maxLength={2000}/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Priority<select className="input mt-1.5" value={form.priority} onChange={e=>change("priority",e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label><label className="text-sm font-medium">Status<select className="input mt-1.5" value={form.status} onChange={e=>change("status",e.target.value)}><option>Todo</option><option>In Progress</option><option>Completed</option></select></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Due date<input type="date" className="input mt-1.5" value={form.dueDate} onChange={e=>change("dueDate",e.target.value)}/></label><label className="text-sm font-medium">Category<input className="input mt-1.5" value={form.category} onChange={e=>change("category",e.target.value)} placeholder="Frontend" maxLength={80}/></label></div>{validation&&<p className="text-sm text-red-600">{validation}</p>}<div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="btn-primary" disabled={saving}>{saving?"Saving...":initial?"Save changes":"Create Task"}</button></div></form>;
}
function SnippetsPage(){
  const [items,setItems]=useState([]),[search,setSearch]=useState(""),[filter,setFilter]=useState(""),[open,setOpen]=useState(false),[editing,setEditing]=useState(null),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState("");
  const languages=["JavaScript","React","Node.js","C#","SQL","HTML","CSS","PHP","Python"];
  const load=async()=>{setLoading(true);setError("");try{const {data}=await api.get("/snippets");setItems(data.data||[])}catch(e){setError(e.response?.data?.message||"Unable to load snippets.")}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);
  const filtered=useMemo(()=>items.filter(s=>(`${s.title} ${s.description||""} ${s.code} ${(s.tags||[]).join(" ")}`).toLowerCase().includes(search.toLowerCase())&&(!filter||s.language===filter)),[items,search,filter]);
  const save=async(payload)=>{setSaving(true);setError("");try{const {data}=editing?await api.put(`/snippets/${editing._id}`,payload):await api.post("/snippets",payload);setItems(v=>editing?v.map(x=>x._id===editing._id?data.data:x):[data.data,...v]);setOpen(false);setEditing(null)}catch(e){setError(e.response?.data?.message||"Unable to save snippet.")}finally{setSaving(false)}};
  const remove=async(id)=>{if(!window.confirm("Delete this snippet?"))return;try{await api.delete(`/snippets/${id}`);setItems(v=>v.filter(x=>x._id!==id))}catch(e){setError(e.response?.data?.message||"Unable to delete snippet.")}};
  const copy=async(code)=>{try{await navigator.clipboard.writeText(code)}catch{setError("Clipboard access is unavailable in this browser.")}};
  return <><PageHeader title="Code Snippets" description="Your reusable developer knowledge library." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={17}/> Add Snippet</button>}/><Toolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={languages} placeholder="Search snippets..."/>{error&&<AlertMessage message={error}/>} {loading?<LoadingState text="Loading snippets..."/>:filtered.length===0?<EmptyState title="No snippets found" description="Create a reusable code snippet for your developer library." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={16}/> Add Snippet</button>}/>:<div className="grid gap-5 lg:grid-cols-2">{filtered.map(s=><div className="card overflow-hidden" key={s._id}><div className="flex items-start justify-between p-5"><div className="min-w-0"><div className="flex items-center gap-2"><FolderCode size={18} className="text-blue-600"/><h3 className="font-bold text-slate-900">{s.title}</h3></div><p className="mt-2 text-sm text-slate-500">{s.description||"No description"}</p></div><div className="flex"><button className="icon-btn" onClick={()=>{setEditing(s);setOpen(true)}}><Edit3 size={17}/></button><button className="icon-btn text-red-500" onClick={()=>remove(s._id)}><Trash2 size={17}/></button></div></div><div className="mx-5 overflow-hidden rounded-xl bg-slate-950"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2"><span className="text-xs font-medium text-slate-400">{s.language}</span><button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white" onClick={()=>copy(s.code)}><Copy size={14}/> Copy</button></div><pre className="max-h-72 overflow-auto p-4 text-xs leading-6 text-slate-300"><code>{s.code}</code></pre></div><div className="flex flex-wrap gap-2 p-5 pt-4">{(s.tags||[]).map(t=><span className="badge bg-slate-100 text-slate-600" key={t}>#{t}</span>)}</div></div>)}</div>}{open&&<SnippetModal item={editing} languages={languages} saving={saving} onClose={()=>{setOpen(false);setEditing(null)}} onSave={save}/>}</>;
}

function SnippetModal({item,languages,saving,onClose,onSave}){const [form,setForm]=useState({title:item?.title||"",description:item?.description||"",language:item?.language||languages[0],code:item?.code||"",tags:(item?.tags||[]).join(", ")});const submit=e=>{e.preventDefault();onSave({...form,tags:form.tags.split(",").map(x=>x.trim()).filter(Boolean)})};return <Modal title={item?"Edit Snippet":"Add Snippet"} onClose={onClose} footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" form="snippet-form" disabled={saving}>{saving?"Saving...":item?"Update Snippet":"Create Snippet"}</button></>}><form id="snippet-form" onSubmit={submit} className="space-y-4"><Field label="Title" value={form.title} onChange={v=>setForm({...form,title:v})} required/><Field label="Description" value={form.description} onChange={v=>setForm({...form,description:v})}/><label className="block text-sm font-medium text-slate-700">Language<select className="input mt-1.5" value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>{languages.map(x=><option key={x}>{x}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Code<textarea required className="input mt-1.5 min-h-48 font-mono text-xs" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/></label><Field label="Tags" value={form.tags} onChange={v=>setForm({...form,tags:v})} placeholder="react, hooks, api"/></form></Modal>}

function BugsPage(){
  const [items,setItems]=useState([]),[search,setSearch]=useState(""),[filter,setFilter]=useState(""),[open,setOpen]=useState(false),[editing,setEditing]=useState(null),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState("");
  const statuses=["Open","In Progress","Resolved","Closed"],priorities=["Low","Medium","High","Critical"];
  const load=async()=>{setLoading(true);setError("");try{const {data}=await api.get("/bugs");setItems(data.data||[])}catch(e){setError(e.response?.data?.message||"Unable to load bugs.")}finally{setLoading(false)}};useEffect(()=>{load()},[]);
  const filtered=useMemo(()=>items.filter(b=>(`${b.title} ${b.description||""} ${b.project||""} ${b.assignedTo||""}`).toLowerCase().includes(search.toLowerCase())&&(!filter||b.status===filter)),[items,search,filter]);
  const save=async(payload)=>{setSaving(true);setError("");try{const {data}=editing?await api.put(`/bugs/${editing._id}`,payload):await api.post("/bugs",payload);setItems(v=>editing?v.map(x=>x._id===editing._id?data.data:x):[data.data,...v]);setOpen(false);setEditing(null)}catch(e){setError(e.response?.data?.message||"Unable to save bug.")}finally{setSaving(false)}};
  const remove=async(id)=>{if(!window.confirm("Delete this bug?"))return;try{await api.delete(`/bugs/${id}`);setItems(v=>v.filter(x=>x._id!==id))}catch(e){setError(e.response?.data?.message||"Unable to delete bug.")}};
  return <><PageHeader title="Bug Tracker" description="Track issues from discovery to resolution." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={17}/> Add Bug</button>}/><Toolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={statuses} placeholder="Search bugs..."/>{error&&<AlertMessage message={error}/>} {loading?<LoadingState text="Loading bugs..."/>:filtered.length===0?<EmptyState title="No bugs found" description="Create a bug to start tracking an issue." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={16}/> Add Bug</button>}/>:<div className="card overflow-hidden">{filtered.map(b=><div key={b._id} className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-5 last:border-0"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Bug size={19}/></div><div className="min-w-[190px] flex-1"><h3 className="text-sm font-bold text-slate-800">{b.title}</h3><p className="mt-1 text-xs text-slate-400">{b.project||"No project"} · Assigned to {b.assignedTo||"Unassigned"}</p></div><Priority value={b.priority}/><Status value={b.status}/><div className="flex"><button className="icon-btn" onClick={()=>{setEditing(b);setOpen(true)}}><Edit3 size={17}/></button><button className="icon-btn text-red-500" onClick={()=>remove(b._id)}><Trash2 size={17}/></button></div></div>)}</div>}{open&&<BugModal item={editing} statuses={statuses} priorities={priorities} saving={saving} onClose={()=>{setOpen(false);setEditing(null)}} onSave={save}/>}</>;
}
function BugModal({item,statuses,priorities,saving,onClose,onSave}){const [form,setForm]=useState({title:item?.title||"",description:item?.description||"",priority:item?.priority||"Medium",status:item?.status||"Open",project:item?.project||"",assignedTo:item?.assignedTo||""});const set=(k,v)=>setForm({...form,[k]:v});return <Modal title={item?"Edit Bug":"Add Bug"} onClose={onClose} footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" form="bug-form" disabled={saving}>{saving?"Saving...":item?"Update Bug":"Create Bug"}</button></>}><form id="bug-form" onSubmit={e=>{e.preventDefault();onSave(form)}} className="space-y-4"><Field label="Title" value={form.title} onChange={v=>set("title",v)} required/><Field label="Description" value={form.description} onChange={v=>set("description",v)}/><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Priority" value={form.priority} options={priorities} onChange={v=>set("priority",v)}/><SelectField label="Status" value={form.status} options={statuses} onChange={v=>set("status",v)}/></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Project" value={form.project} onChange={v=>set("project",v)}/><Field label="Assigned To" value={form.assignedTo} onChange={v=>set("assignedTo",v)}/></div></form></Modal>}

function NotesPage(){
  const [items,setItems]=useState([]),[search,setSearch]=useState(""),[pinned,setPinned]=useState(false),[open,setOpen]=useState(false),[editing,setEditing]=useState(null),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState("");
  const load=async()=>{setLoading(true);setError("");try{const {data}=await api.get("/notes");setItems(data.data||[])}catch(e){setError(e.response?.data?.message||"Unable to load notes.")}finally{setLoading(false)}};useEffect(()=>{load()},[]);
  const filtered=useMemo(()=>items.filter(n=>(`${n.title} ${n.content} ${(n.tags||[]).join(" ")}`).toLowerCase().includes(search.toLowerCase())&&(!pinned||n.pinned)),[items,search,pinned]);
  const save=async(payload)=>{setSaving(true);setError("");try{const {data}=editing?await api.put(`/notes/${editing._id}`,payload):await api.post("/notes",payload);setItems(v=>editing?v.map(x=>x._id===editing._id?data.data:x):[data.data,...v]);setOpen(false);setEditing(null)}catch(e){setError(e.response?.data?.message||"Unable to save note.")}finally{setSaving(false)}};
  const remove=async(id)=>{if(!window.confirm("Delete this note?"))return;try{await api.delete(`/notes/${id}`);setItems(v=>v.filter(x=>x._id!==id))}catch(e){setError(e.response?.data?.message||"Unable to delete note.")}};
  return <><PageHeader title="Notes" description="Keep ideas, technical notes and checklists close at hand." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={17}/> New Note</button>}/><Toolbar search={search} setSearch={setSearch} filter={pinned?"Pinned":""} setFilter={v=>setPinned(v==="Pinned")} options={["Pinned"]} placeholder="Search notes..."/>{error&&<AlertMessage message={error}/>} {loading?<LoadingState text="Loading notes..."/>:filtered.length===0?<EmptyState title="No notes found" description="Create a note to keep your developer knowledge organized." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={16}/> New Note</button>}/>:<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(n=><div className="card group p-5" key={n._id}><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><FileText size={19}/></div>{n.pinned&&<span className="badge bg-blue-50 text-blue-600">Pinned</span>}</div><div className="mt-5 flex items-start justify-between gap-3"><h3 className="font-bold text-slate-900">{n.title}</h3><div className="flex shrink-0"><button className="icon-btn" onClick={()=>{setEditing(n);setOpen(true)}}><Edit3 size={17}/></button><button className="icon-btn text-red-500" onClick={()=>remove(n._id)}><Trash2 size={17}/></button></div></div><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{n.content}</p><div className="mt-5 flex flex-wrap gap-2">{(n.tags||[]).map(t=><span className="badge bg-slate-100 text-slate-600" key={t}>#{t}</span>)}</div></div>)}</div>}{open&&<NoteModal item={editing} saving={saving} onClose={()=>{setOpen(false);setEditing(null)}} onSave={save}/>}</>;
}
function NoteModal({item,saving,onClose,onSave}){const [form,setForm]=useState({title:item?.title||"",content:item?.content||"",tags:(item?.tags||[]).join(", "),pinned:item?.pinned||false});const set=(k,v)=>setForm({...form,[k]:v});return <Modal title={item?"Edit Note":"New Note"} onClose={onClose} footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" form="note-form" disabled={saving}>{saving?"Saving...":item?"Update Note":"Create Note"}</button></>}><form id="note-form" onSubmit={e=>{e.preventDefault();onSave({...form,tags:form.tags.split(",").map(x=>x.trim()).filter(Boolean)})}} className="space-y-4"><Field label="Title" value={form.title} onChange={v=>set("title",v)} required/><label className="block text-sm font-medium text-slate-700">Content<textarea required className="input mt-1.5 min-h-48" value={form.content} onChange={e=>set("content",e.target.value)}/></label><Field label="Tags" value={form.tags} onChange={v=>set("tags",v)} placeholder="react, interview"/><label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.pinned} onChange={e=>set("pinned",e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600"/> Pin this note</label></form></Modal>}

function AlertMessage({message}){return <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={17}/>{message}</div>}
function LoadingState({text}){return <div className="card p-10 text-center text-sm text-slate-500">{text}</div>}
function Field({label,value,onChange,placeholder,required=false}){return <label className="block text-sm font-medium text-slate-700">{label}<input required={required} className="input mt-1.5" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>}
function SelectField({label,value,options,onChange}){return <label className="block text-sm font-medium text-slate-700">{label}<select className="input mt-1.5" value={value} onChange={e=>onChange(e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></label>}

function formatDuration(totalSeconds = 0) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(seconds / 3600)}h ${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}m`;
}

function SessionsPage(){
 const [running,setRunning]=useState(false); const [seconds,setSeconds]=useState(0); const [startedAt,setStartedAt]=useState(null);
 const [sessions,setSessions]=useState([]); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState("");
 const format=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
 const load=async()=>{setLoading(true);setError("");try{const {data}=await api.get("/sessions");setSessions(data.data||[])}catch(err){setError(err.response?.data?.message||"Unable to load coding sessions.")}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 useEffect(()=>{if(!running)return;const id=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(id)},[running]);
 const todayStart=new Date(); todayStart.setHours(0,0,0,0);
 const weekStart=new Date(todayStart); weekStart.setDate(weekStart.getDate()-6);
 const todaySeconds=sessions.filter(x=>new Date(x.startedAt)>=todayStart).reduce((sum,x)=>sum+(x.durationSeconds||0),0);
 const weekSeconds=sessions.filter(x=>new Date(x.startedAt)>=weekStart).reduce((sum,x)=>sum+(x.durationSeconds||0),0);
 const start=()=>{setStartedAt(new Date(Date.now()-seconds*1000));setRunning(true);setError("")};
 const pause=()=>setRunning(false);
 const reset=()=>{setRunning(false);setSeconds(0);setStartedAt(null)};
 const stop=async()=>{if(seconds<=0){reset();return}setRunning(false);setSaving(true);setError("");try{const startTime=startedAt||new Date(Date.now()-seconds*1000);const endTime=new Date();const {data}=await api.post("/sessions",{startedAt:startTime.toISOString(),endedAt:endTime.toISOString(),durationSeconds:seconds});setSessions(prev=>[data.data,...prev]);reset()}catch(err){setError(err.response?.data?.message||"Unable to save coding session.")}finally{setSaving(false)}};
 return <><PageHeader title="Coding Sessions" description="Track focused development time and build consistency."/>
 {error&&<AlertMessage message={error}/>}
 <div className="grid gap-5 lg:grid-cols-3"><div className="card flex flex-col items-center justify-center p-6 sm:p-8 lg:col-span-2"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Timer size={30}/></div><p className="mt-6 text-sm font-medium text-slate-500">Current session</p><p className="mt-2 max-w-full overflow-hidden font-mono text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">{format(seconds)}</p><div className="mt-8 flex flex-wrap justify-center gap-3">{running?<button className="btn-secondary" onClick={pause}><Timer size={17}/> Pause</button>:<button className="btn-primary" onClick={start} disabled={saving}>{seconds>0?<><Play size={17} fill="currentColor"/> Resume</>:<><Play size={17} fill="currentColor"/> Start Timer</>}</button>}<button className="btn-secondary" onClick={reset} disabled={saving}>Reset</button><button className="btn-secondary" onClick={stop} disabled={saving||seconds===0}>{saving?"Saving...":"Stop & Save"}</button></div></div><div className="card divide-y divide-slate-100"><Metric label="Today's coding time" value={formatDuration(todaySeconds)}/><Metric label="Last 7 days" value={formatDuration(weekSeconds)}/><Metric label="Sessions completed" value={sessions.length}/></div></div>
 <div className="card mt-6 p-5 sm:p-6"><h2 className="font-bold">Recent sessions</h2><p className="mt-1 text-xs text-slate-500">Saved coding sessions from your workspace</p>{loading?<LoadingState text="Loading sessions..."/>:<div className="mt-4 divide-y divide-slate-100">{sessions.slice(0,10).map(x=><div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between" key={x._id}><div><p className="text-sm font-semibold">Coding session</p><p className="mt-1 text-xs text-slate-400">{new Date(x.startedAt).toLocaleString()}</p></div><span className="text-sm font-semibold text-slate-700">{formatDuration(x.durationSeconds)}</span></div>)}{!sessions.length&&<EmptyState title="No sessions yet" description="Start a timer and save your first coding session."/>}</div>}</div></>;
}
function Metric({label,value}){return <div className="p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>}

function BookmarksPage(){
 const [items,setItems]=useState([]); const [search,setSearch]=useState(""); const [filter,setFilter]=useState(""); const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState("");
 const load=async()=>{setLoading(true);setError("");try{const {data}=await api.get("/bookmarks");setItems(data.data||[])}catch(err){setError(err.response?.data?.message||"Unable to load bookmarks.")}finally{setLoading(false)}}; useEffect(()=>{load()},[]);
 const filtered=items.filter(b=>`${b.title} ${b.description||""} ${b.category||""} ${b.url||""}`.toLowerCase().includes(search.toLowerCase())&&(!filter||b.category===filter));
 const save=async payload=>{setSaving(true);setError("");try{if(editing){const {data}=await api.put(`/bookmarks/${editing._id}`,payload);setItems(prev=>prev.map(x=>x._id===editing._id?data.data:x))}else{const {data}=await api.post("/bookmarks",payload);setItems(prev=>[data.data,...prev])}setOpen(false);setEditing(null)}catch(err){setError(err.response?.data?.message||"Unable to save bookmark.")}finally{setSaving(false)}};
 const remove=async item=>{if(!window.confirm(`Delete "${item.title}"?`))return;try{await api.delete(`/bookmarks/${item._id}`);setItems(prev=>prev.filter(x=>x._id!==item._id))}catch(err){setError(err.response?.data?.message||"Unable to delete bookmark.")}};
 return <><PageHeader title="Bookmarks" description="Save the developer resources you use every day." action={<button className="btn-primary" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={17}/> Add Bookmark</button>}/>{error&&<AlertMessage message={error}/>}<Toolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={["Documentation","Tools","Tutorials","GitHub","APIs","Other"]} placeholder="Search bookmarks..."/><div className="card overflow-hidden">{loading?<LoadingState text="Loading bookmarks..."/>:filtered.length===0?<EmptyState title={items.length?"No matching bookmarks":"No bookmarks yet"} description={items.length?"Try another search or category filter.":"Save your first developer resource."} action={<button className="btn-primary" onClick={()=>setOpen(true)}><Plus size={17}/> Add Bookmark</button>}/>:<div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(b=><div className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-200" key={b._id}><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Bookmark size={18}/></div><span className="badge bg-blue-50 text-blue-700">{b.category}</span></div><h3 className="mt-5 font-bold text-slate-900">{b.title}</h3><p className="mt-1 min-h-10 text-sm text-slate-500">{b.description||"No description"}</p><a href={b.url} target="_blank" rel="noreferrer" className="mt-4 block truncate text-xs font-medium text-blue-600 hover:underline">{b.url}</a><div className="mt-5 flex gap-2"><button className="btn-secondary flex-1 px-3 py-2 text-xs" onClick={()=>{setEditing(b);setOpen(true)}}><Edit3 size={14}/> Edit</button><button className="icon-btn border border-slate-200" aria-label={`Delete ${b.title}`} onClick={()=>remove(b)}><Trash2 size={15}/></button></div></div>)}</div>}</div>{open&&<BookmarkModal item={editing} saving={saving} onClose={()=>{if(!saving){setOpen(false);setEditing(null)}}} onSave={save}/>}</>;
}

function BookmarkModal({item,saving,onClose,onSave}){const [form,setForm]=useState({title:item?.title||"",url:item?.url||"",description:item?.description||"",category:item?.category||"Other"});const set=(key,value)=>setForm(f=>({...f,[key]:value}));return <Modal title={item?"Edit Bookmark":"Add Bookmark"} onClose={onClose} footer={<><button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button><button className="btn-primary" form="bookmark-form" disabled={saving}>{saving?"Saving...":item?"Update Bookmark":"Save Bookmark"}</button></>}><form id="bookmark-form" onSubmit={e=>{e.preventDefault();onSave(form)}} className="space-y-4"><Field label="Title" value={form.title} onChange={v=>set("title",v)} required/><Field label="URL" value={form.url} onChange={v=>set("url",v)} placeholder="https://..." required/><Field label="Description" value={form.description} onChange={v=>set("description",v)}/><SelectField label="Category" value={form.category} options={["Documentation","Tools","Tutorials","GitHub","APIs","Other"]} onChange={v=>set("category",v)}/></form></Modal>}

function AnalyticsPage(){
 const [data,setData]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [period,setPeriod]=useState("weekly");
 useEffect(()=>{let mounted=true;setLoading(true);setError("");api.get("/analytics").then(({data:response})=>mounted&&setData(response.data)).catch(err=>mounted&&setError(err.response?.data?.message||"Unable to load analytics.")).finally(()=>mounted&&setLoading(false));return()=>{mounted=false}},[]);
 const weekly=data?.weekly||[]; const monthly=data?.monthly||[]; const chartData=period==="weekly"?weekly:monthly; const totalHours=data?.codingHours??0;
 if(loading) return <><PageHeader title="Analytics" description="Understand your development workflow and productivity trends."/><LoadingState text="Loading analytics..."/></>;
 if(error) return <><PageHeader title="Analytics" description="Understand your development workflow and productivity trends."/><AlertMessage message={error}/></>;
 return <><PageHeader title="Analytics" description="Understand your development workflow and productivity trends." action={<select className="input w-full sm:w-36" value={period} onChange={e=>setPeriod(e.target.value)}><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>}/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Tasks completed" value={data.completedTasks} change="Live" icon={CheckCircle2} tone="green"/><StatCard label="Tasks pending" value={data.pendingTasks} change="Live" icon={ClipboardList}/><StatCard label="Bugs resolved" value={data.resolvedBugs} change="Live" icon={Bug} tone="amber"/><StatCard label="Coding hours" value={`${totalHours}h`} change="Live" icon={Timer} tone="purple"/></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="card p-5 sm:p-6"><h2 className="font-bold">{period==="weekly"?"Weekly productivity":"Monthly productivity"}</h2><p className="mt-1 text-xs text-slate-500">Completed tasks and resolved bugs</p><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barGap={8}><CartesianGrid vertical={false} stroke="#e2e8f0"/><XAxis dataKey={period==="weekly"?"day":"label"} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #e2e8f0"}}/><Bar dataKey="tasksCompleted" name="Tasks completed" fill="#2563eb" radius={[6,6,0,0]}/><Bar dataKey="bugsResolved" name="Bugs resolved" fill="#f59e0b" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="card p-5 sm:p-6"><h2 className="font-bold">Coding hours</h2><p className="mt-1 text-xs text-slate-500">Daily focused development time this week</p><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly}><CartesianGrid vertical={false} stroke="#e2e8f0"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis allowDecimals={false} axisLine={false} tickLine={false}/><Tooltip formatter={(value)=>[`${value}h`,"Coding time"]} contentStyle={{borderRadius:12,border:"1px solid #e2e8f0"}}/><Area type="monotone" dataKey="codingHours" name="Coding hours" stroke="#7c3aed" strokeWidth={2.5} fill="#ede9fe"/></AreaChart></ResponsiveContainer></div></div></div></>;
}

function SettingsPage(){return <><PageHeader title="Settings" description="Manage your profile and workspace preferences."/><div className="grid gap-6 lg:grid-cols-[220px_1fr]"><div className="card p-2 h-fit">{["Profile","Preferences","Notifications","Security"].map((x,i)=><button key={x} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium ${i===0?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50"}`}>{x}</button>)}</div><div className="card p-5 sm:p-6"><h2 className="font-bold">Profile settings</h2><p className="mt-1 text-sm text-slate-500">Update your developer profile information.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="text-sm font-medium">Full name<input className="input mt-1.5" defaultValue="Daniyal Javadia"/></label><label className="text-sm font-medium">Email<input className="input mt-1.5" defaultValue="daniyal@example.com"/></label><label className="text-sm font-medium sm:col-span-2">Bio<textarea className="input mt-1.5 min-h-24" defaultValue="Full-stack developer building modern web applications."/></label></div><div className="mt-6 flex justify-end"><button className="btn-primary">Save changes</button></div></div></div></>}

function NotFoundPage(){return <div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md text-center"><p className="text-sm font-bold uppercase tracking-widest text-blue-600">404</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Page not found</h1><p className="mt-2 text-sm text-slate-500">The page you requested does not exist.</p><NavLink to="/dashboard" className="btn-primary mt-6">Back to dashboard</NavLink></div></div>}

function initials(name = "Developer") {
  return name.split(" ").filter(Boolean).slice(0,2).map(part => part[0]).join("").toUpperCase() || "DV";
}

export default App;