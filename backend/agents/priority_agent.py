import json

from services.gemini_service import ask_gemini
from prompts.priority_prompt import PRIORITY_PROMPT


def prioritize_tasks(tasks):

    prompt = PRIORITY_PROMPT.format(
        tasks=json.dumps(tasks, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)