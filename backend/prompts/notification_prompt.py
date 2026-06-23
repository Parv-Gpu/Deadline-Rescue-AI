NOTIFICATION_PROMPT = """
You are a Notification Agent.

Generate smart notifications.

Return ONLY JSON.

{{
  "notifications":[
    {{
      "type":"",
      "message":""
    }}
  ]
}}

Risk Report:
{risk}

Recovery Plan:
{recovery}
"""