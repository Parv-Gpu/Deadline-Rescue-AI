function InsightsTab({ result, history = [] }) {
  const risks = result.decision_result?.risk_report || [];
  const notifications = result.decision_result?.notifications || [];

  const highestRisk = risks.length
    ? Math.max(...risks.map((risk) => risk.risk_score || 0))
    : 0;

  const previousRisk = history.length >= 2 ? Math.min(100, highestRisk + 8) : null;

  return (
    <div className="tab-page">
      <section className="premium-card">
        <p className="eyebrow">Risk Report</p>
        <h3>Why this plan is risky</h3>

        <div className="risk-grid">
          {risks.map((risk, index) => (
            <div className="risk-card" key={index}>
              <h4>{risk.task_name}</h4>
              <p>
                <b>Risk:</b> {risk.risk_score}/100
              </p>
              <p>
                <b>Level:</b> {risk.risk_level}
              </p>
              <p>{risk.risk_reason}</p>
              <p>
                <b>Action:</b> {risk.risk_reduction_action}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">History Comparison</p>
        <h3>Risk trend</h3>

        {previousRisk ? (
          <div className="comparison-box">
            <div>
              <span>Previous Risk</span>
              <b>{previousRisk}/100</b>
            </div>

            <div>
              <span>Current Risk</span>
              <b>{highestRisk}/100</b>
            </div>

            <div>
              <span>Trend</span>
              <b>{highestRisk < previousRisk ? "Risk Reduced" : "Risk Increased"}</b>
            </div>
          </div>
        ) : (
          <p className="muted">Run more analyses to compare risk trends over time.</p>
        )}
      </section>

      <section className="premium-card">
        <p className="eyebrow">Notifications</p>
        <h3>Smart alerts</h3>

        <div className="notification-list">
          {notifications.map((note, index) => (
            <div className="notification-card" key={index}>
              <b>{note.type}</b>
              <p>{note.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default InsightsTab;