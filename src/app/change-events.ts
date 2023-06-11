export const isInsertEvent = (event: any): event is Realm.Services.MongoDB.InsertEvent<any> =>
  event.operationType === 'insert';

export const isUpdateEvent = (event: any): event is Realm.Services.MongoDB.UpdateEvent<any> =>
  event.operationType === 'update';
