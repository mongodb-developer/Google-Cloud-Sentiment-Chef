import { Component } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent {
  restaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantService) {}

  async ngOnInit(): Promise<void> {
    this.restaurants = await this.restaurantService.listRestaurants();
  }
}
