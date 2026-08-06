class AnalyticsService:

    @staticmethod
    def detect_chart(question: str):

        question = question.lower()

        keywords = [

            "chart",

            "graph",

            "department wise",

            "month wise",

            "year wise",

            "distribution",

            "statistics",

            "analytics",

            "trend",

            "compare"

        ]

        return any(k in question for k in keywords)