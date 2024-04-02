import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';
import { Restaurant } from '../restaurant';

@Component({
  selector: 'app-restaurants-list-guided',
  templateUrl: './restaurants-list-guided.component.html',
  styleUrls: ['./restaurants-list-guided.component.scss']
})
export class RestaurantsListGuidedComponent {
  @Input() restaurants: Restaurant[];

  dashboardTour: GuidedTour = {
    tourId: 'restaurants-tour',
    useOrb: true,
    steps: [
      {
        title: 'Welcome to Sentiment Chef!',
        selector: '.primary-header',
        content: 'Learn how to analyze the sentiment of restaurant reviews, extract information from images and videos and perform full-text search.',
        orientation: Orientation.Bottom
      },
      {
        title: 'Select a Restaurant',
        selector: '.first',
        content: 'To get started, let\'s navigate to the first restaurant in the list.',
        closeAction: () => this.goToFirstRestaurant(),
        orientation: Orientation.Right
      },
    ]
  };

  constructor(
    private guidedTourService: GuidedTourService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.guidedTourService.startTour(this.dashboardTour);
    }, 1000);
  }

  goToFirstRestaurant() {
    this.router.navigate(['/restaurants/', this.restaurants[0]._id.toString()]);
  }
}
