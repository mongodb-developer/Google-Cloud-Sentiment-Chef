import { Injectable } from '@angular/core';
import { RealmAppService } from './realm-app.service';
import { Restaurant } from './restaurant';
import { ObjectId } from './helpers/objectId';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private realmAppService: RealmAppService) { }

  private async getCollection() {
    const realmApp = await this.realmAppService.getAppInstance();

    const collection = realmApp?.currentUser?.mongoClient('M0')?.db('sample_restaurants')?.collection<Restaurant>('restaurants');

    if (!collection) {
      throw new Error('Failed to connect to Realm App');
    }

    return collection;
  }

  async listRestaurants(limit: 5) {
    const collection = await this.getCollection();

    return collection.aggregate([
      { $limit: limit },
      { $sort: { ends: 1 } }
    ]) as Promise<Restaurant[]>;
  }

  async findOne(id: any) {
    const collection = await this.getCollection();
    if (!collection) {
      console.error('Failed to load collection.');
      throw new Error('No item found.');
    }

    return collection.findOne({ _id: new ObjectId(id) });
  }
}
