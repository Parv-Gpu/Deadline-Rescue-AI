function Header({ darkMode, setDarkMode }) {
  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">Deadline Rescue AI</p>
        <h1>Never Miss Another Deadline</h1>
        <p className="header-subtitle">
          Predict risk, prioritize work, generate recovery plans, and export your schedule.
        </p>
      </div>

      <div className="header-actions">
        <div className="status-pill">
          <span className="pulse-dot"></span>
          11-agent system
        </div>

        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

export default Header;