function InsightTab({ result, history = [] }) {
  const risk = result.decision_result?.risk_report?.[0];
  const burnout = result.decision_result?.burnout_report;
  const notifications = result.decision_result?.notifications || [];
  const suggestions = result.decision_result?.ai_suggestions || [];
  const schedule = result.execution_result?.schedule_analysis || {};

  const currentRisk = risk?.risk_score || 0;
  const previousRisk =
    history?.[1]?.response?.decision_result?.risk_report?.[0]?.risk_score ||
    history?.[1]?.decision_result?.risk_report?.[0]?.risk_score ||
    null;

  const riskTrend =
    previousRisk === null
      ? "New analysis"
      : currentRisk < previousRisk
      ? "Risk reduced"
      : currentRisk > previousRisk
      ? "Risk increased"
      : "Stable risk";

  const success = result.decision_result?.success_probability || 0;

  return (
    <div className="tab-page fade-in">
      <section className="insight-hero-card">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>AI planning intelligence</h2>
          <p>
            Deadline Rescue AI analyzed workload pressure, available time,
            burnout risk, recovery strategy and progress trend.
          </p>
        </div>

        <div className="insight-score">
          <span>{success}%</span>
          <small>Success Probability</small>
        </div>
      </section>

      <section className="insight-metrics-grid">
        <div className="insight-metric-card">
          <span>Risk Score</span>
          <b>{currentRisk}/100</b>
          <p>{risk?.risk_level || "Low"} risk</p>
        </div>

        <div className="insight-metric-card">
          <span>Required</span>
          <b>{schedule.estimated_required_hours || 0}h</b>
          <p>Total work estimated</p>
        </div>

        <div className="insight-metric-card">
          <span>Available</span>
          <b>{schedule.available_hours_before_deadline || 0}h</b>
          <p>Before deadline</p>
        </div>

        <div className="insight-metric-card">
          <span>Burnout</span>
          <b>{burnout?.burnout_score || 0}/100</b>
          <p>{burnout?.burnout_level || "Low"} pressure</p>
        </div>
      </section>

      <section className="insight-two-col">
        <div className="premium-card">
          <p className="eyebrow">Risk Reasoning</p>
          <h3>Why this plan has this risk</h3>

          <div className="reasoning-box">
            <h4>{risk?.risk_level || "Low"} Risk</h4>
            <p>{risk?.risk_reason}</p>

            <div className="reasoning-action">
              <b>Recommended action</b>
              <p>{risk?.risk_reduction_action}</p>
            </div>
          </div>
        </div>

        <div className="premium-card">
          <p className="eyebrow">Trend</p>
          <h3>Risk movement</h3>

          <div className="trend-card">
            <div>
              <span>Previous</span>
              <b>{previousRisk === null ? "N/A" : `${previousRisk}/100`}</b>
            </div>

            <div>
              <span>Current</span>
              <b>{currentRisk}/100</b>
            </div>

            <div>
              <span>Status</span>
              <b>{riskTrend}</b>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">AI Suggestions</p>
        <h3>What to improve next</h3>

        <div className="insight-suggestion-grid">
          {suggestions.map((item, index) => (
            <div className="insight-suggestion-card" key={index}>
              <div>{index + 1}</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">Smart Alerts</p>
        <h3>Notifications</h3>

        <div className="alert-modern-grid">
          {notifications.map((item, index) => (
            <div className="alert-modern-card" key={index}>
              <span>{item.type}</span>
              <p>{item.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default InsightTab;