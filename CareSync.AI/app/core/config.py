from dotenv import load_dotenv
import os

load_dotenv()


class Settings:

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    DB_HOST = os.getenv("DB_HOST")

    DB_PORT = int(os.getenv("DB_PORT"))

    DB_NAME = os.getenv("DB_NAME")

    DB_USER = os.getenv("DB_USER")

    DB_PASSWORD = os.getenv("DB_PASSWORD")


settings = Settings()