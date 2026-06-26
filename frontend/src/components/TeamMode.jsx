function cleanSkill(skill = "") {
  return skill.toLowerCase().replace(/[.,]/g, "").replace(/\band\b/g, " ").trim();
}

function parseTeamMembers(input = "") {
  const members = [];
  const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);

  const patterns = [
    /^([A-Za-z]+)\s+will\s+do\s+(.+)$/i,
    /^([A-Za-z]+)\s+will\s+work\s+on\s+(.+)$/i,
    /^([A-Za-z]+)\s+will\s+make\s+(.+)$/i,
    /^([A-Za-z]+)\s+does\s+(.+)$/i,
    /^([A-Za-z]+)\s*-\s*(.+)$/i,
  ];

  const invalid = new Set([
    "need",
    "tasks",
    "team",
    "calendar",
    "planning",
    "backend",
    "frontend",
    "deployment",
    "documentation",
    "testing",
  ]);

  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (!match) continue;

      const name = match[1].trim();
      const skill = match[2].trim();

      if (!invalid.has(name.toLowerCase())) {
        members.push({
          name,
          skill,
          normalizedSkill: cleanSkill(skill),
        });
      }
      break;
    }
  }

  const unique = [];
  const seen = new Set();

  for (const member of members) {
    const key = member.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(member);
    }
  }

  return unique;
}

function getTaskKeywords(taskName = "") {
  const text = taskName.toLowerCase();

  if (text.includes("backend") || text.includes("api") || text.includes("agent")) {
    return ["backend", "api", "agent", "ai"];
  }

  if (text.includes("frontend") || text.includes("dashboard") || text.includes("ui")) {
    return ["frontend", "dashboard", "ui", "react"];
  }

  if (text.includes("ppt") || text.includes("presentation")) return ["ppt", "presentation"];
  if (text.includes("demo") || text.includes("video")) return ["demo", "video"];
  if (text.includes("testing") || text.includes("test")) return ["testing", "test"];
  if (text.includes("documentation") || text.includes("docs")) return ["documentation", "docs"];
  if (text.includes("deploy")) return ["deploy", "deployment"];

  return text.split(" ");
}

function assignOwner(task, members, index) {
  if (!members.length) return "Unassigned";

  const keywords = getTaskKeywords(task.task_name || "");

  const exact = members.find((member) =>
    keywords.some((keyword) => member.normalizedSkill.includes(keyword))
  );

  return exact?.name || members[index % members.length]?.name || "Unassigned";
}

function TeamMode({ tasks = [], userInput = "" }) {
  const members = parseTeamMembers(userInput);
  const subtasks = tasks.filter((task) => task.task_type !== "parent");

  return (
    <section className="premium-card fade-in">
      <p className="eyebrow">Team Planner</p>
      <h3>Smart work distribution</h3>

      {members.length === 0 ? (
        <div className="team-note">
          No team roles detected. Add lines like: “Parv will do backend”, “Rahul will do frontend”.
        </div>
      ) : (
        <div className="team-detected">
          <b>Team detected</b>
          <div>
            {members.map((member) => (
              <span key={member.name}>
                {member.name} → {member.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="team-grid polished">
        {subtasks.map((task, index) => {
          const owner = assignOwner(task, members, index);

          return (
            <div className="team-card polished" key={`${task.task_name}-${index}`}>
              <div className="avatar">{owner?.[0] || "U"}</div>

              <div>
                <h4>{task.task_name}</h4>
                <p><b>Owner:</b> {owner}</p>
                <p><b>Effort:</b> {task.estimated_hours || 0} hrs</p>
                <small>
                  {members.length
                    ? "Assigned using task keywords and team roles."
                    : "Waiting for team details."}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TeamMode;