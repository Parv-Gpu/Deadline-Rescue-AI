function RiskBreakdown({ result }) {
  const risk = result.decision_result?.risk_report?.[0];
  const burnout = result.decision_result?.burnout_report;
  const notifications = result.decision_result?.notifications || [];

  const currentRisk = risk?.risk_score || 0;
  const success = result.decision_result?.success_probability || 0;

  const riskLevel = risk?.risk_level || "Low";
  const burnoutLevel = burnout?.burnout_level || "Low";
  const burnoutScore = burnout?.burnout_score || 0;

  const statusText =
    currentRisk >= 80
      ? "High pressure. Cut scope immediately."
      : currentRisk >= 55
      ? "Manageable, but needs discipline."
      : "Plan is currently healthy.";

  return (
    <section className="risk-pro-section">
      <div className="risk-pro-header">
        <div>
          <p className="eyebrow">Risk Intelligence</p>
          <h3>Plan health overview</h3>
          <p>{statusText}</p>
        </div>

        <div className="risk-pro-badge">
          <span>{success}%</span>
          <small>Success</small>
        </div>
      </div>

      <div className="risk-pro-grid">
        <div className="risk-score-card">
          <div className="risk-circle">
            <span>{currentRisk}</span>
          </div>

          <div>
            <p className="eyebrow">Deadline Risk</p>
            <h4>{riskLevel} Risk</h4>
            <p>{risk?.risk_reason || "Risk calculated from workload and deadline."}</p>
          </div>
        </div>

        <div className="risk-action-card">
          <p className="eyebrow">Recommended Action</p>
          <h4>What to do now</h4>
          <p>{risk?.risk_reduction_action || "Follow the balanced plan."}</p>
        </div>
      </div>

      <div className="risk-mini-row">
        <div>
          <span>Burnout</span>
          <b>{burnoutScore}/100</b>
          <small>{burnoutLevel} risk</small>
        </div>

        <div>
          <span>Trend</span>
          <b>{currentRisk <= 55 ? "Stable" : "Watch"}</b>
          <small>{currentRisk <= 55 ? "Healthy workload" : "Needs replanning"}</small>
        </div>

        <div>
          <span>Alerts</span>
          <b>{notifications.length}</b>
          <small>Smart reminders</small>
        </div>
      </div>

      <div className="risk-alert-strip">
        {notifications.map((item, index) => (
          <div className="risk-alert-pill" key={index}>
            <b>{item.type}</b>
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RiskBreakdown;