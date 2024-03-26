import * as Realm from 'realm-web';
import { Injectable } from '@angular/core';

// const URL = 'https://europe-west1.gcp.data.mongodb-api.com/app/data-rvcwy/endpoint/data/v1';
const URL = 'https://us-east-1.aws.data.mongodb-api.com/app/***REMOVED***/endpoint/data/v1';

@Injectable({
  providedIn: 'root'
})
export class RealmAppService {
  private static app: Realm.App;

  async getAppInstance() {
    if (!RealmAppService.app) {
      // RealmAppService.app = new Realm.App({ id: 'data-rvcwy'});
      RealmAppService.app = new Realm.App({ id: '***REMOVED***'});

      const credentials = Realm.Credentials.anonymous();
      await RealmAppService.app.logIn(credentials);
    }

    return RealmAppService.app;
  }
}
