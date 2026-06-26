import { useState } from "react";

function InputPanel({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [productivity, setProductivity] = useState("");
  const [focusLength, setFocusLength] = useState("60");
  const [unavailable, setUnavailable] = useState("");

  const handleSubmit = () => {
    const finalInput = `
${text}

Planner Preferences:
- Productive time: ${productivity || "not specified"}
- Preferred focus session length: ${focusLength} minutes
- Unavailable days or blockers: ${unavailable || "none"}
`.trim();

    onAnalyze(finalInput);
  };

  return (
    <section className="input-panel premium-card fade-in">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Rescue Input</p>
          <h2>What are you trying to finish?</h2>
          <p>
            Add your deadline, pending tasks, available hours, team members, and
            blockers.
          </p>
        </div>

        <button className="ghost-btn">Voice Input</button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: I have placement interviews in 15 days. Need to complete 80 Leetcode, DBMS, OS, CN, resume and HR."
      />

      <div className="planner-preferences">
        <div className="preference-field">
          <label>Productive time</label>
          <select
            value={productivity}
            onChange={(e) => setProductivity(e.target.value)}
          >
            <option value="">Select time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Custom timing mentioned in input">
              Custom timing mentioned
            </option>
          </select>
        </div>

        <div className="preference-field">
          <label>Focus session length</label>
          <select
            value={focusLength}
            onChange={(e) => setFocusLength(e.target.value)}
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="75">75 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
        </div>

        <div className="preference-field wide-field">
          <label>Unavailable days / blockers</label>
          <input
            value={unavailable}
            onChange={(e) => setUnavailable(e.target.value)}
            placeholder="Example: Wedding from 1–7 July, no work on Sunday"
          />
        </div>
      </div>

      <div className="example-row">
        <button
          className="example-chip"
          onClick={() =>
            setText(
              "I have placement interviews in 15 days.\n\nNeed:\n- 80 Leetcode questions\n- DBMS\n- OOPS\n- OS\n- CN\n- Resume\n- HR questions\n\nI can study 8 hours daily."
            )
          }
        >
          Placement Prep
        </button>

        <button
          className="example-chip"
          onClick={() =>
            setText(
              "We have a hackathon submission in 7 days.\n\nTeam:\nParv will do backend and AI agents.\nRahul will do frontend dashboard.\nAman will do PPT and demo video.\nPriya will do testing and documentation.\n\nNeed:\n- Backend API\n- AI agent pipeline\n- Frontend dashboard\n- Deployment\n- PPT\n- Demo video\n- Testing\n- Documentation\n\nWe can work 6 hours daily."
            )
          }
        >
          Hackathon
        </button>

        <button
          className="example-chip"
          onClick={() =>
            setText(
              "Our SaaS MVP launches in 12 days.\n\nTasks:\n- Complete backend APIs\n- Build frontend dashboard\n- Authentication\n- Payment integration\n- Testing\n- Deployment\n- Investor PPT\n- Demo video\n\nI can work 7 hours daily."
            )
          }
        >
          Startup MVP
        </button>
      </div>

      <button
        className="primary-action"
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
      >
        {loading ? "Generating Plan..." : "Generate Rescue Plan"}
      </button>
    </section>
  );
}

export default InputPanel;