import { Component } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerReview, NewReview } from '../review';
import { ReviewService } from '../review.service';
import { Observable, Subscription, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent {
  private currentId: string = '';
  restaurant: any;
  reviews: CustomerReview[] = [];
  restaurantWatcher: Subscription;
  reviewsWatcher: Subscription;
  filteredReviews$: Observable<CustomerReview[]>;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
  ) {
  }

  async ngOnInit() {
    this.filteredReviews$ = this.search(this.searchForm.controls.query);

    this.filteredReviews$.subscribe({
      next: async reviews => {
        // Stop watching for new reviews when the user starts searching
        this.reviewsWatcher?.unsubscribe();
        this.reviews = reviews;
      }
    });

    this.route.paramMap.subscribe({
      next: async params => {
        const id = params.get('id');
        if (!id) {
          return;
        }

        this.currentId = params.get('id')!;
        const item = await this.restaurantService.findOne(this.currentId);
        this.restaurant = item;
        this.reviews = await this.reviewService.listReviews(this.currentId);

        this.restaurantWatcher = (await this.restaurantService.getRestaurantObservable(this.currentId)).subscribe({
          next: restaurant => {
            this.restaurant = restaurant;
          }
        });

        this.reviewsWatcher = (await this.reviewService.getReviewsObservable(this.currentId)).subscribe({
          next: review => {
            this.reviews = [review, ...this.reviews];
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.restaurantWatcher?.unsubscribe();
    this.reviewsWatcher?.unsubscribe();
  }

  addReview(review: NewReview) {
    this.reviewService.insertOne(this.currentId, review);
  }

  searchForm = this.fb.group({
    query: ['', Validators.required],
  });

  private search(formControl: FormControl<any>) {
    return formControl.valueChanges.pipe(
      filter(text => text!.length > 1),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(searchTerm => this.reviewService.search(this.currentId, searchTerm)),

    );
  }
}
