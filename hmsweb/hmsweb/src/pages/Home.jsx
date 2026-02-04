import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hms-home">
      {/* TOP NAV */}
      <header className="hms-topbar">
        <div className="container hms-topbar-inner">
          <div className="brand">
            <div className="brand-logo">🏥</div>
            <div className="brand-text">
              <div className="brand-title">HealthCare</div>
              <div className="brand-subtitle">Hospital Management System</div>
            </div>
          </div>

          <div className="top-actions">
          <button
          className="btn btn-light btn-lg fw-semibold px-4"
          onClick={() => navigate("/doctor-login")}
           >
      👨‍⚕️ Doctor Login
  </button>

  <button
    className="btn btn-outline-light btn-lg fw-semibold px-4"
    onClick={() => navigate("/admin-login")}
  >
    👨‍💼 Manager Login
  </button>
</div>

        </div>
      </header>

      {/* HERO */}
      <section className="hms-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="hero-badge">Trusted Care • 24×7 Support</div>

              <h1 className="hero-title">
                Healing starts here. <br />
                <span className="hero-highlight">Care made simple</span>
              </h1>

              <p className="hero-desc">
                Book appointments, manage doctors & patients, track visits, and
                access medical records securely—everything in one platform.
              </p>

              <div className="hero-cta">
                <button className="btn btn-success btn-lg px-4"
                 onClick={() => navigate("/patient-login")} >
                  📅 Book Appointment
                </button>

                <button
                className="btn btn-outline-success btn-lg px-4"
                onClick={() => navigate("/find-doctors")}
                >
                👨‍⚕️ Find a Doctor
                </button>

              </div>

              {/* Quick search bar (hospital websites use this style) */}
              <div className="hero-search">
                <div className="search-box">
                  <span className="search-icon">🔎</span>
                  <input
                    className="search-input"
                    placeholder="Search: doctors, departments, services..."
                  />
                  <button className="btn btn-primary search-btn">
                    Search
                  </button>
                </div>

                <div className="search-hints">
                  Popular: Cardiology • Orthopedics • Pediatrics • Radiology
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-card">
                <h5 className="fw-bold mb-2">Quick Access</h5>
                <p className="text-muted mb-3">
                  Choose an option to continue quickly.
                </p>

                <div className="quick-grid">
                  <button className="quick-tile">
                    <span className="tile-icon">🧾</span>
                    <span className="tile-text">
                      View Reports
                      <small>Lab & scan results</small>
                    </span>
                  </button>

                  <button className="quick-tile">
                    <span className="tile-icon">📍</span>
                    <span className="tile-text">
                      Locations
                      <small>Find hospital nearby</small>
                    </span>
                  </button>

                  <button className="quick-tile">
                    <span className="tile-icon">🩺</span>
                    <span className="tile-text">
                      Specialities
                      <small>Browse departments</small>
                    </span>
                  </button>

                  <button className="quick-tile">
                    <span className="tile-icon">☎️</span>
                    <span className="tile-text">
                      Emergency
                      <small>24×7 Helpline</small>
                    </span>
                  </button>
                </div>

                <div className="hero-card-footer">
                  <span className="dot"></span>
                  Secure access with role-based login (Manager / Doctor / Patient)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="hms-strip">
        <div className="container">
          <div className="row g-3">
            {[
              { icon: "📅", title: "Appointments", text: "Smart scheduling & queue" },
              { icon: "📄", title: "Records", text: "Secure patient history" },
              { icon: "💊", title: "Medicines", text: "Inventory & prescriptions" },
              { icon: "📊", title: "Reports", text: "Analytics & insights" },
            ].map((item, idx) => (
              <div className="col-md-3 col-6" key={idx}>
                <div className="strip-card">
                  <div className="strip-icon">{item.icon}</div>
                  <div>
                    <div className="strip-title">{item.title}</div>
                    <div className="strip-text">{item.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="hms-features">
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold">A complete hospital platform</h3>
            <p className="text-muted mb-0">
              Built for speed, reliability and a smooth patient journey.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "🔐",
                title: "Secure Login",
                desc: "JWT authentication with role-based access control.",
              },
              {
                icon: "⚡",
                title: "Fast Workflow",
                desc: "Quick navigation, clean UI and smart dashboard layout.",
              },
              {
                icon: "📱",
                title: "Responsive UI",
                desc: "Works perfectly on desktop, tablet and mobile devices.",
              },
              {
                icon: "🧠",
                title: "Easy Management",
                desc: "Doctors, patients, appointments, visits—all in one place.",
              },
            ].map((f, idx) => (
              <div className="col-md-3 col-sm-6" key={idx}>
                <div className="feature-card2">
                  <div className="feature-icon2">{f.icon}</div>
                  <h6 className="fw-bold mt-3">{f.title}</h6>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="hms-footer">
        <div className="container">
          <div className="d-flex justify-content-between flex-wrap gap-2">
            <span>© 2026 HealthCare HMS</span>
            <span className="text-muted">Privacy • Terms • Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;



