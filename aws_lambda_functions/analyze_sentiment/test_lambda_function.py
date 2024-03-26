import json
from typing import Dict, Any

import pytest

from aws_lambda_functions.analyze_sentiment import lambda_function


# @pytest.mark.repeat(5)
# @pytest.mark.parametrize(
#     "query",
#     [
#         "Such a great design, and the staff was nice too. Unfortunately, my food was cold.",
#         "So yummi! The service was great, but the interior was a bit too dark for my taste.",
#         "The food was delicious, but the service was slow. The interior was nice though.",
#         "The food was terrible, the service was bad, and the interior was dirty.",
#         "The food was okay, the service was good, and the interior was nice.",
#         "The food was great, the service was good, and the interior was nice.",
#         "Great food." "They were super unfriendly." "What a great place!",
#         "What a horrible place!",
#         "Well, where do I even start ...",
#         "So so.",
#         "Coulda been worse.",
#         "We'll come back for sure!",
#     ],
# )
def test_lambda_handler():
    # event: Dict[str, Any] = {"queryStringParameters": {"query": query}}

    event = {
        "resource": "/sentiment",
        "path": "/sentiment",
        "httpMethod": "POST",
        "headers": {
            "Accept-Encoding": "gzip",
            "Content-Type": "application/json",
            "Host": "qz3pgn7nd5.execute-api.us-east-1.amazonaws.com",
            "User-Agent": "App-Services ***REMOVED***",
            "X-Amzn-Trace-Id": "Root=1-6602fbb9-3f27439965a6098642215bc8",
            "X-Forwarded-For": "34.193.91.42",
            "X-Forwarded-Port": "443",
            "X-Forwarded-Proto": "https",
        },
        "multiValueHeaders": {
            "Accept-Encoding": ["gzip"],
            "Content-Type": ["application/json"],
            "Host": ["qz3pgn7nd5.execute-api.us-east-1.amazonaws.com"],
            "User-Agent": ["App-Services ***REMOVED***"],
            "X-Amzn-Trace-Id": ["Root=1-6602fbb9-3f27439965a6098642215bc8"],
            "X-Forwarded-For": ["34.193.91.42"],
            "X-Forwarded-Port": ["443"],
            "X-Forwarded-Proto": ["https"],
        },
        "queryStringParameters": None,
        "multiValueQueryStringParameters": None,
        "pathParameters": None,
        "stageVariables": None,
        "requestContext": {
            "resourceId": "vx4d26",
            "resourcePath": "/sentiment",
            "httpMethod": "POST",
            "extendedRequestId": "VPxFGG5DIAMErnA=",
            "requestTime": "26/Mar/2024:16:45:45 +0000",
            "path": "/PROD/sentiment",
            "accountId": "722245653955",
            "protocol": "HTTP/1.1",
            "stage": "PROD",
            "domainPrefix": "qz3pgn7nd5",
            "requestTimeEpoch": 1711471545988,
            "requestId": "3555e141-8360-4f36-b49b-9141c2979c74",
            "identity": {
                "cognitoIdentityPoolId": None,
                "accountId": None,
                "cognitoIdentityId": None,
                "caller": None,
                "sourceIp": "34.193.91.42",
                "principalOrgId": None,
                "accessKey": None,
                "cognitoAuthenticationType": None,
                "cognitoAuthenticationProvider": None,
                "userArn": None,
                "userAgent": "App-Services ***REMOVED***",
                "user": None,
            },
            "domainName": "qz3pgn7nd5.execute-api.us-east-1.amazonaws.com",
            "deploymentId": "he3jro",
            "apiId": "qz3pgn7nd5",
        },
        "body": '"{\\"query\\":\\"qergqergeqrg\\"}"',
        "isBase64Encoded": False,
    }

    response: Dict[str, Any] = lambda_function.lambda_handler(event, None)

    response_body: str = response["body"]
    sentiment: Dict[str, int] = json.loads(response_body)
    assert sentiment is not None

    assert "total" in sentiment
    assert "interior" in sentiment
    assert "service" in sentiment
    assert "food" in sentiment
    assert "sentiment" in sentiment

    assert 0 <= sentiment["total"] <= 5
    assert 0 <= sentiment["interior"] <= 5
    assert 0 <= sentiment["service"] <= 5
    assert 0 <= sentiment["food"] <= 5
    assert 0 <= sentiment["sentiment"] <= 5
