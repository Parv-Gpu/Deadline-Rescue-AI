import json

from services.gemini_service import ask_gemini
from prompts.coach_prompt import COACH_PROMPT


def generate_productivity_advice(user_input, tasks, risk, today_plan, recovery):
    prompt = COACH_PROMPT.format(
        user_input=user_input,
        tasks=json.dumps(tasks, indent=2),
        risk=json.dumps(risk, indent=2),
        today_plan=json.dumps(today_plan, indent=2),
        recovery=json.dumps(recovery, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)