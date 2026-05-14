import { useState } from "react";
import useAuth  from "../hooks/authhook";
import { useNavigate } from "react-router";

const CognifyLogo = () => (
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" fill="white" fillOpacity="0.9" />
        <path d="M10 6L14 8.5V13.5L10 16L6 13.5V8.5L10 6Z" fill="white" fillOpacity="0.35" />
      </svg>
    </div>
    <span className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>
      Cognify
    </span>
  </div>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  
  
  const navigate = useNavigate();
  const {handleLogin} = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({email : form.email,
      password : form.password})

     navigate("/dashboard");
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-zinc-950">

      {/* Mesh background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,58,199,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(20,184,166,0.12) 0%, transparent 55%)",
        }}
      />
      {/* Grid lines */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "rgba(18,18,22,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          animation: "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .cognify-input {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            color: #f4f4f5;
            outline: none;
            width: 100%;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 14px;
            transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
            font-family: 'DM Sans', sans-serif;
          }
          .cognify-input::placeholder { color: rgba(255,255,255,0.28); }
          .cognify-input:focus {
            border-color: rgba(139,92,246,0.6);
            background: rgba(139,92,246,0.05);
            box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
          }
          .oauth-btn {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            color: #d4d4d8;
            border-radius: 10px;
            padding: 11px;
            font-size: 13px;
            cursor: pointer;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.2s, border-color 0.2s;
            font-family: 'DM Sans', sans-serif;
          }
          .oauth-btn:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.2);
          }
        `}</style>

        {/* Logo */}
        <div className="mb-8">
          <CognifyLogo />
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1
            className="text-white text-2xl font-bold mb-1 leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-zinc-400 text-sm">Sign in to your Cognify workspace</p>
        </div>

        {/* OAuth */}
        <div className="space-y-2 mb-5">
          <button type="button" className="oauth-btn">
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="oauth-btn">
            <GitHubIcon /> Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>or sign in with email</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-2 font-medium">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="cognify-input"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-zinc-400 font-medium">Password</label>
              <a href="#" className="text-xs" style={{ color: "#a78bfa" }}>
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="cognify-input"
                style={{ paddingRight: "42px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-violet-500"
            />
            <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-95"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 0 24px rgba(124,58,237,0.35)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Sign in to Cognify
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          No account yet?{" "}
          <a href="/register" style={{ color: "#a78bfa" }} className="hover:opacity-80 transition-opacity">
            Create one free
          </a>
        </p>
      </div>
    </div>
  );
}