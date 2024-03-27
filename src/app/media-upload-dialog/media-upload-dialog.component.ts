import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FileHandle } from '../drag-and-drop.directive';
import { ImageUplouderService } from '../image-uplouder.service';
import { UploadedMedia } from '../uploaded-media';

export interface MediaUploadDialogData {
  fileHandles: FileHandle[];
}

@Component({
  selector: 'app-media-upload-dialog',
  templateUrl: './media-upload-dialog.component.html',
  styleUrls: ['./media-upload-dialog.component.scss']
})
export class MediaUploadDialogComponent {
  fileHandles: FileHandle[] = [];
  uploading = false;
  allFailed = false;
  uploadedImages: Array<UploadedMedia> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MediaUploadDialogData,
    private imageUploader: ImageUplouderService,
  ) {

    this.fileHandles = data.fileHandles;
    this.upload();
  }


  upload(): void {
    const promises = [];
    let failedRequests = 0;
    for (let fileHandle of this.fileHandles) {
      this.uploading = true;

      const promise = this.imageUploader.upload(fileHandle.file)
          .then((result) => {
            this.uploadedImages.push({
              fileName: result.fileName,
              mimeType: fileHandle.file.type,
              description: result.analysis?.description || '',
              tags: result.analysis?.tags || []
            });
          })
          .catch((error) => {
            failedRequests++;
            console.error(error);
          });

      promises.push(promise);
    }

    Promise.all(promises).finally(() => {
      this.uploading = false;
    });

    if (failedRequests === this.fileHandles.length) {
      this.allFailed = true;
    }
  }
}

