import { downloadJSON, downloadICS, printPDF, speakText } from "../utils/exportUtils";

function ExecutiveSummary({ result }) {
  if (!result) return null;

  const tasks = result.tasks_result?.tasks || [];
  const risks = result.decision_result?.risk_report || [];
  const calendarEvents = result.execution_result?.calendar_events || [];
  const schedule = result.execution_result?.schedule_analysis;
  const recommendation = result.decision_result?.ai_recommendation;

  const success =
    result.decision_result?.success_probability ??
    Math.max(5, 100 - (risks[0]?.risk_score || 50));

  const riskScore = risks[0]?.risk_score || 0;

  const topTask =
    result.execution_result?.priority_ranking?.[0]?.task_name ||
    tasks[0]?.task_name ||
    "top priority task";

  const totalHours =
    schedule?.estimated_required_hours ||
    tasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);

  const readSummary = () => {
    speakText(
      `Deadline Rescue AI generated your plan. Required work is ${totalHours} hours. Risk is ${riskScore} out of 100. Success probability is ${success} percent. Start with ${topTask}.`
    );
  };

  return (
    <section className="executive-card">
      {result.fallback && (
        <div className="soft-alert">
          {result.error || "Using deterministic local planner."}
        </div>
      )}

      <div className="executive-layout">
        <div className="executive-content">
          <p className="eyebrow">Executive Summary</p>
          <h2>Rescue plan generated</h2>

          <p className="summary-copy">
            Required work is <b>{totalHours} hours</b>. Current risk is{" "}
            <b>{riskScore}/100</b>, success probability is <b>{success}%</b>,
            and the first priority is <b>{topTask}</b>.
          </p>

          {schedule && (
            <div className="mini-metric-grid">
              <div>
                <span>Deadline</span>
                <b>{schedule.deadline_days} days</b>
              </div>
              <div>
                <span>Required</span>
                <b>{schedule.estimated_required_hours} hrs</b>
              </div>
              <div>
                <span>Available</span>
                <b>{schedule.available_hours_before_deadline} hrs</b>
              </div>
              <div>
                <span>Deficit</span>
                <b>{schedule.time_deficit_hours} hrs</b>
              </div>
            </div>
          )}

          {recommendation && (
            <div className="recommendation-panel">
              <div>
                <p className="eyebrow">AI Recommendation</p>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.summary}</p>
              </div>

              <div className="recommendation-columns">
                <div>
                  <b>Focus</b>
                  <ul>
                    {recommendation.recommended_focus?.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <b>Reduce</b>
                  <ul>
                    {recommendation.recommended_cuts?.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="executive-actions">
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
          <b>{riskScore}/100</b>
        </div>

        <div className="summary-pill success">
          <span>Success</span>
          <b>{success}%</b>
        </div>

        <div className="summary-pill">
          <span>Hours</span>
          <b>{totalHours}</b>
        </div>
      </div>
    </section>
  );
}

export default ExecutiveSummary;