export default function Footer() {
  return (
    <footer className="app-footer fs-app">

      {/* LEFT */}
      <div>
        © {new Date().getFullYear()} CUTSHEET SYSTEM
      </div>

      {/* MIDDLE (VERSION) */}
      <div className="footer-version">
        V1.0.0
      </div>

      {/* RIGHT */}
      <div className="footer-status-indicator">
        <span className="status-dot"></span>
        <span>Systems Operational</span>
      </div>

    </footer>
  );
}