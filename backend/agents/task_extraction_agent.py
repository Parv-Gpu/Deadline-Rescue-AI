import json

from services.gemini_service import ask_gemini
from prompts.task_prompt import TASK_EXTRACTION_PROMPT


def extract_tasks(user_input: str):

    prompt = TASK_EXTRACTION_PROMPT.format(
        user_input=user_input
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)