from collections import defaultdict

patient_memory = defaultdict(list)


class PatientMemory:

    @staticmethod
    def add(patient_id: str, role: str, content: str):

        patient_memory[patient_id].append({
            "role": role,
            "content": content
        })

        # Keep only last 12 messages
        patient_memory[patient_id] = patient_memory[patient_id][-12:]

    @staticmethod
    def history(patient_id: str):

        return patient_memory.get(patient_id, [])

    @staticmethod
    def clear(patient_id: str):

        patient_memory.pop(patient_id, None)