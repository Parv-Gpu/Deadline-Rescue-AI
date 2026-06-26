import DeadlineCountdown from "./DeadlineCountdown";
import RiskBreakdown from "./RiskBreakdown";

function DashboardTab({ result }) {
  const tasks = result.tasks_result?.tasks || [];
  const risks = result.decision_result?.risk_report || [];
  const today = result.execution_result?.today_plan || [];
  const schedule = result.execution_result?.schedule_analysis || {};
  const success = result.decision_result?.success_probability ?? 50;
  const riskScore = risks[0]?.risk_score || 0;
  const suggestions = result.decision_result?.ai_suggestions || [];

  return (
    <div className="tab-page fade-in">
      <DeadlineCountdown result={result} />

      <section className="hero-metrics">
        <div className="metric-visual-card">
          <p className="eyebrow">Risk</p>
          <div className="risk-orb">
            <span>{riskScore}</span>
          </div>
          <h3>{risks[0]?.risk_level || "Unknown"} Risk</h3>
          <p>Risk is calculated from workload, deadline, daily hours and deficit.</p>
        </div>

        <div className="metric-visual-card">
          <p className="eyebrow">Success</p>
          <div className="success-ring">
            <span>{success}%</span>
          </div>
          <h3>Completion Forecast</h3>
          <p>Based on available time and current workload pressure.</p>
        </div>

        <div className="metric-visual-card wide">
          <p className="eyebrow">AI Insights</p>
          <h3>What the AI noticed</h3>
          <div className="insight-grid">
            <div>
              <span>Required</span>
              <b>{schedule.estimated_required_hours || 0} hrs</b>
            </div>
            <div>
              <span>Available</span>
              <b>{schedule.available_hours_before_deadline || 0} hrs</b>
            </div>
            <div>
              <span>Deficit</span>
              <b>{schedule.time_deficit_hours || 0} hrs</b>
            </div>
            <div>
              <span>Deadline</span>
              <b>{schedule.deadline_days || 0} days</b>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">AI Suggestions</p>
        <h3>Your next best moves</h3>

        <div className="suggestion-list compact">
          {suggestions.map((item, index) => (
            <div className="suggestion-card" key={index}>
              <b>{index + 1}</b>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-split">
        <div className="premium-card">
          <p className="eyebrow">Effort Distribution</p>
          <h3>Where your time is going</h3>

          <div className="effort-bars clean">
            {tasks
              .filter((task) => task.estimated_hours > 0)
              .map((task, index) => (
                <div className="effort-row" key={index}>
                  <span>{task.task_name}</span>
                  <div className="effort-track">
                    <div
                      className="effort-fill"
                      style={{
                        width: `${Math.min(Number(task.estimated_hours) * 4, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <b>{task.estimated_hours}h</b>
                </div>
              ))}
          </div>
        </div>

        <div className="premium-card">
          <p className="eyebrow">Today</p>
          <h3>Rescue Plan</h3>

          <div className="today-list modern">
            {today.map((item, index) => (
              <div className="today-card" key={index}>
                <div className="today-time">{item.time_block}</div>
                <h4>{item.task_name}</h4>
                <p>{item.focus_area}</p>
                <small>{item.expected_output}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RiskBreakdown result={result} />
    </div>
  );
}

export default DashboardTab;