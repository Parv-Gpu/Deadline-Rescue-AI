import json
from services.gemini_service import ask_gemini


def run_decision_agent(tasks_result, execution_result, user_input: str):
    prompt = f"""
You are a combined agent system containing:
1. Risk Prediction Agent
2. Recovery Planner Agent
3. Productivity Coach Agent
4. Habit Tracker Agent
5. Notification Agent
6. Action Bucket Agent

User input:
{user_input}

Tasks:
{json.dumps(tasks_result, indent=2)}

Execution Plan:
{json.dumps(execution_result, indent=2)}

Return ONLY valid JSON.

JSON format:
{{
  "risk_report": [
    {{
      "task_name": "",
      "parent_task": "",
      "risk_score": 0,
      "risk_level": "",
      "risk_reason": "",
      "risk_reduction_action": "",
      "confidence_score": 0.0
    }}
  ],
  "recovery_plan": [
    {{
      "task_name": "",
      "problem": "",
      "recovery_action": "",
      "what_to_skip": "",
      "next_24_hours_focus": ""
    }}
  ],
  "action_buckets": {{
    "must_do": [],
    "should_do": [],
    "can_skip": []
  }},
  "productivity_advice": [
    {{
      "advice_title": "",
      "advice": "",
      "reason": ""
    }}
  ],
  "habit_report": {{
    "consistency_score": 0,
    "streak_status": "",
    "habit_strength": "",
    "improvement_tip": ""
  }},
  "notifications": [
    {{
      "type": "",
      "message": ""
    }}
  ],
  "overall_summary": "",
  "overall_confidence_score": 0.0
}}

Rules:
- risk_score must be from 0 to 100.
- risk_level must be one of: High, Medium, Low.
- High = 71-100, Medium = 36-70, Low = 0-35.
- confidence_score and overall_confidence_score must be between 0 and 1.
- Do not create long paragraphs.
- risk_reason max 25 words.
- risk_reduction_action max 20 words.
- recovery_action max 25 words.
- productivity advice must be specific to the user's tasks.
- Avoid generic advice like "use Pomodoro" unless directly useful.
- Notifications should be contextual and urgent.
- Mention wedding/family event as availability blocker, not productivity task.
- Habit report should say insufficient historical data if no completion history is provided.
- action_buckets must contain concrete task names.
- must_do = tasks needed to avoid missing deadline.
- should_do = tasks useful after must_do.
- can_skip = low-impact or polish tasks.
"""

    response = ask_gemini(prompt)
    response = response.replace("```json", "").replace("```", "").strip()
    return json.loads(response)