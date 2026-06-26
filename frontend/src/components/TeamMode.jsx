function extractTeamMembers(tasks = []) {
  return [];
}

function TeamMode({ tasks = [] }) {
  const members = extractTeamMembers(tasks);
  const subtasks = tasks.filter((task) => task.task_type !== "parent");

  const hasRealTeam = false;

  return (
    <section className="premium-card">
      <p className="eyebrow">Team Planner</p>
      <h3>Work distribution</h3>

      {!hasRealTeam && (
        <div className="team-note">
          If you have a team, mention names and roles in the input. Example:
          “Parv will do backend, Rahul will do frontend, Aman will make PPT.”
        </div>
      )}

      <div className="team-grid">
        {subtasks.map((task, index) => (
          <div className="team-card" key={index}>
            <div className="avatar">{task.task_name?.[0] || "T"}</div>

            <div>
              <h4>{task.task_name}</h4>
              <p>
                <b>Recommended owner:</b>{" "}
                {hasRealTeam ? members[index % members.length] : "Assign based on skill"}
              </p>
              <p><b>Effort:</b> {task.estimated_hours} hrs</p>
              <p className="muted">
                Assignment is suggestion-based unless team roles are provided.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeamMode;