import redis

from app.core.config import settings


redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD or None,
    decode_responses=True
)


def check_redis_connection() -> bool:
    try:
        redis_client.ping()
        return True
    except redis.RedisError:
        return False