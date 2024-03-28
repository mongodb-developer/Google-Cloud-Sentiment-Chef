import json
from typing import Dict, Any

from aws_lambda_functions.summarize_review_sentiment import lambda_function


def test_lambda_handler():
    event = {
        "body": '"{\\"query\\":\\"Everything was great. | Oh what a lovely restaurant. | This was great. | I\'m coming back.\\"}"',
    }

    response: Dict[str, Any] = lambda_function.lambda_handler(event, None)

    response_body: str = response["body"]
    completion: Dict[str, str] = json.loads(response_body)

    assert completion is not None
    assert len(completion) > 0
    assert "completion" in completion
    assert completion["completion"] is not None
    assert len(completion["completion"]) > 0
