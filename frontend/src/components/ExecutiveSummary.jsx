import { downloadJSON, downloadICS, printPDF, speakText } from "../utils/exportUtils";

function ExecutiveSummary({ result }) {
  if (!result) return null;

  const tasks = result.tasks_result?.tasks || [];
  const risks = result.decision_result?.risk_report || [];
  const priorities = result.execution_result?.priority_ranking || [];
  const calendarEvents = result.execution_result?.calendar_events || [];
  const mvp = result.execution_result?.mvp_scope;
  const schedule = result.execution_result?.schedule_analysis;

  const totalHours = tasks.reduce(
    (sum, task) => sum + (Number(task.estimated_hours) || 0),
    0
  );

  const highestRisk = risks.length
    ? Math.max(...risks.map((risk) => risk.risk_score || 0))
    : 0;

  const successProbability = Math.max(5, 100 - highestRisk);
  const topPriority = priorities[0]?.task_name || "highest priority task";
  const skipList = mvp?.can_skip?.join(", ") || "non-essential features";

  const readSummary = () => {
    speakText(
      `You have ${totalHours} hours of estimated work. Highest risk is ${highestRisk} out of 100. Start with ${topPriority}. ${schedule ? `Deadline is ${schedule.deadline_days} days. Available time is ${schedule.available_hours_before_deadline} hours.` : ""}`
    );
  };

  return (
    <section className="executive-summary premium-card">
      {result.fallback && (
        <div className="fallback-banner">
          {result.error || "Using fallback response."}
        </div>
      )}

      <div className="summary-main">
        <div>
          <p className="eyebrow">Executive Summary</p>
          <h2>Rescue plan generated</h2>

          <p>
            You have <b>{totalHours} hours</b> of estimated work with a{" "}
            <b>{highestRisk}/100 risk score</b>. Start with{" "}
            <b>{topPriority}</b> and avoid <b>{skipList}</b>.
          </p>

          {schedule && (
            <div className="deadline-analysis-box">
              <b>Deadline Analysis</b>

              <div className="deadline-analysis-grid">
                <div>
                  <span>Deadline</span>
                  <strong>{schedule.deadline_days} days</strong>
                </div>

                <div>
                  <span>Required</span>
                  <strong>{schedule.estimated_required_hours} hrs</strong>
                </div>

                <div>
                  <span>Available</span>
                  <strong>{schedule.available_hours_before_deadline} hrs</strong>
                </div>

                <div>
                  <span>Deficit</span>
                  <strong>{schedule.time_deficit_hours} hrs</strong>
                </div>
              </div>

              <p className={schedule.overloaded ? "risk-text" : "success-text"}>
                {schedule.recommendation}
              </p>
            </div>
          )}
        </div>

        <div className="summary-actions">
          <button onClick={() => downloadJSON(result)}>JSON</button>
          <button onClick={printPDF}>PDF</button>
          <button onClick={() => downloadICS(calendarEvents)}>Calendar</button>
          <button onClick={readSummary}>Read</button>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-pill">
          <span>Tasks</span>
          <b>{tasks.length}</b>
        </div>

        <div className="summary-pill danger">
          <span>Risk</span>
          <b>{highestRisk}/100</b>
        </div>

        <div className="summary-pill success">
          <span>Success</span>
          <b>{successProbability}%</b>
        </div>

        <div className="summary-pill">
          <span>Hours</span>
          <b>{schedule?.estimated_required_hours || totalHours}</b>
        </div>
      </div>
    </section>
  );
}

export default ExecutiveSummary;