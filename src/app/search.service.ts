import { Injectable } from '@angular/core';
import { RealmAppService } from './realm-app.service';
import { CustomerReview } from './review';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private realmAppService: RealmAppService) { }

  private async getCollection() {
    const realmApp = await this.realmAppService.getAppInstance();

    const collection = realmApp?.currentUser?.mongoClient('M0')?.db('sample_restaurants')?.collection<CustomerReview>('processed_reviews');

    if (!collection) {
      throw new Error('Failed to connect to Realm App');
    }

    return collection;
  }

  async searchReviews(restaurant_id: string, query: string) {
    const pipeline = [
      {
        $search: {
          index: "default",
          text: {
            query,
            path: {
              wildcard: "*"
            }
          }
        }
      }
    ]

    const collection = await this.getCollection();
    return collection.aggregate(pipeline) as Promise<CustomerReview[]>;
  }
}
