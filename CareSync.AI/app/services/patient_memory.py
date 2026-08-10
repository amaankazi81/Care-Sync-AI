import json
from typing import List, Dict, Any

from redis.exceptions import RedisError

from app.services.redis_service import redis_client


class PatientMemory:

    MEMORY_DURATION = 3600  # 1 hour

    @staticmethod
    def _generate_key(patient_id: str) -> str:
        return f"patient_memory:{patient_id}"

    @classmethod
    def history(
        cls,
        patient_id: str
    ) -> List[Dict[str, Any]]:

        key = cls._generate_key(patient_id)

        try:

            value = redis_client.get(key)

            if value is None:
                return []

            return json.loads(value)

        except (RedisError, json.JSONDecodeError):

            return []

    @classmethod
    def add(
        cls,
        patient_id: str,
        role: str,
        content: str
    ) -> bool:

        history = cls.history(patient_id)

        history.append({
            "role": role,
            "content": content
        })

        # Keep only recent 20 messages
        history = history[-20:]

        key = cls._generate_key(patient_id)

        try:

            redis_client.setex(
                key,
                cls.MEMORY_DURATION,
                json.dumps(history)
            )

            return True

        except RedisError:

            return False

    @classmethod
    def clear(
        cls,
        patient_id: str
    ) -> bool:

        key = cls._generate_key(patient_id)

        try:

            redis_client.delete(key)

            return True

        except RedisError:

            return False