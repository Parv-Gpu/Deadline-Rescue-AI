import json

from services.gemini_service import ask_gemini
from prompts.habit_prompt import HABIT_PROMPT


def analyze_habits(tasks, risk):

    prompt = HABIT_PROMPT.format(
        tasks=json.dumps(tasks, indent=2),
        risk=json.dumps(risk, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)