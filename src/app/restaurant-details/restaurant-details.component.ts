import { Component } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent {
  private currentId: string = '';
  restaurant: any;

  constructor(
    private route: ActivatedRoute,
    private auctionService: RestaurantService,
  ) {
  }

  async ngOnInit() {
    this.route.paramMap.subscribe({
      next: async params => {
        const id = params.get('id');
        if (!id) {
          return;
        }

        this.currentId = params.get('id')!;
        const item = await this.auctionService.findOne(this.currentId);
        this.restaurant = item;
      }
    });
  }
}
