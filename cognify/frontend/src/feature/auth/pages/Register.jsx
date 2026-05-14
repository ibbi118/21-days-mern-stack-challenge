import { useState } from "react";
import useAuth  from "../hooks/authhook";
import { useNavigate } from "react-router";

const CognifyLogo = () => (
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #0891b2, #7c3aed)" }}
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

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Weak", color: "#ef4444" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f59e0b" },
    { label: "Good", color: "#3b82f6" },
    { label: "Strong", color: "#10b981" },
  ];
  return { score, ...map[score] };
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!form.terms) return alert("Please accept the terms to continue.");
    
    await handleRegister({
      username: `${form.firstName} ${form.lastName}`,
      email: form.email,
      password: form.password,
    });
   navigate("/verify");
  };

  const segmentColor = (i) => {
    if (i < strength.score) return strength.color;
    return "rgba(255,255,255,0.1)";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-zinc-950">

      {/* Mesh background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 80% 10%, rgba(6,182,212,0.14) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 85%, rgba(124,58,237,0.16) 0%, transparent 55%)",
        }}
      />
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
            border-color: rgba(6,182,212,0.6);
            background: rgba(6,182,212,0.04);
            box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
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
        <div className="mb-7">
          <CognifyLogo />
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h1
            className="text-white text-2xl font-bold mb-1 leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Create your account
          </h1>
          <p className="text-zinc-400 text-sm">Start thinking smarter with Cognify AI</p>
        </div>

        {/* Plan badges */}
        <div className="flex gap-2 mb-5">
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: "rgba(6,182,212,0.12)",
              color: "#67e8f9",
              border: "1px solid rgba(6,182,212,0.25)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Free plan
          </span>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: "rgba(124,58,237,0.12)",
              color: "#c4b5fd",
              border: "1px solid rgba(124,58,237,0.25)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            No credit card
          </span>
        </div>

        {/* OAuth */}
        <div className="mb-5">
          <button type="button" className="oauth-btn">
            <GoogleIcon /> Sign up with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>or register with email</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-2 font-medium">First name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className="cognify-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2 font-medium">Last name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="cognify-input"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password + strength */}
          <div>
            <label className="block text-xs text-zinc-400 mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
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
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Strength meter */}
            <div className="flex gap-1 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: segmentColor(i) }}
                />
              ))}
            </div>
            {form.password && (
              <p className="text-xs mt-1 transition-colors duration-300" style={{ color: strength.color }}>
                {strength.label} password
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 flex-shrink-0 accent-cyan-500"
            />
            <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed cursor-pointer">
              I agree to Cognify's{" "}
              <a href="#" style={{ color: "#67e8f9" }} className="hover:opacity-80 transition-opacity">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={{ color: "#67e8f9" }} className="hover:opacity-80 transition-opacity">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-95"
            style={{
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              boxShadow: "0 0 24px rgba(8,145,178,0.3)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Create free account
          </button>
        </form>

        {/* Stats strip */}
        <div
          className="flex justify-between mt-6 pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            { stat: "1M+", label: "tokens / mo" },
            { stat: "Fast", label: "responses" },
            { stat: "No ads", label: "ever" },
          ].map(({ stat, label }, i) => (
            <div key={i} className="text-center">
              <p className="text-xs font-medium text-zinc-300" style={{ fontFamily: "'Syne', sans-serif" }}>
                {stat}
              </p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5">
          Already have an account?{" "}
          <a href="/login" style={{ color: "#67e8f9" }} className="hover:opacity-80 transition-opacity">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}