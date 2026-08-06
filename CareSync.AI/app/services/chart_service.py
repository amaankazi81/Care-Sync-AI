class ChartService:

    @staticmethod
    def create_chart(data):

        if not data:

            return None

        keys = list(data[0].keys())

        if len(keys) != 2:

            return None

        return {

            "type": "bar",

            "labels": [

                str(row[keys[0]])

                for row in data

            ],

            "values": [

                row[keys[1]]

                for row in data

            ]
        }