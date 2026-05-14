import { useLocation } from "react-router";

const CognifyLogo = () => (
  <div className="flex items-center justify-center gap-3">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" fill="white" fillOpacity="0.9" />
        <path d="M10 6L14 8.5V13.5L10 16L6 13.5V8.5L10 6Z" fill="white" fillOpacity="0.35" />
      </svg>
    </div>
    <span
      className="text-white text-xl font-bold tracking-wide"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      Cognify
    </span>
  </div>
);

export default function Verify() {
  const location = useLocation();
  const email = location.state?.email;

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
        className="relative z-10 w-full max-w-sm rounded-2xl p-8 text-center"
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
          @keyframes pulse-ring {
            0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
            70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(124,58,237,0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0); }
          }
        `}</style>

        {/* Logo */}
        <div className="mb-8">
          <CognifyLogo />
        </div>

        {/* Animated email icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))",
              border: "1px solid rgba(139,92,246,0.3)",
              animation: "pulse-ring 2.4s ease-in-out infinite",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#emailGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="emailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#67e8f9" />
                </linearGradient>
              </defs>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-white text-2xl font-bold mb-2 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Check your email
        </h1>
        <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
          We've sent a verification link to:
        </p>

        {/* Email pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 text-sm font-medium"
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#c4b5fd",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {email ?? "your email address"}
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-5" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* Info text */}
        <p className="text-zinc-500 text-xs leading-relaxed mb-6">
          Didn't receive it? Check your spam folder or{" "}
          <button
            type="button"
            className="transition-opacity hover:opacity-80"
            style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "inherit" }}
          >
            resend the email
          </button>
          .
        </p>

        {/* Back to login */}
        <a
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-95"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#d4d4d8",
            fontFamily: "'Syne', sans-serif",
            textDecoration: "none",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to sign in
        </a>
      </div>
    </div>
  );
}