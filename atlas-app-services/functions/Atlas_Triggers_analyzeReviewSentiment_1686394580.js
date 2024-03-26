const serviceName = "mongodb-atlas";
const databaseName = "sample_restaurants";
const collectionName = "processed_reviews";
const analyzeSentimentFunctionURL = "***REMOVED***";

exports = async function(changeEvent) {
  console.log("Trigger function started");

  const fullDocument = changeEvent?.fullDocument;
  const text = fullDocument?.text;

  if (!text) {
    console.error("Error: Review text is required");
    throw new Error("Review text is required");
  }

  console.log("Sending text to sentiment analysis:", text);

  let response;
  try {
    response = await context.http.post({
      url: analyzeSentimentFunctionURL,
      body: JSON.stringify({ query: text }), // Adjusted as per previous correction
      encodeBodyAsJSON: true
    });
  } catch (error) {
    console.error("Error calling sentiment analysis service:", error);
    throw new Error("Error calling sentiment analysis service");
  }

  console.log("Received response from sentiment analysis");

  let parsedResponse;
  try {
    if(response?.body?.text()) {
      console.log("Response body text:", response.body.text());
      parsedResponse = EJSON.parse(response.body.text());
      console.log("Parsed response:", parsedResponse);
    } else {
      console.error("Response body is empty or unable to call text() on it");
      throw new Error("Response body is empty or unable to call text() on it");
    }
  } catch (error) {
    console.error("Parsing sentiment analysis failed. Error:", error);
    throw new Error("Parsing sentiment analysis failed.");
  }

  if (!parsedResponse) {
    console.error("Sentiment analysis failed. Parsed response is undefined.");
    throw new Error("Sentiment analysis failed.");
  }

  if (parsedResponse?.sentiment === "Invalid review" || !parsedResponse?.sentiment) {
    console.error("Invalid review:", text);
    throw new Error("Invalid review: ", text);
  }

  const collection = context?.services?.get(serviceName)?.db(databaseName)?.collection(collectionName);
  if (!collection) {
    console.error("Fetching destination collection failed.");
    throw new Error("Fetching destination collection failed.");
  }

  try {
    await collection.insertOne({
      ...fullDocument,
      ...parsedResponse
    });
    console.log("Document inserted into collection successfully");
  } catch (error) {
    console.error("Inserting document into collection failed:", error);
    throw new Error("Inserting document into collection failed");
  }

  return parsedResponse;
};
