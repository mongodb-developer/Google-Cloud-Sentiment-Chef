import * as Realm from 'realm-web';
import { Injectable } from '@angular/core';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class RealmAppService {
  private static app: Realm.App;

  async getAppInstance() {
    if (!RealmAppService.app) {
      RealmAppService.app = new Realm.App({ id: config.realmAppId });

      const credentials = Realm.Credentials.anonymous();
      await RealmAppService.app.logIn(credentials);
    }

    return RealmAppService.app;
  }
}
