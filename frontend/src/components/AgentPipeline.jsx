const agents = [
  "Input",
  "Tasks",
  "Dates",
  "Effort",
  "Priority",
  "Planner",
  "Risk",
  "Recovery",
  "Final Plan",
];

function AgentPipeline() {
  return (
    <div className="pipeline-card">
      <h3>Agent Workflow</h3>
      <div className="pipeline">
        {agents.map((agent, index) => (
          <div className="pipeline-step" key={agent}>
            <span>{agent}</span>
            {index !== agents.length - 1 && <b>→</b>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentPipeline;