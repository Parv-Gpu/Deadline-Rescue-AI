import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash-lite")


def ask_gemini(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Gemini API Error:", e)
        raise e