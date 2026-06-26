import { useState } from "react";
import WhatIfSimulator from "./WhatIfSimulator";

function PlanningTab({ result }) {
  const tasks = result.tasks_result?.tasks || [];
  const priorities = result.execution_result?.priority_ranking || [];
  const recovery = result.decision_result?.recovery_plan || [];
  const mvp = result.execution_result?.mvp_scope;
  const [done, setDone] = useState({});

  const toggleDone = (name) => {
    setDone((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const total = tasks.filter((t) => t.task_type !== "parent").length;
  const completed = Object.values(done).filter(Boolean).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="tab-page">
      <section className="premium-card">
        <p className="eyebrow">Checklist</p>
        <h3>Track your progress</h3>

        <div className="progress-track">
          <div className="progress-fill-green" style={{ width: `${percent}%` }}></div>
        </div>

        <p className="muted">{completed}/{total} completed · {percent}% done</p>

        <div className="checklist-grid">
          {tasks
            .filter((task) => task.task_type !== "parent")
            .map((task) => (
              <label className="checklist-item" key={task.task_name}>
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

      <WhatIfSimulator result={result} />

      <section className="premium-card">
        <p className="eyebrow">Priority</p>
        <h3>What to do first</h3>

        <div className="priority-grid">
          {priorities.map((item, index) => (
            <div className="priority-card" key={index}>
              <div className="rank-badge">#{index + 1}</div>
              <h4>{item.task_name}</h4>
              <p><b>Score:</b> {item.priority_score}/100</p>
              <p><b>Level:</b> {item.priority_level}</p>
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
                <span>{task.estimated_hours}h</span>
                <span>{task.normalized_date || "No date"}</span>
                <span>{task.task_type}</span>
              </div>

              <p><b>Parent:</b> {task.parent_task || "None"}</p>
              
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
              <p><b>Problem:</b> {item.problem}</p>
              <p><b>Recovery:</b> {item.recovery_action}</p>
              <p><b>Skip:</b> {item.what_to_skip}</p>
              <p><b>Next 24 Hours:</b> {item.next_24_hours_focus}</p>
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