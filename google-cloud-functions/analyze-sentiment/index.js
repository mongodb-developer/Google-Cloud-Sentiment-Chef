const functions = require('@google-cloud/functions-framework');
const { VertexAI } = require('@google-cloud/vertexai');
const dJSON = require('dirty-json');

const projectId = 'atlas-ai-demos';
const location = 'us-central1';
const model = 'gemini-1.0-pro';

const prompt = `
Analyze the sentiment of this restaurant review.
Assign a total score and scores for the food, the service, and the interior. The scores should be from 1 to 5 with 1 being the lowest and 5 — the highest. If there's no sufficient data for some of the scores, return 0 (as a Number).
When assigning scores and overal sentiment take into account both the review text and the sentiments of the attached images and videos.
Return the response in JSON format [{}]. "sentiment" - "positive", "negative", or "neutral", "food" (0-5), "service" (0-5), "interior" (0-5).  The returned object should always be valid JSON.
Return the result 'Invalid review', formatted as a JSON object, for any reviews that aren't contextually related to the restaurant, contain inappropriate language, and/or are meaningless.
`;

// Sample prompts that will be used when sending the few-shot prompt
const samplePrompts = [
  {
    text: `
${prompt}

Sentiments of the images and videos attached to the review start here.
Attached media 1 - The sentiment of the image is positive.
Sentiments of the attached images and videos end here.

Review text starts here.
The restaurant was nice.
We went here for dinner. The food didn't live up to the expectations but the service was impeccable.

Review text ends here.
`
  },
  {
    text: `{ "sentiment": "positive", "food": 3, "service": 5, "interior": 5 }`
  },
  {
    text: `
${prompt}

Sentiments of the images and videos attached to the review start here.
Attached media 1 - The sentiment of the image is positive.
Sentiments of the attached images and videos end here.

Review text starts here.
It was fine.
Review text ends here.
`
  },
  {
    text: `{ "sentiment": "positive", "food": 0, "service": 0, "interior": 0 }`
  },
    {
    text: `
${prompt}

Sentiments of the images and videos attached to the review start here.
Attached media 1 - The sentiment of the image is negative.
Sentiments of the attached images and videos end here.

Review text starts here.
It was fine.
Review text ends here.
`
  },
  {
    text: `{ "sentiment": "negative", "total": 0, "food": 0, "service": 0, "interior": 0 }`
  },
];

functions.http('analyzeReview', async (req, res) => {
  const text = req.body.text;
  const fileDescriptions = req.body.fileDescriptions || [];
  if (!text) {
    return res.status(400).send('You must provide text');
  }

  const response = await createNonStreamingMultipartContent(text, fileDescriptions);

  try {
    const sanitizedResponse = response.replace(/^\s*```json\n|\n```$/g, '').match(/{.*?}/)[0];
    const parsedResponse = dJSON.parse(sanitizedResponse);

    console.log("PARSED RESPONSE ------->>>", parsedResponse);

    return res.send(parsedResponse);
  } catch (error) {
    console.error('Failed to parse model response: ', response, error);
    // Return unparsed response
    return res.send({ response });
  }
});

async function createNonStreamingMultipartContent(
  review,
  fileDescriptions
) {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({project: projectId, location });

  // Instantiate the model
  const generativeVisionModel = vertexAI.getGenerativeModel({
    model,
    generation_config: {
      max_output_tokens: 60,
      // Lower temperature for more predictable analysis
      temperature: 0.2,
    },
  });

  const textPart = {
    text: `
${prompt}

Sentiments of the images and videos attached to the review start here.
${fileDescriptions.join('\n')}
Sentiments of the attached images and videos end here.

Review text starts here.
${review}
Review text ends here.
`
  };

  const request = {
    contents: [
      {
        role: 'user',
        parts: [
          ...samplePrompts,
          textPart
        ]
      }
    ],
  };

  const responseStream =
    await generativeVisionModel.generateContentStream(request);

  // Wait for the response stream to complete
  const aggregatedResponse = await responseStream.response;

  // Select the text from the response
  const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text;

  return fullTextResponse;
}
