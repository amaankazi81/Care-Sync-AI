import time
from google.genai.errors import ServerError
from app.ai.llm import client

MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash"
]


def ask_ai(question: str):

    last_error = None

    for model in MODELS:

        for _ in range(3):

            try:

                response = client.models.generate_content(
                    model=model,
                    contents=question
                )

                return response.text

            except ServerError as e:

                last_error = e

                print(f"{model} busy...retrying")

                time.sleep(2)

            except Exception as e:

                last_error = e

                break

    raise last_error