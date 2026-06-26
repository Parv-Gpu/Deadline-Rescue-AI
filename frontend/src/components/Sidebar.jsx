const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "planning", label: "Planning" },
  { id: "calendar", label: "Calendar" },
  { id: "team", label: "Team" },
  { id: "insights", label: "Insights" },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">DR</div>
        <div>
          <h2>Deadline</h2>
          <p>Rescue AI</p>
        </div>
      </div>

      <nav className="side-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activeTab === item.id ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        Focused planning. Realistic schedules. Better execution.
      </div>
    </aside>
  );
}

export default Sidebar;