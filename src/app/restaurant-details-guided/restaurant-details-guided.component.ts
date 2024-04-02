import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { Restaurant } from '../restaurant';
import { NewReview, RawReview } from '../review';
import { BehaviorSubject } from 'rxjs';

const reviews: NewReview[] = [
  {
    name: 'Clementine',
    text: `Incredible place. la love to visit again This is a very nice restaurant with tasty creative lood and attentive stall. The food is delicious, with a nice twist of the original recipes. The stall is very nice, not only they advised me on a the choice of dishes and desert, but even brought be an Ethiopian desert form after I had a question. Would definitely come again!`,
    date: new Date().toString()
  },
  {
    name: 'Joel',
    text: `Food served style "alla nonna" with a modern touch. Suitable for a night out for friends, couples or an informal business lunch. The interior has been renovated recently. We waited for an hour to be seated. There are a couple of better restaurants in the area. It's not a terrible choice though.`,
    date: new Date().toString()
  },
  {
    name: 'Mary',
    text: `Went here for an early dinner last night. Don't drive here. Parking is terrible.
    Seated promptly. Needed proof of vaccination. No liquor license yet. We didn't enjoy it at all and the service wasn't great either. The food was mediocre.`,
    date: new Date().toString()
  },
];

@Component({
  selector: 'app-restaurant-details-guided',
  templateUrl: './restaurant-details-guided.component.html',
  styleUrls: ['./restaurant-details-guided.component.scss']
})
export class RestaurantDetailsGuidedComponent {
  currentReview: NewReview;
  reviewsCounter = 0;
  toursCounter = 0;

  @Input() restaurant: Restaurant;
  @Input() reviewFormEmitter: BehaviorSubject<Partial<RawReview>> = new BehaviorSubject({});

  @Output()
  reviewSubmitted = new EventEmitter<NewReview>();

  tours: GuidedTour[] = [
    {
      tourId: 'review-1-submit',
      useOrb: true,
      steps: [
        {
          title: 'Restaurant Page: Unleash the full potential of Sentiment Chef!',
          selector: '.restaurant-name',
          content: 'This page is the beating heart of the Sentiment Chef demo. Click \'Next\' to embark on an exciting exploration of its features!',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          title: 'Restaurant Details',
          selector: '.restaurant-details',
          content: 'The information on this page, including cuisine, neighborhood, and description, is fetched from a MongoDB Atlas database.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          title: 'AI-powered Reviews',
          selector: '.restaurant-review-form',
          content: 'Let\'s fill out a customer review to witness the capabilities of AI-driven sentiment analysis.',
          closeAction: () => this.fillOutReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
        {
          selector: '.restaurant-review-form',
          content: 'Click the \'Done\' button to submit the review and wait for the AI model to analyse it!',
          closeAction: () => this.submitReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
      ]
    },
    {
      tourId: 'review-1-tour',
      steps: [
        {
          selector: '.first-review',
          content: 'Gemini analysed the sentiment of your review!',
          orientation: Orientation.Right,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-details-header',
          content: 'The review has been assigned a sentiment label.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-scores',
          content: 'The sentiment of the review has been evaluated across three distinct categories with scores from 1 to 5.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
          closeAction: () => this.startNextTour(),
        },
      ]
    },

    {
      tourId: 'review-2-submit',
      steps: [
        {
          selector: '.restaurant-review-form',
          content: 'Let\'s put the AI model to the test with a more ambiguous review.',
          closeAction: () => this.fillOutReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
        {
          selector: '.restaurant-review-form',
          content: 'Click the \'Done\' button to submit the review and wait for the AI model to analyse it!',
          closeAction: () => this.submitReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
      ]
    },

    {
      tourId: 'review-2-tour',
      steps: [
        {
          selector: '.first-review',
          content: 'The sentiment analysis is different this time.',
          orientation: Orientation.Right,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-details-header',
          content: 'The sentiment you see might be positive, neutral or negative depending on the Gemini output.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-scores',
          content: 'The category scores also are different.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
          closeAction: () => this.startNextTour(),
        },
      ]
    },

    {
      tourId: 'review-3-submit',
      steps: [
        {
          selector: '.restaurant-review-form',
          content: 'Let\'s put the AI model to one final test.',
          closeAction: () => this.fillOutReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
        {
          selector: '.restaurant-review-form',
          content: 'Click the \'Done\' button to submit the review and wait for the AI model to analyse it!',
          closeAction: () => this.submitReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
      ]
    },

    {
      tourId: 'review-3-tour',
      steps: [
        {
          selector: '.first-review',
          content: 'The third review was not good, as indicated by the sentiment analysis.',
          orientation: Orientation.Right,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-details-header',
          content: 'The overall sentiment is negative.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-scores',
          content: 'The category scores are also notably low.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
          closeAction: () => this.startNextTour(),
        },
      ]
    },

    {
      tourId: 'summarization-tour',
      steps: [
        {
          selector: '.restaurant-card-summary',
          content: 'Based on the three reviews we just wrote, the AI model has generated a summary for the restaurant.',
          orientation: Orientation.Right,
          useHighlightPadding: true,
        },
      ]
    },

  ];

  constructor(
    private guidedTourService: GuidedTourService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.startNextTour();
  }

  private fillOutReview() {
    this.currentReview = reviews[this.reviewsCounter++];
    this.reviewFormEmitter.next(this.currentReview);

    setTimeout(() => {
      // wait before showing the next step in the guide
    }, 1000);
  }

  submitReview() {
    this.reviewSubmitted.emit(this.currentReview);

    this.currentReview = { name: '', text: '', date: new Date().toString() };
    this.reviewFormEmitter.next(this.currentReview);

    this.startNextTour();
  }

  private startNextTour() {
    setTimeout(() => {
      const nextTour = this.tours[this.toursCounter++];
      this.guidedTourService.startTour(nextTour);
    }, 3000);
  }
}
