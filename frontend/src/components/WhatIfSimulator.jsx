import { useState } from "react";

function WhatIfSimulator({ result }) {
  const [extraHours, setExtraHours] = useState(2);

  const risk = result.decision_result?.risk_report?.[0]?.risk_score || 50;
  const success = result.decision_result?.success_probability || 50;

  const improvedRisk = Math.max(5, risk - extraHours * 4);
  const improvedSuccess = Math.min(95, success + extraHours * 5);

  return (
    <section className="premium-card simulator-polish">
      <p className="eyebrow">Simulation</p>
      <h3>What if you study extra?</h3>

      <div className="simulator-control">
        <div>
          <span>Extra study per day</span>
          <b>{extraHours} hrs/day</b>
        </div>

        <input
          type="range"
          min="0"
          max="6"
          value={extraHours}
          onChange={(e) => setExtraHours(Number(e.target.value))}
        />
      </div>

      <div className="simulator-results">
        <div>
          <span>New Risk</span>
          <b>{improvedRisk}/100</b>
        </div>

        <div>
          <span>Success</span>
          <b>{improvedSuccess}%</b>
        </div>

        <div>
          <span>Impact</span>
          <b>{extraHours === 0 ? "No change" : "Improved"}</b>
        </div>
      </div>
    </section>
  );
}

export default WhatIfSimulator;