import json
from typing import Dict, List, Any, Final

import boto3

_ENDPOINT_NAME: Final[str] = "jumpstart-dft-hf-llm-mistral-7b-ins-20240326-085341"
_INFERENCE_COMPONENT_NAME: Final[str] = (
    "huggingface-llm-mistral-7b-instruct-20240326-085342"
)
_REGION: Final[str] = "us-east-1"

sagemaker = boto3.client("sagemaker-runtime", region_name=_REGION)


# noinspection PyUnusedLocal
def lambda_handler(event, context):
    print(f"{event=}")
    try:
        body = json.loads(event.get("body", "{}"))
        # Directly use the parsed body as a dictionary.
        input_text = body.get("text", "")  # Change from 'query' to 'text'
        if input_text:
            completion: str = get_completion(input_text)
            return {"statusCode": 200, "body": json.dumps({"completion": completion})}
        else:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No input data provided."}),
            }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}


def get_completion(reviews: str) -> str:
    instructions: str = (
        f"[INST]Using sentiment analysis, create a maximum 100-word summary of the customers' experiences at this restaurant based on the following reviews. "
        f"Do not repeat the reviews in your answer. "
        f"Here are the reviews, separated by a pipe symbol: [/INST] {reviews} | "
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
    completion: str = body_json[0]["generated_text"]

    # There might be multiple "|" symbols in the completion, so we need to split by the last one
    completion = completion.rsplit("|")[-1].strip()

    return completion
