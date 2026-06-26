import { useState } from "react";
import { speakText } from "../utils/exportUtils";

function CoachPanel({ result }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askCoach = () => {
    if (!result) {
      setAnswer("Generate a rescue plan first.");
      return;
    }

    const q = question.toLowerCase();

    const priority =
      result.execution_result?.priority_ranking?.[0]?.task_name ||
      "highest priority task";

    const risk =
      result.decision_result?.risk_report?.[0]?.risk_reason ||
      "No risk detected.";

    const recovery =
      result.decision_result?.recovery_plan?.[0]?.recovery_action ||
      "Follow today's rescue plan.";

    if (q.includes("first")) {
      setAnswer(`Start with ${priority}.`);
    } else if (q.includes("risk")) {
      setAnswer(risk);
    } else if (q.includes("recover")) {
      setAnswer(recovery);
    } else if (q.includes("skip")) {
      setAnswer("Skip low-impact UI polish until MVP is complete.");
    } else {
      setAnswer(result.decision_result?.overall_summary);
    }
  };

  const speak = () => {
    if (!answer) return;
    speakText(answer);
  };

  return (
    <>
      <button className="coach-button" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="coach-window">
          <h3>AI Coach</h3>

          <input
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="coach-actions">
            <button onClick={askCoach}>Ask</button>
            <button onClick={speak}>🔊</button>
          </div>

          {answer && (
            <div className="coach-answer">
              {answer}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CoachPanel;