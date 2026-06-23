import json

from services.gemini_service import ask_gemini
from prompts.notification_prompt import NOTIFICATION_PROMPT


def generate_notifications(risk, recovery):

    prompt = NOTIFICATION_PROMPT.format(
        risk=json.dumps(risk, indent=2),
        recovery=json.dumps(recovery, indent=2)
    )

    response = ask_gemini(prompt)

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)