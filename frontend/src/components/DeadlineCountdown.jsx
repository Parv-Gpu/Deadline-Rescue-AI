function DeadlineCountdown({ tasks = [] }) {
  const dates = tasks
    .map((task) => task.normalized_date)
    .filter(Boolean)
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (!dates.length) return null;

  const nearest = new Date(Math.min(...dates.map((date) => date.getTime())));
  const today = new Date();

  const diffDays = Math.max(
    0,
    Math.ceil((nearest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  const status =
    diffDays <= 3 ? "critical" : diffDays <= 7 ? "urgent" : "on-track";

  return (
    <section>
      <h3>Deadline Countdown</h3>

      <div className={`countdown-card glass ${status}`}>
        <h2>{diffDays} Days Left</h2>
        <p>
          Nearest deadline: <b>{nearest.toDateString()}</b>
        </p>
        <span>{status.replace("-", " ").toUpperCase()}</span>
      </div>
    </section>
  );
}

export default DeadlineCountdown;