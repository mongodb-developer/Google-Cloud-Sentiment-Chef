import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadedMedia } from '../uploaded-media';

export interface ImageDetailsDialogData {
  media: UploadedMedia;
}

@Component({
  templateUrl: './media-dialog.component.html',
  styleUrls: ['./media-dialog.component.scss']
})
export class MediaDialog {
  file: UploadedMedia;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ImageDetailsDialogData
  ) {
    this.file = data.media;
  }
}
