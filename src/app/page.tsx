"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormMessage {
  text: string;
  type: "success" | "error" | "";
}

// ─── Hero Carousel Data ───────────────────────────────────────────────────────

const SLIDES = [
  {
    bg: "linear-gradient(135deg,rgba(15,23,42,.95) 0%,rgba(15,23,42,.6) 100%), url('/hero-bg.png') center/cover no-repeat",
  },
  {
    bg: "linear-gradient(135deg,rgba(15,23,42,.95) 0%,rgba(15,23,42,.6) 100%), url('/hero-bg-2.png') center/cover no-repeat",
  },
  {
    bg: "linear-gradient(135deg,rgba(15,23,42,.95) 0%,rgba(15,23,42,.6) 100%), url('/hero-bg-3.png') center/cover no-repeat",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [slideIndex, setSlideIndex] = useState(0);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("teacher");
  const [loginMsg, setLoginMsg] = useState<FormMessage>({ text: "", type: "" });
  const [regMsg, setRegMsg] = useState<FormMessage>({ text: "", type: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll effect for navbar
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    const timer = setInterval(
      () => setSlideIndex((i) => (i + 1) % SLIDES.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  // ── Login Handler ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setLoginMsg({ text: `✓ Welcome back! Redirecting to portal…`, type: "success" });
        setTimeout(() => (window.location.href = "/dashboard"), 1200);
      } else {
        setLoginMsg({ text: data.error ?? "Login failed.", type: "error" });
      }
    } catch {
      setLoginMsg({ text: "Cannot reach server. Please try again.", type: "error" });
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register Handler ───────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role: regRole,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setRegMsg({ text: "✓ Account created! You can now log in.", type: "success" });
        setTimeout(() => {
          setActiveTab("login");
          setRegMsg({ text: "", type: "" });
        }, 2500);
      } else {
        setRegMsg({ text: data.error ?? "Registration failed.", type: "error" });
      }
    } catch {
      setRegMsg({ text: "Cannot reach server. Please try again.", type: "error" });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap');
        :root {
          --clr-bg:#0f172a; --clr-surface:#1e293b;
          --clr-primary:#8b5cf6; --clr-secondary:#3b82f6; --clr-accent:#10b981;
          --gradient: linear-gradient(135deg,#8b5cf6,#3b82f6);
          --radius-lg:1.5rem; --radius-full:9999px;
          --transition: 0.25s cubic-bezier(.4,0,.2,1);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Inter',sans-serif;background:var(--clr-bg);color:#fff;overflow-x:hidden}
        h1,h2,h3,h4,h5{font-family:'Outfit',sans-serif;line-height:1.2;font-weight:700}
        a{color:inherit;text-decoration:none}
        input,select,button{font-family:inherit}
        .text-grad {
          background:var(--gradient);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .btn {
          display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
          padding:.75rem 1.5rem;border-radius:var(--radius-full);
          font-weight:600;font-size:.95rem;cursor:pointer;border:2px solid transparent;
          transition:all var(--transition);
        }
        .btn-primary{background:var(--gradient);color:#fff;box-shadow:0 4px 15px rgba(139,92,246,.25)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 30px rgba(139,92,246,.4)}
        .btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .btn-outline{background:transparent;border-color:rgba(255,255,255,.2);color:#fff}
        .btn-outline:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.4)}

        /* ── Navrbar ── */
        .navbar {
          position:fixed;top:0;left:0;width:100%;z-index:1000;
          padding:1rem 0;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(255,255,255,.06);
          transition:background var(--transition), box-shadow var(--transition);
        }
        .container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
        .nav-content{display:flex;align-items:center;justify-content:space-between}
        .logo{display:flex;align-items:center;gap:.5rem;font-size:1.4rem;font-weight:800;font-family:'Outfit',sans-serif}
        .logo-icon{font-size:1.8rem;color:var(--clr-primary)}
        .nav-links{display:flex;gap:2rem}
        .nav-links a{font-size:.9rem;font-weight:500;color:#94a3b8;transition:color var(--transition)}
        .nav-links a:hover{color:#fff}
        .nav-actions{display:flex;gap:.75rem}
        .btn-sm{padding:.5rem 1.2rem;font-size:.85rem}

        /* ── Mobile Menu ── */
        .menu-toggle{display:none;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;padding:.25rem}
        .mobile-menu{
          position:fixed;top:73px;left:0;width:100%;background:var(--clr-bg);z-index:999;
          padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem;
          transform:translateY(-100%);opacity:0;
          transition:transform .3s ease, opacity .3s ease;pointer-events:none;
          border-bottom:1px solid rgba(255,255,255,.06);
        }
        .mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:all}
        .mobile-link{font-size:1.1rem;font-weight:500;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.07)}

        /* ── Hero ── */
        .hero{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden}
        .hero-slide{
          position:absolute;inset:0;opacity:0;
          transition:opacity 1.5s ease-in-out;
        }
        .hero-slide.active{opacity:1;animation:zoomPan 30s infinite alternate ease-in-out}
        @keyframes zoomPan{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.1) translate(-2%,2%)}}
        .hero-glow{
          position:absolute;top:-20%;right:-10%;width:600px;height:600px;
          background:radial-gradient(circle,rgba(139,92,246,.3) 0%,transparent 70%);
          filter:blur(80px);pointer-events:none;
        }
        .hero-content{
          position:relative;z-index:5;
          display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;padding:140px 0 80px;
        }

        .badge{
          display:inline-flex;align-items:center;gap:.5rem;
          padding:.4rem 1rem;border-radius:var(--radius-full);
          background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);
          color:var(--clr-accent);font-size:.82rem;font-weight:600;margin-bottom:1.5rem;
        }
        .badge-dot{
          width:8px;height:8px;border-radius:50%;background:var(--clr-accent);
          animation:pulse 2s infinite;box-shadow:0 0 8px var(--clr-accent);
        }
        @keyframes pulse{0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(16,185,129,.7)}70%{transform:scale(1);box-shadow:0 0 0 6px rgba(16,185,129,0)}100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(16,185,129,0)}}

        .hero-title{font-size:clamp(2.2rem,5vw,3.8rem);letter-spacing:-1px;margin-bottom:1.25rem;line-height:1.15}
        .hero-subtitle{font-size:1.1rem;color:#94a3b8;margin-bottom:2rem;line-height:1.7;max-width:480px}
        .hero-trust{display:flex;align-items:center;gap:1rem;font-size:.88rem;color:#94a3b8}
        .avatars{display:flex}
        .avatars img{width:38px;height:38px;border-radius:50%;border:2px solid var(--clr-bg);margin-left:-12px;object-fit:cover}
        .avatars img:first-child{margin-left:0}
        .avatar-more{width:38px;height:38px;border-radius:50%;background:var(--clr-surface);border:2px solid var(--clr-bg);display:flex;align-items:center;justify-content:center;margin-left:-12px;font-size:.75rem;font-weight:700;z-index:1}

        /* ── Auth Card ── */
        .auth-card{
          background:rgba(30,41,59,.75);
          border:1px solid rgba(255,255,255,.12);
          border-radius:var(--radius-lg);
          backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
          box-shadow:0 25px 80px rgba(0,0,0,.5);
          overflow:hidden;
          transform:perspective(1000px) rotateY(-3deg) rotateX(2deg);
          transition:transform .5s cubic-bezier(.4,0,.2,1), box-shadow .5s;
        }
        .auth-card:hover{transform:perspective(1000px) rotateY(0deg) rotateX(0deg);box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 40px rgba(139,92,246,.25)}

        .auth-tabs{display:flex;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(255,255,255,.07)}
        .auth-tab{
          flex:1;padding:1.1rem;background:none;border:none;border-bottom:3px solid transparent;
          color:#64748b;font-size:.95rem;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:.5px;
        }
        .auth-tab:hover{background:rgba(255,255,255,.04);color:#cbd5e1}
        .auth-tab.active{color:var(--clr-primary);border-bottom-color:var(--clr-primary);background:rgba(139,92,246,.06)}

        .auth-body{padding:2rem 2.25rem 2.25rem}
        .auth-body h3{font-size:1.5rem;margin-bottom:.35rem}
        .auth-body .subtitle{color:#64748b;font-size:.88rem;margin-bottom:1.5rem}

        .form-group{display:flex;flex-direction:column;gap:.4rem;margin-bottom:1rem}
        .form-group label{font-size:.78rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px}
        .form-group input,.form-group select{
          width:100%;padding:.75rem 1rem;
          background:rgba(15,23,42,.7);border:1.5px solid rgba(255,255,255,.09);
          border-radius:.6rem;color:#fff;font-size:.95rem;
          transition:border-color var(--transition),box-shadow var(--transition);
        }
        .form-group input::placeholder{color:#475569}
        .form-group input:focus,.form-group select:focus{
          outline:none;border-color:var(--clr-primary);
          box-shadow:0 0 0 3px rgba(139,92,246,.2);
        }
        .form-group select option{background:var(--clr-bg);color:#fff}
        .btn-full{width:100%;padding:.9rem;font-size:1rem;margin-top:.5rem}
        .form-msg{
          padding:.65rem 1rem;border-radius:.5rem;font-size:.88rem;font-weight:600;text-align:center;
          margin-bottom:.75rem;
        }
        .form-msg.success{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.25)}
        .form-msg.error{background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2)}

        /* ── Separator ── */
        .divider{display:flex;align-items:center;gap:.75rem;margin:.75rem 0;color:#334155;font-size:.78rem}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07)}

        /* ── Sections ── */
        section{padding:6rem 0}
        .section-header{text-align:center;max-width:600px;margin:0 auto 4rem}
        .section-header h2{font-size:clamp(1.8rem,4vw,3rem);margin-bottom:1rem}
        .section-header p{color:#94a3b8;font-size:1.05rem}

        /* ── Portals Grid ── */
        .portals-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
        .portal-card{
          padding:2rem;border-radius:var(--radius-lg);
          background:var(--clr-surface);border:1px solid rgba(255,255,255,.06);
          transition:transform .25s,border-color .25s,box-shadow .25s;position:relative;overflow:hidden;
        }
        .portal-card:hover{transform:translateY(-5px);border-color:rgba(139,92,246,.35);box-shadow:0 20px 60px rgba(0,0,0,.4)}
        .card-icon{width:52px;height:52px;border-radius:.8rem;display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin-bottom:1.25rem}
        .portal-card h3{font-size:1.25rem;margin-bottom:.75rem}
        .portal-card p{color:#94a3b8;font-size:.9rem;line-height:1.6}
        .icon-admin{background:rgba(139,92,246,.15);color:#a78bfa}
        .icon-teacher{background:rgba(59,130,246,.15);color:#60a5fa}
        .icon-student{background:rgba(16,185,129,.15);color:#34d399}
        .icon-parent{background:rgba(245,158,11,.15);color:#fbbf24}

        /* ── Curriculum ── */
        .curriculum-section{background:linear-gradient(180deg,var(--clr-bg) 0%,var(--clr-surface) 100%)}
        .curriculum-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
        .curriculum-grid h2{font-size:clamp(2rem,4vw,3rem);margin-bottom:1.25rem}
        .lead{color:#94a3b8;font-size:1.05rem;line-height:1.75;margin-bottom:2rem}
        .feature-list{list-style:none;display:flex;flex-direction:column;gap:1.25rem}
        .feature-item{display:flex;gap:1rem;align-items:flex-start}
        .check{width:28px;height:28px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;margin-top:.1rem}
        .feature-item strong{display:block;font-size:1rem;margin-bottom:.2rem}
        .feature-item span{color:#94a3b8;font-size:.88rem}

        /* ── Glass Card ── */
        .glass-card{
          background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);
          border-radius:var(--radius-lg);padding:2rem;
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
        }
        .glass-card h4{font-size:1rem;margin-bottom:1.5rem;color:#94a3b8;text-transform:uppercase;letter-spacing:1px}
        .rubric-row{display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem}
        .rubric-row span:first-child{width:130px;font-size:.88rem;color:#cbd5e1;flex-shrink:0}
        .progress-bar{flex:1;height:7px;background:rgba(255,255,255,.06);border-radius:9999px;overflow:hidden}
        .fill{height:100%;border-radius:9999px;background:var(--gradient)}
        .w-80{width:80%} .w-60{width:60%} .w-90{width:90%}
        .grade{font-size:.75rem;color:var(--clr-accent);font-weight:600;width:110px;text-align:right}

        /* ── Social Proof ── */
        .district-logos{display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;margin-bottom:3rem}
        .logo-item{
          display:flex;align-items:center;gap:.6rem;padding:.65rem 1.25rem;
          border-radius:var(--radius-full);background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);font-size:.88rem;color:#94a3b8;
        }
        .case-study-card{display:grid;grid-template-columns:2fr 1fr;gap:2.5rem;align-items:start}
        .cs-badge{
          display:inline-block;padding:.3rem .9rem;border-radius:var(--radius-full);
          background:rgba(139,92,246,.15);color:var(--clr-primary);
          font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:1rem;
        }
        .case-study-card h3{font-size:1.3rem;margin-bottom:1rem}
        .case-study-card blockquote{color:#94a3b8;font-size:.9rem;line-height:1.75;font-style:italic;margin-bottom:1.25rem}
        .author strong{display:block;font-size:.92rem}
        .author span{font-size:.8rem;color:#64748b}
        .metric{text-align:center;padding:1.25rem;background:rgba(255,255,255,.03);border-radius:1rem;margin-bottom:1rem}
        .metric-num{font-size:2.5rem;font-weight:800;display:block}
        .metric-label{font-size:.78rem;color:#64748b;margin-top:.25rem}
        .verify-note{text-align:center;color:#334155;font-size:.78rem;margin-top:2rem}

        /* ── CTA ── */
        .cta-section{background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(59,130,246,.1));border-top:1px solid rgba(255,255,255,.06)}
        .cta-inner{text-align:center;max-width:600px;margin:0 auto}
        .cta-inner h2{font-size:clamp(2rem,4vw,2.5rem);margin-bottom:1rem}
        .cta-inner p{color:#94a3b8;margin-bottom:2rem}
        .cta-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
        .btn-lg{padding:1rem 2.25rem;font-size:1.05rem}
        .btn-sec{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.15);color:#fff}
        .btn-sec:hover{background:rgba(255,255,255,.1)}

        /* ── Compliance Banner ── */
        .compliance-banner{padding:1.25rem 0;background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05)}
        .comp-inner{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem}
        .comp-badges{display:flex;flex-wrap:wrap;gap:1.25rem}
        .comp-badge{display:flex;align-items:center;gap:.4rem;font-size:.8rem;font-weight:600;color:#94a3b8}
        .comp-badge i{color:var(--clr-accent)}
        .comp-link{font-size:.8rem;color:var(--clr-secondary);font-weight:600}

        /* ── Cookie Banner ── */
        .cookie-banner{
          position:fixed;bottom:0;left:0;right:0;z-index:2000;
          padding:1rem;background:rgba(15,23,42,.97);border-top:1px solid rgba(255,255,255,.1);
          transform:translateY(100%);transition:transform .4s ease;backdrop-filter:blur(10px);
        }
        .cookie-banner.show{transform:translateY(0)}
        .cookie-inner{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .cookie-inner p{font-size:.85rem;color:#94a3b8;flex:1}
        .cookie-btns{display:flex;gap:.75rem}

        /* ── Footer ── */
        footer{padding:3.5rem 0 1.5rem;border-top:1px solid rgba(255,255,255,.06)}
        .footer-grid{display:grid;grid-template-columns:1.5fr repeat(3,1fr);gap:2rem;margin-bottom:3rem}
        .footer-brand p{color:#64748b;font-size:.88rem;margin-top:.75rem;line-height:1.6}
        .link-group h4{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:1rem}
        .link-group a{display:block;font-size:.88rem;color:#64748b;margin-bottom:.6rem;transition:color var(--transition)}
        .link-group a:hover{color:#fff}
        .footer-bottom{text-align:center;color:#334155;font-size:.8rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,.05)}

        /* ── Responsive ── */
        @media(max-width:900px){
          .hero-content{grid-template-columns:1fr;padding:120px 0 60px;text-align:center}
          .hero-subtitle{max-width:100%}
          .hero-trust{justify-content:center}
          .portals-grid{grid-template-columns:1fr}
          .curriculum-grid{grid-template-columns:1fr}
          .case-study-card{grid-template-columns:1fr}
          .footer-grid{grid-template-columns:1fr 1fr}
          .nav-links,.nav-actions{display:none}
          .menu-toggle{display:block}
        }
        @media(max-width:580px){.portals-grid{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr}}
      `}</style>

      {/* ── Navbar ── */}
      <nav
        className="navbar"
        style={{
          background: navScrolled ? "rgba(15,23,42,.98)" : "rgba(15,23,42,.75)",
          boxShadow: navScrolled ? "0 4px 30px rgba(0,0,0,.5)" : "none",
        }}
      >
        <div className="container nav-content">
          <a href="/" className="logo">
            <span className="logo-icon">🎓</span>somoBloom
          </a>
          <div className="nav-links">
            <a href="#features">Portals</a>
            <a href="#curriculum">Curriculum</a>
            <a href="#schools">Trust</a>
          </div>
          <div className="nav-actions">
            <button className="btn btn-outline btn-sm" onClick={() => { setActiveTab("login"); document.getElementById("auth-section")?.scrollIntoView({behavior:"smooth"}) }}>
              Log In
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => { setActiveTab("register"); document.getElementById("auth-section")?.scrollIntoView({behavior:"smooth"}) }}>
              Get Started
            </button>
          </div>
          <button className="menu-toggle" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <a href="#features" className="mobile-link" onClick={() => setMobileOpen(false)}>Portals</a>
        <a href="#curriculum" className="mobile-link" onClick={() => setMobileOpen(false)}>Curriculum</a>
        <a href="#schools" className="mobile-link" onClick={() => setMobileOpen(false)}>Trust</a>
        <button className="btn btn-primary" style={{width:"100%"}} onClick={() => { setMobileOpen(false); setActiveTab("register"); document.getElementById("auth-section")?.scrollIntoView({behavior:"smooth"}) }}>
          Get Started Free
        </button>
      </div>

      {/* ── Hero ── */}
      <header className="hero">
        {/* Background Carousel Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === slideIndex ? "active" : ""}`}
            style={{ background: slide.bg }}
          />
        ))}
        <div className="hero-glow" />

        <div className="container">
          <div className="hero-content">
            {/* Left: Copy */}
            <div>
              <div className="badge">
                <span className="badge-dot" />
                Full CBC &amp; JSS Ready · Kenya
              </div>
              <h1 className="hero-title">
                Automate <span className="text-grad">Grade Reporting</span>,<br />
                Fee Collection &amp; JSS Transitions
              </h1>
              <p className="hero-subtitle">
                The total school management platform that eliminates paperwork,
                improves financial oversight, and ensures 100% compliance with
                Kenyan curriculum standards.
              </p>
              <div className="hero-trust">
                <div className="avatars">
                  <img src="https://i.pravatar.cc/100?img=1" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=2" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=3" alt="User" />
                  <div className="avatar-more">7+</div>
                </div>
                <span>Trusted by <strong>7 leading schools</strong> today.</span>
              </div>
            </div>

            {/* Right: Auth Card */}
            <div id="auth-section">
              <div className="auth-card">
                {/* Tabs */}
                <div className="auth-tabs">
                  <button
                    className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => setActiveTab("login")}
                  >
                    Log In
                  </button>
                  <button
                    className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => setActiveTab("register")}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === "login" && (
                  <div className="auth-body">
                    <h3>Welcome back</h3>
                    <p className="subtitle">Enter your credentials to access your portal.</p>
                    {loginMsg.text && (
                      <div className={`form-msg ${loginMsg.type}`}>{loginMsg.text}</div>
                    )}
                    <form onSubmit={handleLogin} noValidate>
                      <div className="form-group">
                        <label htmlFor="loginEmail">Email Address</label>
                        <input
                          id="loginEmail"
                          type="email"
                          placeholder="name@school.ac.ke"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="loginPassword">Password</label>
                        <input
                          id="loginPassword"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-full" disabled={loginLoading}>
                        {loginLoading ? "Verifying…" : "Access Portal →"}
                      </button>
                    </form>
                    <div className="divider">or</div>
                    <p style={{textAlign:"center",fontSize:".82rem",color:"#475569"}}>
                      No account?{" "}
                      <button onClick={() => setActiveTab("register")} style={{background:"none",border:"none",color:"var(--clr-primary)",cursor:"pointer",fontWeight:700,fontSize:".82rem"}}>
                        Create one free
                      </button>
                    </p>
                  </div>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                  <div className="auth-body">
                    <h3>Create Account</h3>
                    <p className="subtitle">Register as an administrator or teacher.</p>
                    {regMsg.text && (
                      <div className={`form-msg ${regMsg.type}`}>{regMsg.text}</div>
                    )}
                    <form onSubmit={handleRegister} noValidate>
                      <div className="form-group">
                        <label htmlFor="regName">Full Name</label>
                        <input
                          id="regName"
                          type="text"
                          placeholder="e.g. Dr. Sarah Omondi"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                          autoComplete="name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="regEmail">School Email</label>
                        <input
                          id="regEmail"
                          type="email"
                          placeholder="admin@school.ac.ke"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="regRole">Role</label>
                        <select
                          id="regRole"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                        >
                          <option value="admin">Administrator</option>
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="regPassword">Password</label>
                        <input
                          id="regPassword"
                          type="password"
                          placeholder="Minimum 8 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                          minLength={8}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-full" disabled={regLoading}>
                        {regLoading ? "Creating account…" : "Create Account →"}
                      </button>
                    </form>
                    <div className="divider">or</div>
                    <p style={{textAlign:"center",fontSize:".82rem",color:"#475569"}}>
                      Already registered?{" "}
                      <button onClick={() => setActiveTab("login")} style={{background:"none",border:"none",color:"var(--clr-primary)",cursor:"pointer",fontWeight:700,fontSize:".82rem"}}>
                        Log in here
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Compliance Banner ── */}
      <div className="compliance-banner">
        <div className="container comp-inner">
          <p style={{fontSize:".85rem",color:"#64748b",fontWeight:500}}>Built to highest international data security standards.</p>
          <div className="comp-badges">
            {[["🛡️","FERPA Compliant"],["🔒","COPPA Safe"],["🌍","GDPR Ready"],["📜","SOC2 Type II"]].map(([icon,label])=>(
              <div className="comp-badge" key={label}><span>{icon}</span>{label}</div>
            ))}
          </div>
          <a href="#" className="comp-link">Security Whitepaper →</a>
        </div>
      </div>

      <main>
        {/* ── Portals Section ── */}
        <section id="features">
          <div className="container">
            <div className="section-header">
              <h2>Four Portals. <span className="text-grad">One System.</span></h2>
              <p>Empower every stakeholder in your school with dedicated, purpose-built interfaces.</p>
            </div>
            <div className="portals-grid">
              {[
                { icon:"🏛️", cls:"icon-admin", title:"Administration", desc:"Total oversight. Manage fees, payroll, inventory, and generate comprehensive compliance reports instantly." },
                { icon:"📋", cls:"icon-teacher", title:"Teachers", desc:"Simplify grading. Input CBC assessments, track attendance, and manage lesson plans effortlessly from anywhere." },
                { icon:"🎒", cls:"icon-student", title:"Students", desc:"Engaging learning features. Access assignments, view grades, and interact with digital JSS resources." },
                { icon:"👨‍👩‍👧", cls:"icon-parent", title:"Parents", desc:"Stay connected in real-time. View academic progress, pay fees securely, and communicate with teachers directly." },
              ].map((p) => (
                <div className="portal-card" key={p.title}>
                  <div className={`card-icon ${p.cls}`}>{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Curriculum Section ── */}
        <section id="curriculum" className="curriculum-section">
          <div className="container curriculum-grid">
            <div>
              <h2>Built natively for <br /><span className="text-grad">CBC &amp; JSS</span></h2>
              <p className="lead">
                We understand the Kenyan curriculum shift. somoBloom isn't a retrofitted
                generic system; it's designed from the ground up for the Competency-Based Curriculum.
              </p>
              <ul className="feature-list">
                {[
                  ["Formative Assessments","Easily input and track continuous assessment metrics."],
                  ["JSS Transition Management","Seamless tools to manage the shift to Junior Secondary."],
                  ["KNEC Integration Ready","Export reports formatted precisely to ministry standards."],
                ].map(([title, detail]) => (
                  <li className="feature-item" key={title}>
                    <div className="check">✓</div>
                    <div><strong>{title}</strong><span>{detail}</span></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card">
              <h4>CBC Rubric Snapshot</h4>
              {[["Creative Arts","w-80","Exceeding Expec."],["Mathematics","w-60","Meeting Expec."],["Pre-Technical (JSS)","w-90","Exceeding Expec."]].map(([subj,w,grade])=>(
                <div className="rubric-row" key={subj}>
                  <span>{subj}</span>
                  <div className="progress-bar"><div className={`fill ${w}`}/></div>
                  <span className="grade">{grade}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social Proof ── */}
        <section id="schools">
          <div className="container">
            <div className="section-header">
              <h2>Trusted by <span className="text-grad">Forward-Thinking Districts</span></h2>
              <p>See how somoBloom delivers measurable administrative outcomes.</p>
            </div>
            <div className="district-logos">
              {[["🎓","Nairobi County Schools"],["📖","Mombasa Academy Trust"],["🏫","Kisumu Central District"]].map(([icon,name])=>(
                <div className="logo-item" key={name}>{icon} {name}</div>
              ))}
            </div>
            <div className="glass-card case-study-card">
              <div>
                <div className="cs-badge">Verified Case Study</div>
                <h3>How Mombasa Academy Trust Saved 14 Hours/Week</h3>
                <blockquote>
                  "Before somoBloom, compiling CBC compliance reports took our admin team three full days per term.
                  By automating the grading and fee collection workflows, we reclaimed 14 hours every single week—time
                  we now spend on teacher development."
                </blockquote>
                <div className="author">
                  <strong>Dr. Sarah Omondi</strong>
                  <span>Director of Operations, Mombasa Academy Trust</span>
                </div>
              </div>
              <div>
                <div className="metric"><span className="metric-num text-grad">-85%</span><div className="metric-label">Time on Ministry reporting</div></div>
                <div className="metric"><span className="metric-num text-grad">+42%</span><div className="metric-label">On-time fee collection</div></div>
              </div>
            </div>
            <p className="verify-note">* All logos and case studies are displayed with explicit written authorization.</p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-inner">
              <h2>Ready to modernize your school?</h2>
              <p>Join the 7 leading schools already transforming their administration and learning experience.</p>
              <div className="cta-actions">
                <button className="btn btn-primary btn-lg" onClick={() => { setActiveTab("register"); document.getElementById("auth-section")?.scrollIntoView({behavior:"smooth"}) }}>
                  Start Free Today
                </button>
                <a href="mailto:hello@somobloom.ac.ke" className="btn btn-sec btn-lg">Talk to Sales</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">🎓 somoBloom</div>
              <p>The premier school management ecosystem for modern Kenyan schools. FERPA · GDPR · SOC2 compliant.</p>
            </div>
            {[
              { title:"Product", links:["Admin Portal","Teacher Portal","Student Portal","Parent Portal"] },
              { title:"Company", links:["About Us","Careers","Contact"] },
              { title:"Legal", links:["Privacy Policy","Terms of Service","Security"] },
            ].map((g) => (
              <div className="link-group" key={g.title}>
                <h4>{g.title}</h4>
                {g.links.map((l) => <a href="#" key={l}>{l}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">© 2026 somoBloom Africa Ltd. All rights reserved.</div>
        </div>
      </footer>

      {/* ── Cookie Banner ── */}
      <CookieBanner />
    </>
  );
}

// ── Cookie Banner (separate component to use state without cluttering main) ──
function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("sb_cookie_consent")) {
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);
  const accept = () => { localStorage.setItem("sb_cookie_consent","accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem("sb_cookie_consent","declined"); setVisible(false); };
  return (
    <div className={`cookie-banner ${visible ? "show" : ""}`} role="dialog" aria-label="Cookie consent">
      <div className="container cookie-inner">
        <p><strong>Privacy First.</strong> We use only essential cookies. Analytics are anonymised and off by default.</p>
        <div className="cookie-btns">
          <button className="btn btn-outline btn-sm" onClick={decline}>Essential Only</button>
          <button className="btn btn-primary btn-sm" onClick={accept}>Accept Analytics</button>
        </div>
      </div>
    </div>
  );
}
