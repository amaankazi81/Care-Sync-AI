from collections import defaultdict

# Temporary in-memory storage
conversation_memory = defaultdict(list)


class MemoryService:

    @staticmethod
    def add_message(session_id: str, role: str, content: str):

        conversation_memory[session_id].append(
            {
                "role": role,
                "content": content
            }
        )

        # Keep only last 10 messages
        conversation_memory[session_id] = \
            conversation_memory[session_id][-10:]

    @staticmethod
    def get_history(session_id: str):

        return conversation_memory.get(session_id, [])

    @staticmethod
    def clear(session_id: str):

        conversation_memory.pop(session_id, None)