import functions_framework
import json
import vertexai
from vertexai.preview.language_models import TextGenerationModel

API_ENDPOINT = "***REMOVED***"
PROJECT_ID = "atlas-ai-demos"
MODEL_ID = "text-bison@001"


@functions_framework.http
def analyze_sentiment(request):
    request_json = request.get_json(silent=True)

    if request_json and "text" in request_json:
        text = request_json["text"]
    else:
        return "'text' argument required."

    try:
        sentiment = predict_large_language_model_sample(
            "atlas-ai-demos",
            "text-bison@001",
            0.2,
            256,
            0.8,
            40,
            """Can you analyze the sentiment of this restaurant review and give a total score and scores for the food, the service, and the interior? The scores should be from 1 to 5 with 1 being the lowest and 5 — the highest. If there's no sufficient data for some of the scores, return 0 (as a Number). Format the response as a JSON object. The valid fields are 'total', 'interior', 'service', 'food', and 'sentiment'.
            Can you please return the result 'Invalid review', formatted as a JSON object, for any reviews that aren't contextually related to the restaurant, contain inappropriate language, and/or are meaningless?
            
                Review:
                {review}

                input: 
                output:
            """.format(
                review=text
            ),
            "us-central1",
        )

        print(f"Sentiment is: {sentiment}")

        data = {"sentiment": sentiment}
        return json.dumps(data), 200, {"Content-Type": "application/json"}
    except:
        print("Analyzing sentiment failed.")
        raise


def predict_large_language_model_sample(
    project_id: str,
    model_name: str,
    temperature: float,
    max_decode_steps: int,
    top_p: float,
    top_k: int,
    content: str,
    location: str = "us-central1",
    tuned_model_name: str = "",
):
    """Predict using a Large Language Model."""
    vertexai.init(project=project_id, location=location)
    model = TextGenerationModel.from_pretrained(model_name)
    if tuned_model_name:
        model = model.get_tuned_model(tuned_model_name)
    response = model.predict(
        content,
        temperature=temperature,
        max_output_tokens=max_decode_steps,
        top_k=top_k,
        top_p=top_p,
    )
    print(f"Response from Model: {response}")
    return response.text
