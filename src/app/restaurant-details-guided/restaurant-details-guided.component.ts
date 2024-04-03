import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { Restaurant } from '../restaurant';
import { NewReview, RawReview } from '../review';
import { BehaviorSubject } from 'rxjs';

export interface ReviewFormState {
  review?: Partial<RawReview>,
  attachImages?: boolean,
  submitReview?: boolean,
}

const reviews: NewReview[] = [
  {
    name: 'Clementine',
    text: `Incredible place. la love to visit again This is a very nice restaurant with tasty creative lood and attentive stall. The food is delicious, with a nice twist of the original recipes. The stall is very nice, not only they advised me on a the choice of dishes and desert, but even brought be an Ethiopian desert form after I had a question. Would definitely come again!`,
    date: new Date().toString()
  },
  {
    name: 'Mary',
    text: `Went here for an early dinner last night. Don't drive here. Parking is terrible. Seated promptly. Needed proof of vaccination. No liquor license yet. We didn't enjoy it at all and the service wasn't great either. The food was mediocre.`,
    date: new Date().toString()
  },
  {
    name: 'Joel',
    text: `We came here for drinks.`,
    date: new Date().toString()
  },
  {
    name: 'Joel',
    text: `We came here for drinks.`,
    date: new Date().toString(),
    images: [
      {
        fileName: 'https://i.ibb.co/pvQtyx7/fun-1.jpg',
        mimeType: 'image/jpeg'
      },
      {
        fileName: 'https://i.ibb.co/K9SL0SR/stock-photo-1.jpg',
        mimeType: 'image/jpeg'
      },
      {
        fileName: 'https://i.ibb.co/k4z8SGs/fun-2.jpg',
        mimeType: 'image/jpeg'
      },
    ]
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
  @Input() reviewFormState: BehaviorSubject<ReviewFormState> = new BehaviorSubject({});
  @Input() searchState: BehaviorSubject<string> = new BehaviorSubject('');

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
          content: 'The sentiment of the review was notably negative as indicated by the AI model.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          selector: '.first-review .restaurant-review-scores',
          content: 'The category scores are also low.',
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
          content: 'Let\'s put the AI model to one more test.',
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
          content: 'This review was too succinct for the AI model to determine the sentiment. However, people quite often leave short reviews but attach images. Photos can also carry sentiment! Let\'s see what happens if we attach some photos to the same review and submit it again.',
          orientation: Orientation.Right,
          useHighlightPadding: true,
          closeAction: () => this.startNextTour(),
        },
      ]
    },

    {
      tourId: 'review-4-fill-out',
      steps: [
        {
          selector: '.restaurant-review-form',
          content: 'Let\'s submit the same review but this time attach some photos to it!',
          closeAction: async () => {
            this.fillOutReview();
            setTimeout(() => {
              this.startNextTour();
            }, 3000);
          },
          orientation: Orientation.Right,
          useHighlightPadding: true
        }
      ]
    },

    {
      tourId: 'media-upload-tour',
      steps: [
        {
          selector: '.media-upload-dialog',
          content: 'The attached photos may take a couple of seconds to upload. Click \'Next\' after they have been uploaded.',
          orientation: Orientation.Right,
          useHighlightPadding: true
        },
        {
          selector: '.media-upload-dialog .description',
          content: 'The AI model can detect objects and sentiment in the images. It has generated a description, extracted useful tags and analysed the sentiment of the images. This data will be used to enhance the sentiment analysis of the whole review.',
          orientation: Orientation.Right,
          useHighlightPadding: true,
          closeAction: () => {
            this.attachPhotos();
            this.startNextTour();
          },
        },
      ]
    },
    {
      tourId: 'review-4-submit',
      steps: [
        {
          selector: '.restaurant-review-form',
          content: 'The images have been attached to the review. Click the \'Done\' button to submit the review and wait for the AI model to analyse it!',
          closeAction: () => this.submitReview(),
          orientation: Orientation.Right,
          useHighlightPadding: true
        }
      ]
    },
    {
      tourId: 'review-4-tour',
      steps: [
        {
          selector: '.first-review',
          content: 'This time, depending on the result we get from the AI model, we might see a different sentiment label for the review.',
          orientation: Orientation.Right,
          useHighlightPadding: true,
          closeAction: () => this.startNextTour(),
        },
      ]
    },

    {
      tourId: 'search',
      steps: [
        {
          selector: '.search-form',
          content: 'The application uses MongoDB Atlas Search to provide a powerful search functionality. The search utilises not only the reviews text but also extracted image tags and descriptions.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
        },
        {
          selector: '.search-form',
          content: 'Let\'s try searching for a review with a specific keyword.',
          orientation: Orientation.Bottom,
          useHighlightPadding: true,
          closeAction: () => {
            this.search('beer');
            setTimeout(() => {
              this.startNextTour();  
            }, 1000);
          }
        },
      ]
    },

    {
      tourId: 'search-results',
      steps: [
        {
          selector: '.first-review',
          content: 'Even though the text doesn\'t mention beer, the AI model has detected beer in the images and extracted it as a tag. Atlas Search indexes the image tags together with the review texts. This is why the review was returned in the search results.',
          orientation: Orientation.Right,
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
          content: 'Final AI treat! Based on the reviews we just wrote, the AI model also generated a summary for the restaurant.',
          orientation: Orientation.Left,
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
    this.reviewFormState.next({ review: this.currentReview });

    setTimeout(() => {
      // wait before showing the next step in the guide
    }, 1000);
  }

  submitReview() {
    this.currentReview = { name: '', text: '', date: new Date().toString() };
    this.reviewFormState.next({ submitReview: true });

    this.startNextTour();
  }

  attachPhotos() {
    this.reviewFormState.next({ attachImages: true });
  }

  search(query: string) {
    this.searchState.next(query);
  }

  private startNextTour() {
    setTimeout(() => {
      const nextTour = this.tours[this.toursCounter++];
      this.guidedTourService.startTour(nextTour);
    }, 3000);
  }
}
