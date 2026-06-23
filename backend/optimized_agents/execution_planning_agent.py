import json
from services.gemini_service import ask_gemini


def run_execution_planning(tasks_result, user_input: str):
    prompt = f"""
You are a combined agent system containing:
1. Priority Agent
2. Time Planner Agent
3. Calendar Agent
4. MVP Scope Agent

User input:
{user_input}

Tasks and availability blockers:
{json.dumps(tasks_result, indent=2)}

Return ONLY valid JSON.

JSON format:
{{
  "priority_ranking": [
    {{
      "task_name": "",
      "parent_task": "",
      "priority_score": 0,
      "priority_level": "",
      "reason": "",
      "confidence_score": 0.0
    }}
  ],
  "today_plan": [
    {{
      "time_block": "",
      "task_name": "",
      "focus_area": "",
      "expected_output": ""
    }}
  ],
  "calendar_events": [
    {{
      "title": "",
      "start_time": "",
      "end_time": ""
    }}
  ],
  "mvp_scope": {{
    "must_have": [],
    "should_have": [],
    "can_skip": []
  }},
  "planning_strategy": ""
}}

Rules:
- priority_score must be from 0 to 100.
- priority_level must be one of: Critical, High, Medium, Low.
- Use 90-100 for urgent deadline-critical tasks.
- Use 70-89 for important near-deadline tasks.
- Use 40-69 for useful but not urgent tasks.
- Use below 40 for low urgency tasks.
- Do not rank parent tasks above concrete subtasks unless parent itself needs action.
- If parent task estimated_hours is 0, prioritize its subtasks.
- If user studies at night, schedule deep work at night.
- The user studies from 10 PM to 4 AM if mentioned.
- Add realistic breaks.
- Do not schedule more than 6 focused hours in one night.
- Today's plan should focus mainly on Critical and High tasks.
- Calendar events should include every today_plan block.
- Calendar start_time and end_time should be ISO-like strings.
- mvp_scope must be specific to project/hackathon tasks.
- must_have = required for working submission.
- should_have = improves quality but not mandatory.
- can_skip = features to drop under deadline pressure.
- Keep reasons short, max 20 words.
- confidence_score must be between 0 and 1.
"""

    response = ask_gemini(prompt)
    response = response.replace("```json", "").replace("```", "").strip()
    return json.loads(response)