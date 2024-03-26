import json

import requests


def test_data_api():
    url = "https://us-east-1.aws.data.mongodb-api.com/app/***REMOVED***/endpoint/data/v1/action/findOne"

    payload = json.dumps(
        {
            "collection": "restaurants",
            "database": "sample_restaurants",
            "dataSource": "mongodb-atlas",
            "projection": {"_id": 1},
        }
    )
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        # "api-key": "***REMOVED***",
        "Accept": "application/ejson",
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)


#
#
# {"name": "Dominic"}
# DoNotDeleteAwsSummitDemo
# ***REMOVED***
#
#
#
# curl --location --request POST '***REMOVED***' \
# --header 'Content-Type: application/json' \
# --header 'Access-Control-Request-Headers: *' \
# --header 'api-key: ***REMOVED***' \
# --header 'Accept: application/ejson' \
# --data-raw '{
# "collection":"<COLLECTION_NAME>",
#   "database":"<DATABASE_NAME>",
#   "dataSource":"Cluster0",
#   "projection": {"_id": 1}
# }'
#
#
