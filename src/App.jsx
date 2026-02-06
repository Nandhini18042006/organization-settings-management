import React, { useState, useEffect } from "react";

const roles = [
  {
    name: "Super Admin",
    description: "Full control over the LMS: tenants, security, billing and global configuration.",
    accent: "from-amber-400/80 via-rose-500/80 to-brand-500/80"
  },
  {
    name: "Admin / HR",
    description: "Manage users, assign learning paths and track organization-wide progress.",
    accent: "from-emerald-400/80 via-teal-500/80 to-brand-500/80"
  },
  {
    name: "Trainer",
    description: "Design courses, schedule sessions and evaluate learner performance.",
    accent: "from-sky-400/80 via-cyan-500/80 to-brand-500/80"
  },
  {
    name: "Learner",
    description: "Consume content, complete assessments and grow skills at your own pace.",
    accent: "from-violet-400/80 via-brand-500/80 to-fuchsia-500/80"
  }
];

const highlights = [
  {
    label: "Performance",
    text: "Pages optimized to load in under 3 seconds even with thousands of active learners."
  },
  {
    label: "Security",
    text: "JWT-based authentication, role-based access and strict input validation by default."
  },
  {
    label: "Usability",
    text: "A clean, responsive interface designed to stay out of your way and let learning flow."
  }
];

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  "admin@lms.com": { password: "admin123", role: "Admin / HR", name: "Admin User" },
  "superadmin@lms.com": { password: "super123", role: "Super Admin", name: "Super Admin" },
  "trainer@lms.com": { password: "trainer123", role: "Trainer", name: "Trainer User" }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [settings, setSettings] = useState({
    orgName: "",
    brandColor: "#3b6dff",
    learningPolicy: "Self-paced with soft deadlines",
    concurrentUsers: 5000,
    jwtSSO: true,
    strongPasswords: true
  });
  const [saveStatus, setSaveStatus] = useState(""); // "saving", "saved", "error"

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("lms_settings");
    const savedAuth = localStorage.getItem("lms_auth");
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsLoggedIn(true);
        setUser(authData);
      } catch (e) {
        console.error("Failed to load auth:", e);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    
    const credentials = DEMO_CREDENTIALS[loginForm.email.toLowerCase()];
    
    if (credentials && credentials.password === loginForm.password) {
      const userData = {
        email: loginForm.email.toLowerCase(),
        role: credentials.role,
        name: credentials.name
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginForm({ email: "", password: "" });
      
      // Save auth to localStorage
      localStorage.setItem("lms_auth", JSON.stringify(userData));
    } else {
      setLoginError("Invalid email or password. Try: admin@lms.com / admin123");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("lms_auth");
  };

  const handleSaveSettings = () => {
    setSaveStatus("saving");
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        localStorage.setItem("lms_settings", JSON.stringify(settings));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (e) {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }, 500);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      orgName: "",
      brandColor: "#3b6dff",
      learningPolicy: "Self-paced with soft deadlines",
      concurrentUsers: 5000,
      jwtSSO: true,
      strongPasswords: true
    };
    setSettings(defaultSettings);
    localStorage.setItem("lms_settings", JSON.stringify(defaultSettings));
  };

  const canEditSettings = isLoggedIn && (user?.role === "Super Admin" || user?.role === "Admin / HR");
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute top-40 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-[999px] bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Shell */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        {/* Top navigation */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-violet-500 shadow-lg shadow-brand-900/70">
              <span className="text-lg font-black tracking-tight text-slate-950">L</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-100">
                Lumina LMS
              </p>
              <p className="text-xs text-slate-400">
                Organization & Settings Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            {isLoggedIn ? (
              <>
                <div className="hidden items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 ring-1 ring-slate-700/80 sm:flex">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-200">{user?.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-900/80 px-3 py-1.5 text-slate-200 ring-1 ring-slate-700/80 transition hover:bg-slate-800 hover:ring-slate-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="hidden rounded-full border border-slate-700/80 px-3 py-1.5 text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/80 sm:inline-flex">
                  Product Tour
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="rounded-full bg-slate-900/80 px-3 py-1.5 text-slate-200 ring-1 ring-slate-700/80 transition hover:bg-slate-800 hover:ring-slate-500"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </header>

        {/* Main grid */}
        <main className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
          {/* Left: hero & highlights */}
          <section className="glass-panel relative flex flex-col justify-between px-5 py-6 sm:px-8 sm:py-8">
            {/* Floating accent */}
            <div className="pointer-events-none absolute -top-10 right-10 hidden h-28 w-28 rotate-6 rounded-3xl bg-gradient-to-br from-emerald-400/40 via-brand-500/40 to-fuchsia-500/40 blur-2xl sm:block" />

            <div className="space-y-5 sm:space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700/80">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                RBAC-first · JWT Secure · Org-wide Policies
              </div>

              <div>
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.6rem]">
                  Configure your entire{" "}
                  <span className="bg-gradient-to-r from-brand-200 via-emerald-200 to-fuchsia-200 bg-clip-text text-transparent">
                    learning organization
                  </span>{" "}
                  from one beautiful workspace.
                </h1>
                <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-[0.95rem]">
                  Set up your organization profile, branding and learning policies once.
                  The LMS automatically applies them across all admins, trainers and learners.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      // Scroll to settings section
                      document.querySelector('[class*="Organization Settings"]')?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-900/50 transition hover:brightness-110"
                  >
                    <span>Go to Settings</span>
                    <span className="transition-transform group-hover:translate-x-0.5">↓</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-900/50 transition hover:brightness-110"
                  >
                    <span>Launch Organization Console</span>
                    <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                  </button>
                )}
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/40 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live preview with sample data
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 grid gap-3 border-t border-slate-800/80 pt-5 text-xs text-slate-300 sm:grid-cols-3 sm:text-[0.78rem]">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/40 px-3 py-3"
                >
                  <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-[0.75rem] leading-relaxed text-slate-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Right: roles & quick settings */}
          <section className="space-y-4 lg:space-y-5">
            <div className="glass-panel px-4 py-4 sm:px-5 sm:py-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Access Control
                  </p>
                  <p className="text-sm font-medium text-slate-100">
                    Role-Based Access (RBAC)
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-500/30">
                  Secure by Design
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => (
                  <article
                    key={role.name}
                    className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs text-slate-200 shadow-md shadow-slate-950/60"
                  >
                    <div
                      className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${role.accent} opacity-70 blur-2xl`}
                    />
                    <div className="relative flex items-center justify-between gap-2">
                      <h3 className="text-[0.8rem] font-semibold text-slate-50">
                        {role.name}
                      </h3>
                      <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[0.65rem] text-slate-300 ring-1 ring-slate-700/80">
                        Active
                      </span>
                    </div>
                    <p className="relative mt-1 text-[0.72rem] leading-relaxed text-slate-300">
                      {role.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="glass-panel px-4 py-4 sm:px-5 sm:py-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Organization Settings
                  </p>
                  <p className="text-sm font-medium text-slate-100">
                    Profile, Branding & Policies
                  </p>
                </div>
                <span className="rounded-full bg-brand-500/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-100 ring-1 ring-brand-400/30">
                  Guided Setup
                </span>
              </div>

              {!canEditSettings && (
                <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[0.72rem] text-amber-200">
                  <p className="font-semibold">🔒 Admin Access Required</p>
                  <p className="mt-1 text-amber-300/80">
                    Please sign in as Admin or Super Admin to edit organization settings.
                  </p>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-medium text-slate-300">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Learning Group"
                      value={settings.orgName}
                      onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                      disabled={!canEditSettings}
                      className="w-full rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-slate-950 focus:ring-1 focus:ring-brand-500/70 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-medium text-slate-300">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.brandColor}
                        onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                        disabled={!canEditSettings}
                        className="h-8 w-10 cursor-pointer rounded-lg border border-slate-700 bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <input
                        type="text"
                        value={settings.brandColor}
                        onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                        disabled={!canEditSettings}
                        className="flex-1 rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950 focus:ring-1 focus:ring-brand-500/70 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-medium text-slate-300">
                      Default Learning Policy
                    </label>
                    <select
                      value={settings.learningPolicy}
                      onChange={(e) => setSettings({ ...settings, learningPolicy: e.target.value })}
                      disabled={!canEditSettings}
                      className="w-full cursor-pointer rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950 focus:ring-1 focus:ring-brand-500/70 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option>Self-paced with soft deadlines</option>
                      <option>Strict deadlines with manager approval</option>
                      <option>Compliance-first (mandatory for all users)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-medium text-slate-300">
                      Concurrent User Limit
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={settings.concurrentUsers}
                      onChange={(e) => setSettings({ ...settings, concurrentUsers: parseInt(e.target.value) || 0 })}
                      disabled={!canEditSettings}
                      className="w-full rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-brand-400 focus:bg-slate-950 focus:ring-1 focus:ring-brand-500/70 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2 text-[0.72rem] text-slate-400">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950/60 px-2.5 py-1 ring-1 ring-slate-800/80">
                      <input
                        type="checkbox"
                        checked={settings.jwtSSO}
                        onChange={(e) => setSettings({ ...settings, jwtSSO: e.target.checked })}
                        disabled={!canEditSettings}
                        className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span>Enforce JWT-based SSO for admins</span>
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950/60 px-2.5 py-1 ring-1 ring-slate-800/80">
                      <input
                        type="checkbox"
                        checked={settings.strongPasswords}
                        onChange={(e) => setSettings({ ...settings, strongPasswords: e.target.checked })}
                        disabled={!canEditSettings}
                        className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span>Require strong passwords for all users</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 text-[0.72rem]">
                    <button
                      onClick={handleResetSettings}
                      disabled={!canEditSettings}
                      className="rounded-full border border-slate-700/80 px-3 py-1.5 text-slate-300 transition hover:border-slate-500 hover:bg-slate-900/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={!canEditSettings || saveStatus === "saving"}
                      className="relative rounded-full bg-brand-500 px-4 py-1.5 font-semibold text-slate-950 shadow shadow-brand-900/60 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saveStatus === "saving" && "Saving..."}
                      {saveStatus === "saved" && "✓ Saved!"}
                      {saveStatus === "error" && "✗ Error"}
                      {!saveStatus && "Save settings"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-5 flex items-center justify-between gap-3 text-[0.7rem] text-slate-500">
          <p>© {new Date().getFullYear()} Lumina LMS · Designed for modern organizations.</p>
          <p className="hidden sm:block">
            Built with React, Vite, Tailwind, Node.js, Express & MongoDB-ready APIs.
          </p>
        </footer>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
          onClick={() => {
            setShowLoginModal(false);
            setLoginError("");
          }}
        >
          <div
            className="glass-panel w-full max-w-md px-6 py-6 sm:px-8 sm:py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-50">Sign In</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Access your organization settings
                </p>
              </div>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                }}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@lms.com"
                  required
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-slate-950 focus:ring-2 focus:ring-brand-500/50"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-slate-950 focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              {loginError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {loginError}
                </div>
              )}

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 px-3 py-2.5 text-[0.7rem] text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">Demo Credentials:</p>
                <p>• Admin: admin@lms.com / admin123</p>
                <p>• Super Admin: superadmin@lms.com / super123</p>
                <p>• Trainer: trainer@lms.com / trainer123</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-900/50 transition hover:brightness-110"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;