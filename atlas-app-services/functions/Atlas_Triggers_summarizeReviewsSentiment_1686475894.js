const serviceName = "M0";
const databaseName = "sample_restaurants";
const reviewsCollectionName = "processed_reviews";
const restaurantCollectionName = "restaurants";
// Add the AWS Lambda URL below
const summarizeFunctionURL = "<aws-lambda-endpoint>";

exports = async function (changeEvent) {
  const restaurantId = changeEvent?.fullDocument?.restaurant_id;
  if (!restaurantId) {
    throw new Error("Extracting restaurant ID from review document failed.");
  }

  const restaurantCollection = getCollection(serviceName, databaseName, restaurantCollectionName);

  if (!shouldUpdateSummary(restaurantCollection, restaurantId)) {
    console.log("Summary generation skipped.");
    return;
  }

  const summary = await summarizeReviewSentiment(restaurantId);
  if (!summary) {
    return;
  }

  const updateResult = await restaurantCollection.updateOne({
    _id: restaurantId
  }, {
    $set: {
      summary: summary, summaryDate: new Date()
    }
  });

  return summary;
};

async function summarizeReviewSentiment(restaurantId) {
  const collection = getCollection(serviceName, databaseName, reviewsCollectionName);

  const latestReviews = await collection.aggregate([{
    $match: {restaurant_id: restaurantId}
  }, {
    $sort: {date: -1}
  }, {
    $limit: 50
  }, {
    $project: {text: 1}
  }]).toArray();

  if (latestReviews?.length < 3) {
    console.log("Unsufficient number of reviews.", latestReviews?.length);
    return;
  }

  const reviewsString = latestReviews.map(review => review.text).join(" | ");
  const response = await context.http.post({
    url: summarizeFunctionURL, body: {text: reviewsString}, encodeBodyAsJSON: true
  });

  const summary = JSON.parse(response?.body?.text())?.summary;
  if (!summary || (typeof summary === 'object' && isEmpty(summary))) {
    throw new Error("Summarizing reviews sentiment failed.");
  }

  return summary;
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

