import json
from services.gemini_service import ask_gemini


def run_extraction_planning(user_input: str):
    prompt = f"""
You are a combined agent system containing:
1. Task Extraction Agent
2. Date Normalization Agent
3. Effort Estimation Agent
4. Availability Blocker Detection Agent

Current date: 24 June 2026.

User input:
{user_input}

Return ONLY valid JSON.

JSON format:
{{
  "tasks": [
    {{
      "task_name": "",
      "parent_task": "",
      "deadline_text": "",
      "normalized_date": "",
      "estimated_hours": 0,
      "category": "",
      "task_type": "",
      "effort_reason": "",
      "confidence_score": 0.0
    }}
  ],
  "availability_blockers": [
    {{
      "event_name": "",
      "date_range": "",
      "normalized_start_date": "",
      "normalized_end_date": "",
      "impact": "",
      "active_commitment_hours": 0
    }}
  ]
}}

Rules:
- Never use 2024 or any past year.
- If user says 29 June, use normalized_date = "2026-06-29".
- If user says 15 July, use normalized_date = "2026-07-15".
- If deadline is missing, normalized_date should be null.
- Use parent_task for subtasks.
- Frontend, Backend, Deployment, Documentation, Demo Video should have parent_task = "Hackathon Submission" if hackathon is mentioned.
- Do NOT duplicate effort.
- If subtasks are listed, parent task estimated_hours must be 0.
- Personal events like wedding, travel, family function are availability_blockers, not productivity tasks.
- Do NOT estimate wedding as 24 hours per day.
- For wedding from 1 July to 7 July, active_commitment_hours should usually be 35 to 50.
- Leetcode: estimate 45-60 minutes per question.
- Presentation: estimate 4-8 hours.
- Documentation: estimate 2-4 hours.
- Demo video: estimate 3-5 hours.
- Deployment: estimate 3-6 hours.
- Frontend/backend hackathon work: estimate 6-12 hours each.
- task_type must be one of: "parent", "subtask", "standalone".
- confidence_score must be between 0 and 1.
"""

    response = ask_gemini(prompt)
    response = response.replace("```json", "").replace("```", "").strip()
    return json.loads(response)