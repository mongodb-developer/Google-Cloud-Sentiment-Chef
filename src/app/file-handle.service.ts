import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Injectable({
  providedIn: 'root'
})
export class FileHandleService {

  constructor(private sanitizer: DomSanitizer) { }

  sanitizeFile(file: File) {
    console.log(file);
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    return { file, url };
  }

  async fileFromUrl(url: string, mimeType: string) {
    // return new Promise<FileHandle>((resolve, reject) => {
    //   const request = new XMLHttpRequest();
    //   request.open('GET', url, true);
    //   request.responseType = 'blob';
    //   request.onload = async function() {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(request.response);
    //       reader.onload =  function(e){
    //         const buffer = e.target?.result;
    //         if (!buffer) {
    //           return reject('Failed to load file');
    //         }
      
    //         const name = `file-${Date.now()}.${mimeType.split('/').pop() || 'txt'}`;
    //         const file = new File([buffer], name, { type: mimeType });
    //         console.log(file);
    //         console.log(url);

    //         return resolve({ file, url });
    //       };
    //   };

    //   request.send();
    // });

    const response = await fetch(url);
    const data = await response.blob();
    const metadata = {
      type: mimeType
    };

    const name = `file-${Date.now()}.${mimeType.split('/').pop() || 'txt'}`;
    const file = new File([data], name, metadata);

    return { file, url };
  }
}
