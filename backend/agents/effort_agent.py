import json

from services.gemini_service import ask_gemini
from prompts.effort_prompt import EFFORT_PROMPT


def estimate_effort(tasks):

    prompt = EFFORT_PROMPT.format(
        tasks=json.dumps(tasks, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)