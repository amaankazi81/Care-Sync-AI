import json
from typing import Any, Optional

from redis.exceptions import RedisError

from app.services.redis_service import redis_client


class CacheService:

    CACHE_DURATION = 1800  # 30 minutes

    @staticmethod
    def _generate_key(question: str, identifier: str) -> str:
        """
        Generate a Redis cache key.

        For SQL Analytics:
            identifier = role
            Example:
                ADMIN:How many patients?

        For Patient Document AI:
            identifier = patient_id
            Example:
                patient123:What does my report say?
        """

        return f"{identifier}:{question}"

    @classmethod
    def get(
        cls,
        question: str,
        identifier: str
    ) -> Optional[Any]:

        key = cls._generate_key(
            question,
            identifier
        )

        try:

            value = redis_client.get(key)

            if value is None:
                return None

            return json.loads(value)

        except (RedisError, json.JSONDecodeError):

            return None

    @classmethod
    def set(
        cls,
        question: str,
        identifier: str,
        value: Any
    ) -> bool:

        key = cls._generate_key(
            question,
            identifier
        )

        try:

            serialized_value = json.dumps(
                value,
                default=str
            )

            redis_client.setex(
                key,
                cls.CACHE_DURATION,
                serialized_value
            )

            return True

        except (RedisError, TypeError):

            return False

    @classmethod
    def clear(cls) -> bool:

        try:

            redis_client.flushdb()

            return True

        except RedisError:

            return False

    @classmethod
    def clear_patient_cache(
        cls,
        patient_id: str
    ) -> bool:

        try:

            # Patient cache keys start with:
            #
            # patient_id:question
            #
            # Example:
            # 12345:What does my report say?

            pattern = f"{patient_id}:*"

            keys = list(
                redis_client.scan_iter(
                    match=pattern
                )
            )

            if keys:

                redis_client.delete(
                    *keys
                )

            return True

        except RedisError:

            return False