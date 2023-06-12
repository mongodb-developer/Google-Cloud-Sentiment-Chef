import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant';
import { GuidedTour, GuidedTourService, Orientation } from 'ngx-guided-tour';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent {
  restaurants: Restaurant[] = [];
  dashboardTour: GuidedTour = {
    tourId: 'restaurants-tour',
    useOrb: true,
    steps: [
      {
        title: 'Welcome to Sentiment Chef!',
        selector: '.primary-header',
        content: 'Learn how to analyze the sentiment of restaurant reviews and automatically generate concise summaries of multiple reviews using the power of Generative AI.',
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
    private restaurantService: RestaurantService,
    private guidedTourService: GuidedTourService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.restaurants = await this.restaurantService.listRestaurants();
    setTimeout(() => {
      this.guidedTourService.startTour(this.dashboardTour);
    }, 1000);
  }

  goToFirstRestaurant() {
    this.router.navigate(['/restaurants/', this.restaurants[0]._id.toString() ]);
  }

  public restartTour(): void {
    this.guidedTourService.startTour(this.dashboardTour);
  }
}
