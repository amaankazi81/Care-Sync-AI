import time
from typing import Any


class CacheService:

    _cache = {}

    CACHE_DURATION = 1800

    @staticmethod
    def _generate_key(question: str, role: str):

        return f"{role}:{question}"

    @classmethod
    def get(cls, question: str, role: str):

        key = cls._generate_key(question, role)

        if key not in cls._cache:
            return None

        value, timestamp = cls._cache[key]

        if time.time() - timestamp > cls.CACHE_DURATION:

            del cls._cache[key]
            return None

        return value

    @classmethod
    def set(cls, question: str, role: str, value: Any):

        key = cls._generate_key(question, role)

        cls._cache[key] = (
            value,
            time.time()
        )

    @classmethod
    def clear(cls):

        cls._cache.clear()

    @classmethod
    def clear_patient_cache(cls, patient_id: str):

        keys = [
            key
            for key in cls._cache
            if key.startswith(f"{patient_id}:")
        ]

        for key in keys:
            del cls._cache[key]