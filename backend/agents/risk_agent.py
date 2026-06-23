import json

from services.gemini_service import ask_gemini
from prompts.risk_prompt import RISK_PROMPT


def predict_risk(tasks, priority, today_plan, user_input):

    prompt = RISK_PROMPT.format(
        tasks=json.dumps(tasks, indent=2),
        priority=json.dumps(priority, indent=2),
        today_plan=json.dumps(today_plan, indent=2),
        user_input=user_input
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)