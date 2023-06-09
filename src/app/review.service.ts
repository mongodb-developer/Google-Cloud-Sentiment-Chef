import { Injectable } from '@angular/core';
import { RealmAppService } from './realm-app.service';
import { CustomerReview, NewReview, RawReview } from './review';
import { ObjectId } from './helpers/objectId';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private realmAppService: RealmAppService) { }

  private async getWriteCollection() {
    const realmApp = await this.realmAppService.getAppInstance();

    const collection = realmApp?.currentUser?.mongoClient('M0')?.db('sample_restaurants')?.collection<RawReview>('raw_reviews');

    if (!collection) {
      throw new Error('Failed to connect to Realm App');
    }

    return collection;
  }

  private async getReadCollection() {
    const realmApp = await this.realmAppService.getAppInstance();

    const collection = realmApp?.currentUser?.mongoClient('M0')?.db('sample_restaurants')?.collection<CustomerReview>('processed_reviews');

    if (!collection) {
      throw new Error('Failed to connect to Realm App');
    }

    return collection;
  }

  async listReviews(restaurantId: any, limit = 5) {
    const collection = await this.getReadCollection();
    const oId = new ObjectId(restaurantId);

    return collection.aggregate([
      { $match: { restaurant_id: oId } },
      { $limit: limit },
      { $sort: { date: 1 } }
    ]) as Promise<CustomerReview[]>;
  }

  async insertOne(restarauntId: string, review: NewReview) {
    const reviewToInsert: RawReview = {
      _id: new ObjectId(),
      restaurant_id: new ObjectId(restarauntId),
      ...review
    };

    const collection = await this.getWriteCollection();
    collection.insertOne(reviewToInsert);
  }
}
