export const tasks = [
  { id: 1, title: "Fix login responsive UI", priority: "High", status: "In Progress", dueDate: "Today", category: "Frontend" },
  { id: 2, title: "Implement JWT authentication", priority: "High", status: "Todo", dueDate: "Sep 23", category: "Backend" },
  { id: 3, title: "Optimize SQL queries", priority: "Medium", status: "Completed", dueDate: "Sep 22", category: "Database" },
  { id: 4, title: "Create analytics widgets", priority: "Low", status: "Todo", dueDate: "Sep 25", category: "Frontend" },
  { id: 5, title: "Review API error handling", priority: "Medium", status: "Completed", dueDate: "Sep 21", category: "Backend" }
];

export const snippets = [
  { id: 1, title: "Axios API Client", language: "JavaScript", tags: ["axios", "api"], description: "Reusable Axios instance with environment-based URL.", code: 'const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });' },
  { id: 2, title: "React Fetch Hook", language: "React", tags: ["hooks", "fetch"], description: "Small pattern for loading remote data.", code: 'useEffect(() => { fetch("/api/tasks").then(r => r.json()).then(setData); }, []);' },
  { id: 3, title: "SQL Latest Record", language: "SQL", tags: ["sql", "query"], description: "Get the latest record by timestamp.", code: 'SELECT TOP 1 * FROM orders ORDER BY created_on DESC;' }
];

export const bugs = [
  { id: 1, title: "Mobile sidebar overlaps content", priority: "High", status: "In Progress", project: "DevFlow", assignedTo: "Daniyal" },
  { id: 2, title: "Session timer resets on refresh", priority: "Critical", status: "Open", project: "DevFlow", assignedTo: "Daniyal" },
  { id: 3, title: "Empty state alignment issue", priority: "Low", status: "Resolved", project: "Dashboard", assignedTo: "Daniyal" }
];

export const notes = [
  { id: 1, title: "React Interview Notes", content: "Hooks, props, state, component lifecycle and API integration patterns.", tags: ["react", "interview"], pinned: true },
  { id: 2, title: "Useful SQL Queries", content: "Keep common JOIN, GROUP BY, date filtering and pagination queries here.", tags: ["sql"], pinned: false },
  { id: 3, title: "Deployment Checklist", content: "Environment variables, production build, database connection and API health check.", tags: ["deployment"], pinned: false }
];

export const bookmarks = [
  { id: 1, title: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Web platform reference.", category: "Documentation" },
  { id: 2, title: "React Docs", url: "https://react.dev", description: "Official React documentation.", category: "Documentation" },
  { id: 3, title: "GitHub", url: "https://github.com", description: "Repositories and developer collaboration.", category: "GitHub" }
];

export const weeklyHours = [
  { day: "Mon", hours: 4.2 }, { day: "Tue", hours: 6.1 }, { day: "Wed", hours: 5.4 },
  { day: "Thu", hours: 7.0 }, { day: "Fri", hours: 4.8 }, { day: "Sat", hours: 3.6 }, { day: "Sun", hours: 2.4 }
];

export const activity = [
  { text: 'Completed "Fix login responsive UI"', time: "12 min ago", icon: "check" },
  { text: "Added new code snippet", time: "42 min ago", icon: "code" },
  { text: "Created a bug: Mobile sidebar overlaps content", time: "1 hr ago", icon: "bug" },
  { text: "Completed 2-hour coding session", time: "3 hrs ago", icon: "clock" }
];