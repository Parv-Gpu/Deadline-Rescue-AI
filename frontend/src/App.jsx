import { useEffect, useState } from "react";
import "./App.css";

import Headers from "./components/Headers.jsx";
import Sidebar from "./components/Sidebar.jsx";
import InputPanel from "./components/InputPanel.jsx";
import ExecutiveSummary from "./components/ExecutiveSummary.jsx";
import DashboardTab from "./components/DashboardTab.jsx";
import PlanningTab from "./components/PlanningTab.jsx";
import CalendarTab from "./components/CalendarTab.jsx";
import TeamMode from "./components/TeamMode.jsx";
import InsightTab from "./components/InsightTab.jsx";
import CoachPanel from "./components/CoachPanel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";

import { analyzeDeadline, getHistory, getHistoryById } from "./services/api";

const loadingSteps = [
  "Extracting tasks",
  "Normalizing deadlines",
  "Estimating effort",
  "Ranking priorities",
  "Predicting risks",
  "Building recovery plan",
];

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History load failed:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 900);

    return () => clearInterval(timer);
  }, [loading]);

  const handleAnalyze = async (userInput) => {
    setLoading(true);
    setStepIndex(0);

    try {
      const data = await analyzeDeadline(userInput);
      setResult(data);
      setActiveTab("dashboard");
      await loadHistory();
    } catch (error) {
      console.error("Analyze failed:", error);
      alert("Backend error. Make sure FastAPI is running on port 8000.");
    }

    setLoading(false);
  };

  const handleOpenHistory = async (id) => {
    try {
      const data = await getHistoryById(id);
      setResult(data.response || data);
      setActiveTab("dashboard");
    } catch (error) {
      console.error("History open failed:", error);
    }
  };

  const renderTab = () => {
    if (!result) {
      return (
        <div className="empty-state premium-card">
          <h2>Start by describing your deadlines</h2>
          <p>
            Use text or voice input. Deadline Rescue AI will generate a risk
            score, recovery plan, schedule, team split, and calendar export.
          </p>
        </div>
      );
    }

    if (activeTab === "dashboard") return <DashboardTab result={result} />;
    if (activeTab === "planning") return <PlanningTab result={result} />;
    if (activeTab === "calendar") return <CalendarTab result={result} />;
    if (activeTab === "team") return <TeamMode tasks={result.tasks_result?.tasks || []} />;
    if (activeTab === "insights") return <InsightTab result={result} history={history} />;

    return <DashboardTab result={result} />;
  };

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="app-main">
        <Headers darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="main-grid">
          <div className="content-column">
            <InputPanel onAnalyze={handleAnalyze} loading={loading} />

            {loading && (
              <div className="loading-panel premium-card">
                <div className="spinner"></div>
                <span>{loadingSteps[stepIndex]}...</span>
              </div>
            )}

            {result && <ExecutiveSummary result={result} />}

            {renderTab()}
          </div>

          <aside className="right-column">
            <HistoryPanel history={history} onOpenHistory={handleOpenHistory} />
          </aside>
        </div>
      </div>

      <CoachPanel result={result} />
    </div>
  );
}

export default App;