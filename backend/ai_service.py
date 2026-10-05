from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_followup(name, company, event, notes):
    prompt = f"""
Write a short and professional follow-up email for a person I met at a business event.

Name: {name}
Company: {company}
Event: {event}
Notes: {notes}

Requirements:
- Keep it friendly and professional.
- Mention the event.
- Refer to the notes naturally.
- Include a clear next step.
- Do not invent any information.
- Return only the email body.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text