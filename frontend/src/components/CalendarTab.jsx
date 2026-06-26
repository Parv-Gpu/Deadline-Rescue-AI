import { formatDateTime, downloadICS, sendScheduleMail } from "../utils/exportUtils";

function CalendarTab({ result }) {
  const tasks = result.tasks_result?.tasks || [];
  const events = result.execution_result?.calendar_events || [];
  const dayWisePlan = result.execution_result?.day_wise_plan || [];

  return (
    <div className="tab-page">
      <section className="premium-card calendar-premium">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Calendar</p>
            <h3>Day-wise realistic schedule</h3>
            <p className="muted">
              Tasks are mixed across days so you do Leetcode, core CS, resume,
              and HR in a balanced way.
            </p>
          </div>

          <div className="calendar-actions">
            <button className="primary-action small" onClick={() => downloadICS(events)}>
              Export Calendar
            </button>

            <button
              className="ghost-btn"
              onClick={() => sendScheduleMail(dayWisePlan)}
            >
              Mail Schedule
            </button>
          </div>
        </div>

        {dayWisePlan.length > 0 ? (
          <div className="day-plan-list">
            {dayWisePlan.map((day, index) => (
              <div className="day-plan-card" key={index}>
                <div className="day-plan-header">
                  <div>
                    <span>{day.day_label}</span>
                    <h4>{formatDateTime(day.date).split(",")[0]}</h4>
                  </div>

                  <b>{day.blocks?.length || 0} Blocks</b>
                </div>

                <div className="day-block-list">
                  {day.blocks?.map((block, blockIndex) => (
                    <label
                      className={
                        block.task_name?.toLowerCase() === "break"
                          ? "day-block break-block"
                          : "day-block"
                      }
                      key={blockIndex}
                    >
                      <input type="checkbox" />

                      <div className="day-block-time">
                        {block.start_time} - {block.end_time}
                      </div>

                      <div>
                        <h5>{block.task_name}</h5>
                        <p>{block.focus_area}</p>
                        <small>{block.expected_output}</small>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-grid-modern">
            {events.map((event, index) => (
              <div className="calendar-event-card" key={index}>
                <span>Scheduled Block</span>
                <h4>{event.title}</h4>
                <p>{formatDateTime(event.start_time)}</p>
                <p>{formatDateTime(event.end_time)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="premium-card">
        <p className="eyebrow">Timeline</p>
        <h3>Effort overview</h3>

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