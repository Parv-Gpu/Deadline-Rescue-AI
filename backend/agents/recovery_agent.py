import json

from services.gemini_service import ask_gemini
from prompts.recovery_prompt import RECOVERY_PROMPT


def create_recovery_plan(tasks, priority, risk, today_plan):
    prompt = RECOVERY_PROMPT.format(
        tasks=json.dumps(tasks, indent=2),
        priority=json.dumps(priority, indent=2),
        risk=json.dumps(risk, indent=2),
        today_plan=json.dumps(today_plan, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)