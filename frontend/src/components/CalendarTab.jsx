import { useEffect, useMemo, useState } from "react";
import { formatDateTime, downloadICS, sendScheduleMail } from "../utils/exportUtils";

function CalendarTab({ result }) {
  const tasks = result.tasks_result?.tasks || [];
  const events = result.execution_result?.calendar_events || [];
  const dayWisePlan = result.execution_result?.day_wise_plan || [];

  const storageKey = `calendar-block-progress-${result.analysis_id || "latest"}`;

  const [doneBlocks, setDoneBlocks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(doneBlocks));
  }, [doneBlocks, storageKey]);

  const toggleBlock = (key) => {
    setDoneBlocks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getDayProgress = (day, dayIndex) => {
    const workBlocks = (day.blocks || []).filter(
      (b) => b.task_name?.toLowerCase() !== "break"
    );

    const completed = workBlocks.filter((_, blockIndex) => {
      const key = `${dayIndex}-${blockIndex}`;
      return doneBlocks[key];
    }).length;

    const total = workBlocks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percent };
  };

  const totalWork = useMemo(() => {
    return tasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);
  }, [tasks]);

  return (
    <div className="tab-page">
      <section className="premium-card calendar-premium">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Calendar</p>
            <h3>Day-wise realistic schedule</h3>
            <p className="muted">
              Track every day separately. Breaks are not counted in completion.
            </p>
          </div>

          <div className="calendar-actions">
            <button className="primary-action small" onClick={() => downloadICS(events)}>
              Export Calendar
            </button>

            <button className="ghost-btn" onClick={() => sendScheduleMail(dayWisePlan)}>
              Mail Schedule
            </button>
          </div>
        </div>

        <div className="day-plan-list">
          {dayWisePlan.map((day, dayIndex) => {
            const progress = getDayProgress(day, dayIndex);

            return (
              <div className="day-plan-card" key={dayIndex}>
                <div className="day-plan-header">
                  <div>
                    <span>{day.day_label}</span>
                    <h4>{formatDateTime(day.date).split(",")[0]}</h4>
                  </div>

                  <div className="day-progress-box">
                    <b>{progress.percent}% Done</b>
                    <small>
                      {progress.completed}/{progress.total} work blocks
                    </small>
                  </div>
                </div>

                <div className="day-progress-track">
                  <div style={{ width: `${progress.percent}%` }}></div>
                </div>

                <div className="focus-chip-row">
                  {day.focus_areas?.map((focus, i) => (
                    <span key={i}>{focus}</span>
                  ))}
                </div>

                <div className="day-block-list">
                  {day.blocks?.map((block, blockIndex) => {
                    const isBreak = block.task_name?.toLowerCase() === "break";
                    const key = `${dayIndex}-${blockIndex}`;

                    return (
                      <label
                        className={
                          isBreak
                            ? "day-block break-block"
                            : doneBlocks[key]
                            ? "day-block block-done"
                            : "day-block"
                        }
                        key={blockIndex}
                      >
                        <input
                          type="checkbox"
                          disabled={isBreak}
                          checked={!isBreak && !!doneBlocks[key]}
                          onChange={() => toggleBlock(key)}
                        />

                        <div className="day-block-time">
                          {block.start_time} - {block.end_time}
                        </div>

                        <div>
                          <h5>{block.task_name}</h5>
                          <p>{block.focus_area}</p>
                          <small>{block.expected_output}</small>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="premium-card">
        <p className="eyebrow">Timeline</p>
        <h3>Effort overview</h3>
        <p className="muted">Total planned effort: {totalWork.toFixed(1)} hours</p>

        <div className="gantt-list">
          {tasks
            .filter((task) => task.estimated_hours > 0)
            .map((task, index) => (
              <div className="gantt-row-new" key={index}>
                <span>{task.task_name}</span>

                <div className="gantt-track">
                  <div
                    className="gantt-fill"
                    style={{
                      width: `${Math.min(task.estimated_hours * 2, 100)}%`,
                    }}
                  ></div>
                </div>

                <b>{task.estimated_hours}h</b>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default CalendarTab;