import { useEffect, useMemo, useState } from "react";
import WhatIfSimulator from "./WhatIfSimulator";

function PlanningTab({ result }) {
  const tasks = result.tasks_result?.tasks || [];
  const priorities = result.execution_result?.priority_ranking || [];
  const recovery = result.decision_result?.recovery_plan || [];
  const mvp = result.execution_result?.mvp_scope;
  const suggestions = result.decision_result?.ai_suggestions || [];
  const burnout = result.decision_result?.burnout_report;

  const checklistTasks = useMemo(
    () => tasks.filter((task) => task.task_type !== "parent"),
    [tasks]
  );

  const storageKey = `deadline-checklist-${result.analysis_id || "latest"}`;

  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(done));
  }, [done, storageKey]);

  const toggleDone = (name) => {
    setDone((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const total = checklistTasks.length;
  const completed = checklistTasks.filter((task) => done[task.task_name]).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="tab-page">
      <section className="premium-card">
        <p className="eyebrow">Checklist</p>
        <div className="section-title-row">
          <h3>Track your progress</h3>
          <div className="progress-score">{percent}% Done</div>
        </div>

        <div className="progress-track">
          <div className="progress-fill-green" style={{ width: `${percent}%` }}></div>
        </div>

        <p className="muted">
          {completed}/{total} tasks completed
        </p>

        <div className="checklist-grid">
          {checklistTasks.map((task) => (
            <label
              className={done[task.task_name] ? "checklist-item checked" : "checklist-item"}
              key={task.task_name}
            >
              <input
                type="checkbox"
                checked={!!done[task.task_name]}
                onChange={() => toggleDone(task.task_name)}
              />
              <span>{task.task_name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">AI Coach</p>
        <h3>Smart recommendations</h3>

        <div className="suggestion-list">
          {suggestions.map((item, index) => (
            <div className="suggestion-card" key={index}>
              <b>{index + 1}</b>
              <p>{item}</p>
            </div>
          ))}
        </div>

        {burnout && (
          <div className="burnout-card">
            <h4>Burnout Prediction: {burnout.burnout_level}</h4>
            <p>
              <b>Score:</b> {burnout.burnout_score}/100
            </p>
            <p>{burnout.suggestion}</p>
          </div>
        )}
      </section>

      <WhatIfSimulator result={result} />

      <section className="premium-card">
        <p className="eyebrow">Priority</p>
        <h3>What to do first</h3>

        <div className="priority-grid">
          {priorities.map((item, index) => (
            <div className="priority-card" key={index}>
              <div className="rank-badge">#{index + 1}</div>
              <h4>{item.task_name}</h4>
              <p>
                <b>Score:</b> {item.priority_score}/100
              </p>
              <p>
                <b>Level:</b> {item.priority_level}
              </p>
              <small>{item.reason}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">Tasks</p>
        <h3>Extracted work items</h3>

        <div className="task-grid">
          {tasks.map((task, index) => (
            <div className="modern-task-card" key={index}>
              <h4>{task.task_name}</h4>

              <div className="chip-row">
                <span>≈ {task.estimated_hours}h</span>
                <span>{task.normalized_date || "No date"}</span>
                <span>{task.category || task.task_type}</span>
              </div>

              {task.compression_note && (
                <p className="compression-note">{task.compression_note}</p>
              )}

              <p>
                <b>Parent:</b> {task.parent_task || "None"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">Recovery</p>
        <h3>How to recover if things slip</h3>

        <div className="recovery-grid">
          {recovery.map((item, index) => (
            <div className="recovery-card" key={index}>
              <h4>{item.task_name}</h4>
              <p>
                <b>Problem:</b> {item.problem}
              </p>
              <p>
                <b>Recovery:</b> {item.recovery_action}
              </p>
              <p>
                <b>Skip:</b> {item.what_to_skip}
              </p>
              <p>
                <b>Next 24 Hours:</b> {item.next_24_hours_focus}
              </p>
            </div>
          ))}
        </div>
      </section>

      {mvp && (
        <section className="scope-grid">
          <div className="scope-card must">
            <h4>Must Have</h4>
            <ul>{mvp.must_have?.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>

          <div className="scope-card should">
            <h4>Should Have</h4>
            <ul>{mvp.should_have?.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>

          <div className="scope-card skip">
            <h4>Can Skip</h4>
            <ul>{mvp.can_skip?.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default PlanningTab;