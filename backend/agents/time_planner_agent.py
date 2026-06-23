import json

from services.gemini_service import ask_gemini
from prompts.time_planner_prompt import TIME_PLANNER_PROMPT


def create_time_plan(tasks, priority, user_input):

    prompt = TIME_PLANNER_PROMPT.format(
        tasks=json.dumps(tasks, indent=2),
        priority=json.dumps(priority, indent=2),
        user_input=user_input
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)