import { useState } from "react";

const examples = [
  {
    title: "Placement Prep",
    text: `I have placement interviews in 10 days.

Need to complete:
- 80 Leetcode questions
- Revise DBMS
- Revise OOPS
- Revise Operating System
- Revise Computer Networks
- Update Resume
- Prepare HR questions.`,
  },
  {
    title: "Hackathon",
    text: `Hackathon submission on 30 June.

Need to complete:
- Backend API
- Frontend Dashboard
- Deployment
- PPT
- Demo Video
- Testing.`,
  },
  {
    title: "Team Project",
    text: `We have a hackathon project due on 30 June.

Need to complete:
- Backend
- Frontend
- Deployment
- Documentation
- PPT
- Demo Video.`,
  },
];

function hasHours(text) {
  return /\d+\s*(hours|hrs|hour|hr)/i.test(text);
}

function hasTimePreference(text) {
  return /(morning|afternoon|evening|night|late night|9 am|10 pm|11 pm)/i.test(text);
}

function isProject(text) {
  return /(hackathon|project|frontend|backend|deployment|ppt|demo)/i.test(text);
}

function InputPanel({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [step, setStep] = useState("input");
  const [listening, setListening] = useState(false);

  const [answers, setAnswers] = useState({
    hours: "",
    timePreference: "",
    focusLength: "60",
    hasTeam: "",
    teamDetails: "",
    unavailableDays: "",
  });

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input works best in Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => `${prev} ${transcript}`.trim());
    };
    recognition.onerror = () => {
      setListening(false);
      alert("Voice input failed. Please allow microphone permission.");
    };
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const needsQuestions = () => {
    if (!text.trim()) return true;
    if (!hasHours(text)) return true;
    if (!hasTimePreference(text)) return true;
    if (isProject(text) && !answers.hasTeam) return true;
    return false;
  };

  const handleGenerate = () => {
    if (!text.trim()) return;

    if (needsQuestions()) {
      setStep("questions");
      return;
    }

    submitFinal();
  };

  const submitFinal = () => {
    const enrichedInput = `
${text}

Additional planning context:
- Available study/work hours per day: ${hasHours(text) ? "mentioned in input" : answers.hours}
- Preferred productive time: ${hasTimePreference(text) ? "mentioned in input" : answers.timePreference}
- Preferred focus session length: ${answers.focusLength} minutes
- Team project: ${answers.hasTeam || "not specified"}
- Team details: ${answers.teamDetails || "not provided"}
- Unavailable days / blockers: ${answers.unavailableDays || "none mentioned"}

Scheduling instructions:
- Do not schedule continuous work from morning to evening.
- Split work into morning/afternoon/evening sessions with real gaps.
- Do not do only one subject for a full day unless it is the only task left.
- Do not force every subject every day.
- Create a proper realistic schedule with 2-3 focus areas per day.
`;

    onAnalyze(enrichedInput);
    setStep("input");
  };

  return (
    <section className="input-panel premium-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Rescue Input</p>
          <h2>What are you trying to finish?</h2>
          <p className="muted">
            Add deadline, pending tasks, available hours, team members, and blockers.
          </p>
        </div>

        <button className="ghost-btn" onClick={startVoice}>
          {listening ? "Listening..." : "Voice Input"}
        </button>
      </div>

      {step === "input" && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your workload here..."
          />

          <div className="helper-text">
            Example: I have placement interviews in 10 days. Need 80 Leetcode,
            DBMS, OOPS, OS, CN, resume and HR.
          </div>

          <div className="example-row">
            {examples.map((item) => (
              <button
                key={item.title}
                className="example-chip"
                onClick={() => setText(item.text)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <button className="primary-action" onClick={handleGenerate} disabled={loading}>
            {loading ? "Building your plan..." : "Generate Rescue Plan"}
          </button>
        </>
      )}

      {step === "questions" && (
        <div className="question-flow">
          {!hasHours(text) && (
            <div className="question-card">
              <label>How many hours can you study/work per day?</label>
              <input
                placeholder="Example: 6 hours"
                value={answers.hours}
                onChange={(e) => setAnswers({ ...answers, hours: e.target.value })}
              />
            </div>
          )}

          {!hasTimePreference(text) && (
            <div className="question-card">
              <label>When are you usually productive?</label>
              <select
                value={answers.timePreference}
                onChange={(e) =>
                  setAnswers({ ...answers, timePreference: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="late night">Late Night</option>
              </select>
            </div>
          )}

          <div className="question-card">
            <label>Preferred focus session length?</label>
            <select
              value={answers.focusLength}
              onChange={(e) => setAnswers({ ...answers, focusLength: e.target.value })}
            >
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>

          {isProject(text) && (
            <>
              <div className="question-card">
                <label>Is this a team project?</label>
                <select
                  value={answers.hasTeam}
                  onChange={(e) => setAnswers({ ...answers, hasTeam: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="No, individual project">No</option>
                  <option value="Yes, team project">Yes</option>
                </select>
              </div>

              {answers.hasTeam === "Yes, team project" && (
                <div className="question-card">
                  <label>Team members and roles</label>
                  <textarea
                    placeholder="Example: Parv - Backend, Rahul - Frontend, Aman - PPT"
                    value={answers.teamDetails}
                    onChange={(e) =>
                      setAnswers({ ...answers, teamDetails: e.target.value })
                    }
                  />
                </div>
              )}
            </>
          )}

          <div className="question-card">
            <label>Any unavailable days or blockers?</label>
            <input
              placeholder="Example: Wedding from 1-7 July"
              value={answers.unavailableDays}
              onChange={(e) =>
                setAnswers({ ...answers, unavailableDays: e.target.value })
              }
            />
          </div>

          <div className="question-actions">
            <button className="ghost-btn" onClick={() => setStep("input")}>
              Back
            </button>
            <button className="primary-action" onClick={submitFinal} disabled={loading}>
              Generate Final Plan
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default InputPanel;