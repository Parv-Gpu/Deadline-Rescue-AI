import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function DashboardTab({ result }) {
  const tasks = result.tasks_result?.tasks || [];
  const risks = result.decision_result?.risk_report || [];
  const todayPlan = result.execution_result?.today_plan || [];
  const mvp = result.execution_result?.mvp_scope;

  const chartData = tasks
    .filter((task) => task.estimated_hours > 0)
    .map((task) => ({
      name: task.task_name,
      value: task.estimated_hours,
    }));

  const totalHours = chartData.reduce((sum, item) => sum + item.value, 0);

  const highestRisk = risks.length
    ? Math.max(...risks.map((risk) => risk.risk_score || 0))
    : 0;

  const riskColor =
    highestRisk >= 71 ? "#ef4444" : highestRisk >= 36 ? "#f59e0b" : "#22c55e";

  const successProbability = Math.max(5, 100 - highestRisk);
  const daysNeeded = Math.ceil(totalHours / 4);

  return (
    <div className="tab-page">
      <div className="dashboard-hero-grid">
        <div className="risk-gauge-card premium-card">
          <p className="eyebrow">Risk Gauge</p>

          <ResponsiveContainer width="100%" height={240}>
            <RadialBarChart
              innerRadius="72%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={[{ name: "Risk", value: highestRisk }]}
            >
              <RadialBar dataKey="value" fill={riskColor} cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="gauge-value">
            <h2>{highestRisk}/100</h2>
            <p>
              {highestRisk >= 71
                ? "High Risk"
                : highestRisk >= 36
                ? "Medium Risk"
                : "Low Risk"}
            </p>
          </div>
        </div>

        <div className="premium-card">
          <p className="eyebrow">Smart Insights</p>
          <h3>What the AI noticed</h3>

          <div className="insight-list">
            <p>• Total workload is {totalHours} hours.</p>
            <p>• Success probability is {successProbability}%.</p>
            <p>• Estimated completion needs {daysNeeded} focused days.</p>
            <p>
              • Skip:{" "}
              {mvp?.can_skip?.length ? mvp.can_skip.join(", ") : "non-essential polish"}.
            </p>
          </div>
        </div>

        <div className="premium-card">
          <p className="eyebrow">Completion Forecast</p>
          <h3>{successProbability}% success probability</h3>

          <div className="progress-track">
            <div
              className="progress-fill-blue"
              style={{ width: `${successProbability}%` }}
            ></div>
          </div>

          <p className="muted">
            Based on current risk, estimated effort, and available planning window.
          </p>
        </div>
      </div>

      <div className="dashboard-two-col">
        <section className="premium-card">
          <p className="eyebrow">Effort Distribution</p>
          <h3>Where your time is going</h3>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={115}
                  label={({ name, value }) => `${name}: ${value}h`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No effort data available.</p>
          )}
        </section>

        <section className="premium-card">
          <p className="eyebrow">Today</p>
          <h3>Rescue Plan</h3>

          <div className="timeline-list">
            {todayPlan.map((plan, index) => (
              <div className="timeline-block" key={index}>
                <span>{plan.time_block}</span>
                <h4>{plan.task_name}</h4>
                <p>{plan.focus_area}</p>
                <small>{plan.expected_output}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardTab;