function RiskBreakdown({ highestRisk = 0, totalHours = 0 }) {
  const timeRisk = highestRisk;
  const workloadRisk = Math.min(100, totalHours * 4);
  const burnoutRisk = totalHours > 30 ? 80 : totalHours > 18 ? 55 : 25;

  const rows = [
    { label: "Deadline Risk", value: timeRisk },
    { label: "Workload Risk", value: workloadRisk },
    { label: "Burnout Risk", value: burnoutRisk },
  ];

  return (
    <section>
      <h3>Risk Breakdown</h3>

      <div className="grid">
        {rows.map((row) => (
          <div className="card glass" key={row.label}>
            <h4>{row.label}</h4>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${row.value}%` }}></div>
            </div>
            <p>{row.value}/100</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RiskBreakdown;