import { useState } from "react";

function WhatIfSimulator({ result }) {

  const [extraHours,setExtraHours]=useState(2);

  if(!result) return null;

  const risk=result.decision_result?.risk_report?.[0]?.risk_score || 80;

  const newRisk=Math.max(5,risk-extraHours*4);

  const probability=100-newRisk;

  return(

<section className="premium-card">

<p className="eyebrow">Simulation</p>

<h3>What If Simulator</h3>

<label>

Extra Study Hours / Day

<input

type="range"

min="0"

max="8"

value={extraHours}

onChange={(e)=>setExtraHours(Number(e.target.value))}

/>

</label>

<div className="sim-grid">

<div>

<h4>{extraHours} hrs/day</h4>

<p>Additional Work</p>

</div>

<div>

<h4>{newRisk}</h4>

<p>New Risk</p>

</div>

<div>

<h4>{probability}%</h4>

<p>Success</p>

</div>

</div>

</section>

  )

}

export default WhatIfSimulator;