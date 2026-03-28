import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

/* ---------- Simple SVG Icons ---------- */
function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2f6b52" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f6b52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconTasks() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2f6b52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <polyline points="3 6 4 7 6 5" />
      <polyline points="3 12 4 13 6 11" />
      <polyline points="3 18 4 19 6 17" />
    </svg>
  );
}

function IconRoles() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2f6b52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSetup() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2f6b52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ---------- Main Component ---------- */
export default function Landing() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="landing-shell">

      {/* Navbar */}
      <nav className="landing-nav" aria-label="Main navigation">
        <div className="landing-nav-inner">
          <a href="/" className="landing-nav-brand" aria-label="Task Manager home">
            <IconLogo />
            <span>Task Manager</span>
          </a>
          <div className="landing-nav-actions">
            <button
              id="nav-login-btn"
              className="btn-ghost"
              onClick={() => navigate("/login")}
              aria-label="Log in to your account"
            >
              Log in
            </button>
            <button
              id="nav-register-btn"
              className="btn-primary"
              onClick={() => navigate("/register")}
              aria-label="Create a new account"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" aria-labelledby="hero-heading">
        <div className="landing-hero-inner">
          <div className="landing-badge fade-up" aria-label="Feature badge">
            <IconCheck />
            Role-based &middot; JWT &middot; Google OAuth
          </div>

          <h1 id="hero-heading" className="fade-up-delay-1">
            Stay organized,<br />stay ahead.
          </h1>

          <p className="fade-up-delay-2">
            A focused task manager for teams and individuals. Users handle their
            own tasks, admins oversee everything — all secured with JWT and
            Google OAuth.
          </p>

          <div className="hero-cta-group fade-up-delay-3">
            <button
              id="hero-google-btn"
              className="btn-google"
              onClick={() => navigate("/login")}
              aria-label="Continue with Google"
            >
              <IconGoogle />
              Continue with Google
            </button>
            <button
              id="hero-register-btn"
              className="btn-cta-primary"
              onClick={() => navigate("/register")}
              aria-label="Create an account with email"
            >
              Register with email
              <IconArrow />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" aria-labelledby="features-heading">
        <div className="landing-section-inner">
          <p className="section-label">Why use it</p>
          <h2 id="features-heading" className="section-heading">Everything you need, nothing you don't</h2>
          <p className="section-sub">
            Built to keep your daily work calm, clear, and organized.
          </p>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true"><IconTasks /></div>
              <h3>Simple Task Flow</h3>
              <p>Create, update, and track tasks without the clutter. Focus on the work, not the tool.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true"><IconRoles /></div>
              <h3>Clear Role Access</h3>
              <p>Users manage their own tasks. Admins get full visibility and control across the system.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true"><IconSetup /></div>
              <h3>Fast Setup</h3>
              <p>Sign in with Google or email and start working in seconds. No onboarding friction.</p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-steps" aria-labelledby="steps-heading">
        <div className="landing-section-inner">
          <p className="section-label">How it works</p>
          <h2 id="steps-heading" className="section-heading">Up and running in three steps</h2>

          <ol className="steps-list" aria-label="Getting started steps">
            <li className="step-item">
              <div className="step-number" aria-hidden="true">1</div>
              <div className="step-content">
                <h4>Sign in</h4>
                <p>Use your Google account or register with email. JWT keeps your session secure.</p>
              </div>
            </li>

            <li className="step-item">
              <div className="step-number" aria-hidden="true">2</div>
              <div className="step-content">
                <h4>Add your tasks</h4>
                <p>Create tasks, set priority levels, and update status as you move through your day.</p>
              </div>
            </li>

            <li className="step-item">
              <div className="step-number" aria-hidden="true">3</div>
              <div className="step-content">
                <h4>Admins stay in control</h4>
                <p>Admin users can review all users and tasks from one clean dashboard view.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta-banner" aria-labelledby="cta-heading">
        <div className="cta-banner-inner">
          <h2 id="cta-heading">Ready to get organized?</h2>
          <p>Join today and keep your work on track — it's free to start.</p>
          <button
            id="cta-register-btn"
            className="btn-white"
            onClick={() => navigate("/register")}
            aria-label="Create a free account"
          >
            Create your account
            <IconArrow />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <IconLogo />
            Task Manager
          </div>
          <p>&copy; {currentYear} Task Manager. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}