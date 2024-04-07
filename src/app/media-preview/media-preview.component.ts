import { Component, Input } from '@angular/core';
import { UploadedMedia } from '../uploaded-media';
import { MediaDialog } from '../image-detailed-dialog/media-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { config } from 'src/config';

@Component({
  selector: 'app-media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent {
  @Input()
  file: UploadedMedia;

  @Input()
  size: 'small' | 'medium' | 'big';

  reviewImagesBucket = config.reviewImagesBucket;

  constructor(
    public dialog: MatDialog,
  ) {
  }

  openDetailsDialog() {
    if (this.size === 'small') {
      this.dialog.open(MediaDialog, {
        data: { media: this.file },
      });
    }
  }
}
