import json

from services.gemini_service import ask_gemini
from prompts.calendar_prompt import CALENDAR_PROMPT


def generate_calendar(today_plan):

    prompt = CALENDAR_PROMPT.format(
        today_plan=json.dumps(today_plan, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)