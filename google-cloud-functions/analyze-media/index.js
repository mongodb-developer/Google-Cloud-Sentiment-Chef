const functions = require('@google-cloud/functions-framework');
const { VertexAI } = require('@google-cloud/vertexai');

const projectId = 'atlas-ai-demos';
const location = 'us-central1';
const model = 'gemini-1.0-pro-vision';

const bucketName = '<add your Google Cloud Storage bucket here>';

const prompt = `
Analyze the sentiment of the photo/video.
Generate a description of the photo or video.
Generate 5 tags describing what's in the photo/video.
The information will be used for an application for restaurant reviews. The information must be relevant to the food, interior, service, and overal sentiment of the restaurant. 

The response must be a JSON object with the following definition:
Field - Type
sentiment - string
description - string
tags - array of strings
`;

const samples = [
  // Sample prompt with just a text review
  {
    text: prompt
  },
  {
    text: `{ "sentiment": "The sentiment in the image is positive.", "description": "A group of four friends are sitting at a table in a restaurant, laughing and talking.", "tags": ["beer", "outdoor seating", "nightlife"] }`
  }
];

functions.http('analyzeMedia', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  const fileName = req.query.fileName;
  const fileType = req.query.fileType;
  if (!fileName || !fileType) {
    return res.status(400).send('You must provide fileName and fileType.');
  }

  const file = {
    fileData: {
      fileUri: `${bucketName}/${fileName}`,
      mimeType: fileType
    }
  }

  const response = await createNonStreamingMultipartContent(file);

  try {
    const sanitizedResponse = response.replace(/^\s*```json\n|\n```$/g, '');
    const parsedResponse = JSON.parse(sanitizedResponse);
    return res.send(parsedResponse);
  } catch (error) {
    console.error('Failed to parse model response: ', response, error);
    // Return unparsed response
    return res.send({ response });
  }
});

async function createNonStreamingMultipartContent(
  filePart,
) {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({project: projectId, location });

  // Instantiate the model
  const generativeVisionModel = vertexAI.getGenerativeModel({ model });

  const textPart = {
    text: prompt
  };

  const request = {
    contents: [{role: 'user', parts: [...samples, filePart, textPart]}],
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
