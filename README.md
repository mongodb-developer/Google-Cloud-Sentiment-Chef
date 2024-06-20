# Generative AI Sentiment Analysis and Summarization

This is a demo of a sentiment analysis, tagging, and summarization Gemini — Google's next-generation AI model. 

## Quickstart

### Google Cloud setup
Create two public 2nd generation Cloud Functions with the following implementations.

  1. [Analyze sentiment Google Cloud Function](./google-cloud-functions/analyze-sentiment/)
  1. [Summarize reviews Google Cloud Function](./google-cloud-functions/summarize-review-sentiment/)

Take a note of the deployed functions' URLs. You will need them later.

### MongoDB Atlas setup

  1. Create a [free MongoDB Atlas account](https://mongodb.com/try?utm_campaign=devrel&utm_source=google.cloud&utm_medium=github&utm_content=sentiment.chef&utm_term=stanimira.vlaeva).
  1. Database cluster
    - Deploy a new MongoDB database cluster in your Atlas account. You can use the free M0 tier for this demo.
    - Load the sample dataset.
  1. Data API
    - Enable the Data API for your newly deployed cluster.
    - Set the `readAll` data access rule for the `sample_restaurants.restaurants` collection.
  1. Atlas Functions
    - Create two new Atlas Functions with the following implementations. Replace the URL placeholders with the URls of the deployed Google Cloud Functions.
      - [Analyze sentiment Atlas Function](./atlas-app-services/functions/Atlas_Triggers_analyzeReviewSentiment_1686394580.js)
      - [Summarize reviews Atlas Function](./atlas-app-services/functions/Atlas_Triggers_summarizeReviewsSentiment_1686475894.js)
  1. Atlas Triggers
    - Create two new Atlas Triggers with the following configuration.
      - [Analyze sentiment Atlas Trigger](./atlas-app-services/triggers/analyzeReviewSentiment.json)
      - [Summarize reviews Atlas Trigger](./atlas-app-services/triggers/summarizeReviewsSentiment.json)

## Contributors ✨

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center">
        <a href="https://twitter.com/StanimiraVlaeva">
            <img src="https://pbs.twimg.com/profile_images/1645826266770055168/SS9kFxoJ_400x400.jpg" width="100px;" alt=""/><br />
            <sub><b>Stanimira Vlaeva</b></sub>
        </a><br />
    </td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

## Disclaimer

Use at your own risk; not a supported MongoDB product
