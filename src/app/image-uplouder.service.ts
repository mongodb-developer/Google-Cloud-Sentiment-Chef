import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUplouderService {
  constructor(private http: HttpClient) { }

  upload(file: File) {
    return new Promise<{ fileName: string, response: string }>(async (resolve, reject) => {
      const fileName = `reviews/${Date.now()}-${Math.floor(Math.random() * 100000)}.${file.name.split('.').pop()}`;

      const signedUrl = await this.createSignedUrl(fileName, file.type);
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl, true);

      xhr.onload = () => {
        const status = xhr.status;
        if (status === 200) {
          return resolve({
            fileName,
            response: xhr.response
          });
        } else {
          return reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };

      xhr.onerror = () => {
        alert('Something went wrong');
        return reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };

      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  private createSignedUrl(fileName: string, fileType: string) {
    return firstValueFrom(this.http.get(
      'https://us-central1-atlas-ai-demos.cloudfunctions.net/createSignedUrl',
      {
        params: { fileName, fileType },
        responseType: 'text'
      }
    ));
  }
}
