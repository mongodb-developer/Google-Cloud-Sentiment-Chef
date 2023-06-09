import { from, Observable } from 'rxjs';

export function fromChangeEvent(source: AsyncGenerator<Realm.Services.MongoDB.ChangeEvent<any>>)
  : Observable<Realm.Services.MongoDB.ChangeEvent<any>> {

  return new Observable(subscriber => {
    const subscription = from(source).subscribe({
      next(value) {
        subscriber.next(value);
      },
      error(error) {
        subscriber.error(error);
      },
      complete() {
        subscriber.complete();
      }
    })

    return () => {
      // Stop the collection watcher
      source.return(undefined);

      subscription.unsubscribe();
    };
  });
}