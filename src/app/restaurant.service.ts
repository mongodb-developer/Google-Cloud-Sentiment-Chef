import { Injectable } from '@angular/core';
import { RealmAppService } from './realm-app.service';
import { Restaurant } from './restaurant';
import { ObjectId } from './helpers/objectId';
import { fromChangeEvent } from './rxjs-operators';
import { isUpdateEvent } from './change-events';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private realmAppService: RealmAppService) { }

  private async getCollection() {
    const realmApp = await this.realmAppService.getAppInstance();

    const currentUser = realmApp?.currentUser;
    const mongoDB = currentUser?.mongoClient('mongodb-atlas');
    const db = mongoDB?.db('sample_restaurants');
    const collection = db?.collection<Restaurant>('restaurants');

    if (!collection) {
      throw new Error('Failed to connect to Realm App');
    }

    return collection;
  }

  async listRestaurants(limit = 24) {
    const collection = await this.getCollection();

    return collection.aggregate([
      {
        $sample: { size: limit }
      }
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

  async getRestaurantObservable(id: string) {
    const oid = new ObjectId(id);

    const collection = await this.getCollection();
    const watcher = collection.watch({
      filter: {
        operationType: 'update',
        'fullDocument._id': oid
      }
    });

    return fromChangeEvent(watcher)
      .pipe(
        filter(isUpdateEvent),
        map(event => ({...event.fullDocument}))
      )
  }

  async search(query: string) {
    const collection = await this.getCollection();

    return collection?.aggregate([
      {
        $search: {
          index: 'restaurants',
          autocomplete: {
            path: 'name',
            query,
          }
        }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 1,
          name: 1,
        }
      }
    ]) as Promise<Restaurant[]>;
  }
}
