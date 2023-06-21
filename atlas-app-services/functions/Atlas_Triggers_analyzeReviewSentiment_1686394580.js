const serviceName = "M0";
const databaseName = "sample_restaurants";
const collectionName = "processed_reviews";
// Add the Google Cloud Function URL below
const analyzeSentimentFunctionURL = "<google-cloud-function-endpoint>";

exports = async function(changeEvent) {
  const fullDocument = changeEvent?.fullDocument;
  const text = fullDocument?.text;

  if (!text) {
    throw new Error("Review text is required");
  }

  const response = await context.http.post({
    url: analyzeSentimentFunctionURL,
    body: { text },
    encodeBodyAsJSON: true
  });
  
  let analysis;
  let parsedResponse;
  try {
    // The response body is a BSON.Binary object.
    analysis = EJSON.parse(response?.body?.text())?.sentiment;
    parsedResponse = JSON.parse(analysis);
  } catch (error) {
    throw new Error("Parsing sentiment analysis failed. " + analysis);
  }
  
  if (!parsedResponse) {
    throw new Error("Sentiment analysis failed.");
  }
  
  if (parsedResponse?.sentiment === "Invalid review" || !parsedResponse?.sentiment) {
    throw new Error("Invalid review: ", text);
  }

  const collection = context?.services?.get(serviceName)?.db(databaseName)?.collection(collectionName);

  if (!collection) {
    throw new Error("Fetching destination collection failed.");
  }
  
  await collection.insertOne({
    ...fullDocument,
    ...parsedResponse
  });
  
  return parsedResponse;
};