import json
from typing import Dict, Any

import pytest

from aws_lambda_functions.analyze_sentiment import lambda_function


@pytest.mark.repeat(5)
@pytest.mark.parametrize(
    "query",
    [
        "Such a great design, and the staff was nice too. Unfortunately, my food was cold.",
        "So yummi! The service was great, but the interior was a bit too dark for my taste.",
        "The food was delicious, but the service was slow. The interior was nice though.",
        "The food was terrible, the service was bad, and the interior was dirty.",
        "The food was okay, the service was good, and the interior was nice.",
        "The food was great, the service was good, and the interior was nice.",
        "Great food." "They were super unfriendly." "What a great place!",
        "What a horrible place!",
        "Well, where do I even start ...",
        "So so.",
        "Coulda been worse.",
        "We'll come back for sure!",
    ],
)
def test_lambda_handler(query: str):
    event: Dict[str, Any] = {"queryStringParameters": {"query": query}}

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
