import json
from typing import Dict, List, Any, Final

import boto3

_ENDPOINT_NAME: Final[str] = "jumpstart-dft-hf-llm-mistral-7b-ins-20240326-085341"
_INFERENCE_COMPONENT_NAME: Final[str] = "huggingface-llm-mistral-7b-instruct-20240326-085342"
_REGION: Final[str] = "us-east-1"

sagemaker = boto3.client("sagemaker-runtime", region_name=_REGION)


# noinspection PyUnusedLocal
def lambda_handler(event, context):
    print(f"{event=}")
    try:
        body = json.loads(event.get("body", "{}"))

        input_query = body.get("query", "")
        if input_query:
            completion: Dict[str, int] = get_completion(input_query)
            return {"statusCode": 200, "body": json.dumps(completion)}
        else:
            return {"statusCode": 400, "body": json.dumps({"error": "No input data provided."})}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


def get_completion(review: str) -> Dict[str, int]:
    instructions: str = (
        "[INST]In the following I will provide you with a review for a restaurant written in prose by a customer. "
        "Your task is to analyze the sentiment of the review and give a score for the following categories: food, service, interior, total, sentiment. "
        "For all of them the score must be an integer between 1 and 5, where 1 is the lowest and 5 is the highest. "
        "If there is not enough information to give a score for a category, please return 0 for this category. "
        "Your answer must be a valid JSON (RFC 8259) and only that. No formatting or code blocks are allowed. "
        'Here is an example of what an answer might look like:\n\n{"total": 3, "interior": 2, "service": 4, "food": 3, "sentiment": 3}\n\n'
        'If you cannot create such a review, please return the following JSON instead:\n\n{"error": "Invalid review"}\n\n'
        f'Here is my input review:[/INST]\n\n{{"review": "{review}"}}\n\n'
        "Please remember the answer must be a valid JSON and only that. No formatting or code blocks are allowed. "
    )
    payload: str = json.dumps(
        {
            "inputs": instructions,
            "parameters": {
                "temperature": 0.2,
            },
        }
    )

    response: Dict[str, Any] = sagemaker.invoke_endpoint(
        EndpointName=_ENDPOINT_NAME,
        ContentType="application/json",
        InferenceComponentName=_INFERENCE_COMPONENT_NAME,
        Body=payload,
    )

    decoded_body: str = response["Body"].read().decode("utf-8")
    body_json: List[Dict[str, str]] = json.loads(decoded_body)
    sentiment: str = body_json[0]["generated_text"]

    # The model doesn't reliably return only the JSON, so we need to extract the JSON from it.
    sentiment = sentiment.split("{", 1)[1].rsplit("}", 1)[0]
    sentiment = "{" + sentiment + "}"

    sentiment_json: Dict[str, int] = json.loads(sentiment)

    # Sometimes keys are missing. Assuming that that means the model couldn't find enough information, we'll set them to 0.
    for score_key in ["total", "interior", "service", "food", "sentiment"]:
        if score_key not in sentiment_json:
            sentiment_json[score_key] = 0

    return sentiment_json
