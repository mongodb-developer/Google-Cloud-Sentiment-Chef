import functions_framework
import json
import vertexai
from vertexai.preview.language_models import TextGenerationModel

API_ENDPOINT = 'us-central1-aiplatform.googleapis.com'
PROJECT_ID = 'atlas-ai-demos'
MODEL_ID = 'text-bison@001'
# Higher temperature for a more creative summary
TEMPERATURE = 0.5
MAX_DECODE_STEPS = 256
TOP_P = 0.8
TOP_K = 40
REGION = 'us-central1'

@functions_framework.http
def summarize_sentiment(request):
    request_json = request.get_json(silent=True)

    if request_json and 'text' in request_json:
        text = request_json['text']
    else:
        return '\'text\' argument required.'

    try:
        summary = predict_large_language_model_sample(
            PROJECT_ID,
            MODEL_ID,
            TEMPERATURE,
            MAX_DECODE_STEPS,
            TOP_P,
            TOP_K,
            '''Using sentiment analysis, create a 100-word summary of the customers' experiences at this restaurant based on the following reviews.

                Reviews:
                {reviews}

                input: 
                output:
            '''.format(reviews=text),
            REGION
            )

        print(f"Summary is: {summary}")

        data = { "summary": summary }
        return json.dumps(data), 200, {'Content-Type': 'application/json'}
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
    location: str,
    tuned_model_name: str = "",
    ) :
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
        top_p=top_p,)
    print(f"Response from Model: {response}")
    return response.text