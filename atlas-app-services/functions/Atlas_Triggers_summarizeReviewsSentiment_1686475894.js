const serviceName = "mongodb-atlas";
const databaseName = "sample_restaurants";
const reviewsCollectionName = "processed_reviews";
const restaurantCollectionName = "restaurants";
const summarizeFunctionURL = "***REMOVED***_summary";

exports = async function (changeEvent) {
  console.log("Trigger function started for restaurant review summary");

  const restaurantId = changeEvent.fullDocument.restaurant_id;
  if (!restaurantId) {
    console.error("Extracting restaurant ID from review document failed.");
    throw new Error("Extracting restaurant ID from review document failed.");
  }

  const restaurantCollection = getCollection(serviceName, databaseName, restaurantCollectionName);

  if (!await shouldUpdateSummary(restaurantCollection, restaurantId)) {
    console.log("Summary generation skipped due to update criteria not met.");
    return;
  }

  let summary;
  try {
    summary = await summarizeReviewSentiment(restaurantId);
    if (!summary) {
      console.log("Summary is undefined or null, skipping update.");
      return;
    }

    await restaurantCollection.updateOne({_id: restaurantId}, {$set: {summary: summary, summaryDate: new Date()}});
    console.log("Summary updated successfully for restaurant:", restaurantId);
  } catch (error) {
    console.error("Error during review sentiment summarization:", error);
    throw new Error("Error during review sentiment summarization: " + error.message);
  }

  return summary;
};

async function summarizeReviewSentiment(restaurantId) {
  console.log(`Summarizing sentiment for restaurant ID: ${restaurantId}`);
  const collection = getCollection(serviceName, databaseName, reviewsCollectionName);
  let latestReviews = [];
  try {
    const results = await collection.aggregate([{$match: {restaurant_id: restaurantId}}, {$sort: {date: -1}}, {$limit: 50}, {$project: {text: 1}}]).toArray();

    if (results && results.length) {
      latestReviews = results;
      console.log(`Found ${results.length} reviews for restaurant ID: ${restaurantId}`);
    } else {
      console.log(`No reviews found for restaurant ID: ${restaurantId}`);
      return null; // Or handle this case as needed
    }
  } catch (error) {
    console.error("Fetching latest reviews failed:", error);
    throw new Error("Fetching latest reviews failed");
  }

  const reviewsString = latestReviews.map(review => review.text).join(" | ");
  let response;
  try {
    const payload = {text: reviewsString};
    console.log("Sending request to summarization service with payload:", JSON.stringify(payload));

    response = await context.http.post({
      url: summarizeFunctionURL,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
      encodeBodyAsJSON: true
    });

    // Detailed logging for the response
    console.log("Received HTTP status:", response.statusCode);
    console.log("Received HTTP headers:", JSON.stringify(response.headers));

    const responseBodyText = response.body.text();
    if (responseBodyText) {
      const responseBody = EJSON.parse(responseBodyText);
      console.log("Received response body:", JSON.stringify(responseBody));

      if (responseBody.error) {
        console.error("Error in summarization service response:", responseBody.error);
        throw new Error("Error in summarization service response: " + responseBody.error);
      }

      const summary = responseBody.completion;
      if (!summary) {
        console.error("Summary field is missing or empty in the response");
        throw new Error("Summary field is missing or empty in the response");
      }
      return summary;
    } else {
      console.error("Received empty response body");
      throw new Error("Received empty response body");
    }
  } catch (error) {
    console.error("Error calling summarization service:", error);
    throw new Error("Error calling summarization service");
  }
}


async function shouldUpdateSummary(collection, documentId, numberOfDays) {
  const restaurant = await collection.findOne({
    _id: documentId
  });

  if (!restaurant) {
    throw new Error(`Failed to fetch restaurant document. Restaurant ID: ${documentId}`);
  }

  if (!restaurant.summary) {
    return true;
  }

  const {summaryDate} = restaurant;

  if (!summaryDate || isDateOlderThanSpecifiedDays(summaryDate, numberOfDays)) {
    return true;
  }

  return false;
}

function isDateOlderThanSpecifiedDays(date, numberOfDays) {
  if (date instanceof Date && typeof numberOfDays === "number") {
    const specifiedDaysInMilliseconds = numberOfDays * 24 * 60 * 60 * 1000;
    const specifiedDaysAgoTimestamp = new Date().getTime() - specifiedDaysInMilliseconds;

    return date.getTime() < specifiedDaysAgoTimestamp;
  } else {
    throw new Error("Invalid input. ", date, numberOfDays);
  }
}

function getCollection(serviceName, databaseName, collectionName) {
  const collection = context?.services?.get(serviceName)?.db(databaseName)?.collection(collectionName);

  if (!collection) {
    throw new Error(`Fetching collection ${databaseName}.${collectionName} from the service ${serviceName} failed.`);
  }

  return collection;
}

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

