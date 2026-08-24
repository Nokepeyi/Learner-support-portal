import { useState } from "react";

type Screen =
  | "login"
  | "register"
  | "learner-dashboard"
  | "tasks-manager"
  | "assessor-dashboard"
  | "create-task";

// ── Icons (simple SVG line icons) ────────────────────────────────────────────

function IconHome({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconList({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconPlus({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconSupport({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconGame({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h4" />
      <path d="M8 10v4" />
      <circle cx="16" cy="12" r="1" />
      <circle cx="18" cy="10" r="1" />
    </svg>
  );
}

function IconLogout({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconUser({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMenu({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconEye({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCalendar({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconManage({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconSubmissions({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconLearners({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "In Progress": "bg-blue-100 text-blue-700 border border-blue-300",
    Submitted: "bg-green-50 text-green-700 border border-green-300",
    Pending: "bg-amber-50 text-amber-700 border border-amber-300",
    Completed: "bg-green-50 text-green-700 border border-green-300",
    Overdue: "bg-red-50 text-red-700 border border-red-300",
    Reviewed: "bg-purple-50 text-purple-700 border border-purple-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ── Layout: Sidebar ───────────────────────────────────────────────────────────

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  screen?: Screen;
};

function Sidebar({
  active,
  items,
  onNavigate,
  onLogout,
}: {
  active: Screen;
  items: SidebarItem[];
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="w-[200px] min-h-screen flex flex-col" style={{ backgroundColor: "#1E3A8A" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-blue-700">
        <span className="text-white font-bold text-sm tracking-widest uppercase">SKILLSTRACK</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-2">
        {items.map((item) => {
          const isActive = item.screen === active;
          return (
            <button
              key={item.label}
              onClick={() => item.screen && onNavigate(item.screen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm font-medium text-blue-300 hover:bg-blue-800 hover:text-white transition-colors"
        >
          <IconLogout />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ── Layout: Top Header ────────────────────────────────────────────────────────

function TopBar({ title, userName = "Learner Name" }: { title: string; userName?: string }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-blue-100">
      <div className="flex items-center gap-3">
        <button className="text-blue-900 hover:text-blue-700">
          <IconMenu />
        </button>
        <h1 className="text-base font-semibold text-blue-900">{title}</h1>
      </div>
      <button className="flex items-center gap-2 text-sm text-blue-900 font-medium hover:text-blue-700">
        <span className="w-8 h-8 rounded-full border-2 border-blue-200 flex items-center justify-center bg-blue-50 text-blue-600">
          <IconUser size={16} />
        </span>
        {userName}
        <IconChevronDown />
      </button>
    </header>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 bg-white border border-blue-100 rounded-lg p-5 flex flex-col items-center justify-center gap-1 min-w-[120px]">
      <span className="text-3xl font-bold text-blue-600">{value}</span>
      <span className="text-xs text-blue-900 font-medium text-center">{label}</span>
    </div>
  );
}

// ── Screen 1: Login ───────────────────────────────────────────────────────────

function LoginScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
      <div className="w-full max-w-sm bg-white border border-blue-100 rounded-xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-blue-600 tracking-widest uppercase mb-1">SKILLSTRACK</div>
          <div className="text-sm text-blue-400 font-medium">Unlock Your Future</div>
        </div>

        <h2 className="text-lg font-semibold text-blue-900 text-center mb-6">Login</h2>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 pr-9"
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500"
              >
                <IconEye />
              </button>
            </div>
          </div>

          <div className="text-right">
            <button className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</button>
          </div>

          <button
            onClick={() => onNavigate("learner-dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded text-sm tracking-wide transition-colors"
          >
            LOGIN
          </button>

          <div className="text-center text-xs text-blue-400">or</div>

          <p className="text-center text-xs text-blue-700">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Screen 2: Registration ────────────────────────────────────────────────────

function RegisterScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
      <div className="w-full max-w-sm bg-white border border-blue-100 rounded-xl shadow-sm p-8">
        <div className="text-center mb-5">
          <div className="text-2xl font-bold text-blue-600 tracking-widest uppercase mb-1">SKILLSTRACK</div>
          <div className="text-sm text-blue-500 font-medium">Create Your Account</div>
        </div>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Create a password"
                className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 pr-9"
              />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500">
                <IconEye />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showCpw ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 pr-9"
              />
              <button onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500">
                <IconEye />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-900 mb-1">Role</label>
            <div className="relative">
              <select className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 appearance-none">
                <option value="">Select your role</option>
                <option value="learner">Learner</option>
                <option value="assessor">Assessor</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                <IconChevronDown />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("learner-dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded text-sm tracking-wide transition-colors mt-1"
          >
            REGISTER
          </button>

          <p className="text-center text-xs text-blue-700">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-blue-600 font-semibold hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Shared sidebar items ──────────────────────────────────────────────────────

const learnerSidebarItems = (navigate: (s: Screen) => void): SidebarItem[] => [
  { icon: <IconHome />, label: "Dashboard", screen: "learner-dashboard" },
  { icon: <IconList />, label: "My Tasks", screen: "tasks-manager" },
  { icon: <IconPlus />, label: "Create Task", screen: "create-task" },
  { icon: <IconSupport />, label: "Support" },
  { icon: <IconGame />, label: "Mini Game" },
];

const assessorSidebarItems: SidebarItem[] = [
  { icon: <IconHome />, label: "Dashboard", screen: "assessor-dashboard" },
  { icon: <IconManage />, label: "Manage Tasks" },
  { icon: <IconSubmissions />, label: "Submissions" },
  { icon: <IconLearners />, label: "Learners" },
  { icon: <IconSupport />, label: "Support" },
];

// ── Screen 3: Learner Dashboard ───────────────────────────────────────────────

const recentTasks = [
  { title: "Build a Personal Portfolio", subject: "HTML/CSS", due: "2025-05-20", status: "In Progress" },
  { title: "JavaScript Calculator", subject: "JavaScript", due: "2025-05-22", status: "Submitted" },
  { title: "Firebase Auth System", subject: "Firebase", due: "2025-05-25", status: "Pending" },
];

function LearnerDashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EFF6FF" }}>
      <Sidebar
        active="learner-dashboard"
        items={learnerSidebarItems(onNavigate)}
        onNavigate={onNavigate}
        onLogout={() => onNavigate("login")}
      />
      <div className="flex-1 flex flex-col">
        <TopBar title="Learner Dashboard" />
        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Stat row */}
          <div className="flex gap-4">
            <StatCard value={8} label="Tasks Assigned" />
            <StatCard value={5} label="Tasks Completed" />
            <StatCard value={2} label="In Progress" />
            <StatCard value={3} label="Overdue" />
          </div>

          {/* Recent Tasks */}
          <div className="bg-white border border-blue-100 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100">
              <h2 className="text-sm font-semibold text-blue-900">Recent Tasks</h2>
              <button
                onClick={() => onNavigate("tasks-manager")}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-blue-800">Task Title</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Subject</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Due Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t, i) => (
                  <tr key={i} className="border-b border-blue-50 hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3 text-blue-900 font-medium">{t.title}</td>
                    <td className="px-4 py-3 text-blue-700">{t.subject}</td>
                    <td className="px-4 py-3 text-blue-600 font-mono text-xs">{t.due}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Announcements */}
          <div className="bg-white border border-blue-100 rounded-lg px-5 py-4">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">Announcements</h2>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>This is a sample announcement for learners.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Screen 4: Tasks Manager ───────────────────────────────────────────────────

const allTasks = [
  { title: "Build a Personal Portfolio", subject: "HTML/CSS", due: "2025-05-20", status: "In Progress" },
  { title: "JavaScript Calculator", subject: "JavaScript", due: "2025-05-22", status: "Submitted" },
  { title: "Firebase Auth System", subject: "Firebase", due: "2025-05-25", status: "Pending" },
  { title: "API Data Fetch Project", subject: "JavaScript", due: "2025-05-28", status: "In Progress" },
];

const filterTabs = ["All", "In Progress", "Submitted", "Completed", "Overdue"];

function TasksManager({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All" ? allTasks : allTasks.filter((t) => t.status === activeTab);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EFF6FF" }}>
      <Sidebar
        active="tasks-manager"
        items={learnerSidebarItems(onNavigate)}
        onNavigate={onNavigate}
        onLogout={() => onNavigate("login")}
      />
      <div className="flex-1 flex flex-col">
        <TopBar title="Tasks Manager" />
        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Filter tabs */}
          <div className="flex gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded text-xs font-semibold border transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-700 border-blue-200 hover:border-blue-400 hover:text-blue-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-blue-100 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-blue-800">Task Title</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Subject</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Due Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={i} className="border-b border-blue-50 hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3 text-blue-900 font-medium">{t.title}</td>
                    <td className="px-4 py-3 text-blue-700">{t.subject}</td>
                    <td className="px-4 py-3 text-blue-600 font-mono text-xs">{t.due}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 text-xs font-semibold border border-blue-300 rounded text-blue-700 hover:bg-blue-50 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-blue-400">
                      No tasks match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Create button */}
          <div className="flex justify-center">
            <button
              onClick={() => onNavigate("create-task")}
              className="flex items-center gap-2 px-5 py-2 border-2 border-blue-300 text-blue-700 font-semibold text-sm rounded hover:bg-blue-50 transition-colors"
            >
              <IconPlus size={14} />
              Create New Task
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Screen 5: Assessor Dashboard ──────────────────────────────────────────────

const recentSubmissions = [
  { learner: "John Doe", task: "JavaScript Calculator", submitted: "2025-05-21", status: "Pending" },
  { learner: "Jane Smith", task: "Build a Personal Portfolio", submitted: "2025-05-20", status: "Reviewed" },
  { learner: "Mike Johnson", task: "Firebase Auth System", submitted: "2025-05-19", status: "Pending" },
];

function AssessorDashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EFF6FF" }}>
      <Sidebar
        active="assessor-dashboard"
        items={assessorSidebarItems}
        onNavigate={onNavigate}
        onLogout={() => onNavigate("login")}
      />
      <div className="flex-1 flex flex-col">
        <TopBar title="Assessor Dashboard" userName="Assessor Name" />
        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Stat row */}
          <div className="flex gap-4">
            <StatCard value={12} label="Total Learners" />
            <StatCard value={18} label="Tasks Created" />
            <StatCard value={27} label="Submissions" />
            <StatCard value={10} label="Pending Review" />
          </div>

          {/* Recent Submissions */}
          <div className="bg-white border border-blue-100 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-100">
              <h2 className="text-sm font-semibold text-blue-900">Recent Submissions</h2>
              <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-blue-800">Learner</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Task</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Submitted On</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-blue-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((s, i) => (
                  <tr key={i} className="border-b border-blue-50 hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3 text-blue-900 font-medium">{s.learner}</td>
                    <td className="px-4 py-3 text-blue-700">{s.task}</td>
                    <td className="px-4 py-3 text-blue-600 font-mono text-xs">{s.submitted}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Announcements */}
          <div className="bg-white border border-blue-100 rounded-lg px-5 py-4">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">Announcements</h2>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>This is a sample announcement for assessors.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Screen 6: Create Task ─────────────────────────────────────────────────────

function CreateTask({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EFF6FF" }}>
      <Sidebar
        active="create-task"
        items={learnerSidebarItems(onNavigate)}
        onNavigate={onNavigate}
        onLogout={() => onNavigate("login")}
      />
      <div className="flex-1 flex flex-col">
        <TopBar title="Create Task" />
        <main className="flex-1 p-6">
          <div className="bg-white border border-blue-100 rounded-lg p-6 max-w-2xl">
            <div className="flex flex-col gap-5">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1.5">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1.5">Subject</label>
                <div className="relative">
                  <select className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 appearance-none">
                    <option value="">Select subject</option>
                    <option>HTML/CSS</option>
                    <option>JavaScript</option>
                    <option>Firebase</option>
                    <option>React</option>
                    <option>Node.js</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <IconChevronDown />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1.5">Description</label>
                <textarea
                  placeholder="Enter task description"
                  rows={4}
                  className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 resize-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1.5">Due Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 pr-9"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-300">
                    <IconCalendar />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1.5">
                  Attachments <span className="font-normal text-blue-400">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-blue-200 rounded-lg px-5 py-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <p className="text-sm text-blue-400">Drag and drop files here or click to upload</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-1">
                <button
                  onClick={() => onNavigate("tasks-manager")}
                  className="px-5 py-2 border border-blue-300 rounded text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onNavigate("tasks-manager")}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold text-white transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Screen Switcher bar (for demo navigation) ─────────────────────────────────

const screenLabels: { screen: Screen; label: string }[] = [
  { screen: "login", label: "1. Login" },
  { screen: "register", label: "2. Registration" },
  { screen: "learner-dashboard", label: "3. Learner Dashboard" },
  { screen: "tasks-manager", label: "4. Tasks Manager" },
  { screen: "assessor-dashboard", label: "5. Assessor Dashboard" },
  { screen: "create-task", label: "6. Create Task" },
];

function ScreenNav({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-white border border-blue-200 rounded-full px-3 py-2 shadow-lg">
      {screenLabels.map(({ screen, label }) => (
        <button
          key={screen}
          onClick={() => onNavigate(screen)}
          title={label}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            current === screen
              ? "bg-blue-600 text-white"
              : "text-blue-600 hover:bg-blue-50"
          }`}
        >
          {label.split(".")[0].trim()}
        </button>
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <>
      {screen === "login" && <LoginScreen onNavigate={setScreen} />}
      {screen === "register" && <RegisterScreen onNavigate={setScreen} />}
      {screen === "learner-dashboard" && <LearnerDashboard onNavigate={setScreen} />}
      {screen === "tasks-manager" && <TasksManager onNavigate={setScreen} />}
      {screen === "assessor-dashboard" && <AssessorDashboard onNavigate={setScreen} />}
      {screen === "create-task" && <CreateTask onNavigate={setScreen} />}
      <ScreenNav current={screen} onNavigate={setScreen} />
    </>
  );
}
