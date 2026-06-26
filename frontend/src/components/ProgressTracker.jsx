function ProgressTracker({ tasks }) {

  const total = tasks.length;

  const completed = Math.floor(total * 0.35);

  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="premium-card">

      <p className="eyebrow">Progress</p>

      <h3>Completion Tracker</h3>

      <div className="progress-track">

        <div
          className="progress-fill-green"
          style={{
            width: `${percent}%`
          }}
        />

      </div>

      <div className="progress-footer">

        <span>{completed} Completed</span>

        <span>{total-completed} Remaining</span>

      </div>

    </section>
  );
}

export default ProgressTracker;