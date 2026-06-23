import json

from services.gemini_service import ask_gemini
from prompts.date_prompt import DATE_PROMPT


def normalize_dates(tasks):
    prompt = DATE_PROMPT.format(
        tasks=json.dumps(tasks, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)