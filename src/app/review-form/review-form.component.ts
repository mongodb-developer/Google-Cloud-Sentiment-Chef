import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { RawReview } from '../review';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaUploadDialogComponent } from '../media-upload-dialog/media-upload-dialog.component';
import { UploadedMedia } from '../uploaded-media';
import { FileHandle, FileHandleService } from '../file-handle.service';
import { ReviewFormState } from '../restaurant-details-guided/restaurant-details-guided.component';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {
  @Input()
  state: BehaviorSubject<ReviewFormState>;

  @Output()
  formValuesChanged = new EventEmitter<RawReview>();

  @Output()
  formSubmitted = new EventEmitter<RawReview>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  reviewForm: FormGroup;

  uploadImagesDialog: MatDialogRef<MediaUploadDialogComponent>;

  get name() { return this.reviewForm.get('name')!; }
  get text() { return this.reviewForm.get('text')!; }

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private fileHandleService: FileHandleService
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      name: [ '', [Validators.required] ],
      text: [ '', [ Validators.required, Validators.minLength(10) ] ],
      images: [ [] ],
    });

     this.state.subscribe(async ({ review, attachImages, submitReview }) => {
      if (review) {
        this.reviewForm = this.fb.group({
          name: [ review.name, [Validators.required] ],
          text: [ review.text, [ Validators.required, Validators.minLength(10) ] ],
          images: [ review.images ],
        });

        if (review.images?.length) {
          const images = review.images;
          const fileHandles = [];

          for (let image of images) {
            const fileHandle = await this.fileHandleService.fileFromUrl(image.fileName, image.mimeType);
            fileHandles.push(fileHandle);
          }

          this.filesDropped(fileHandles);
        }
      }

      if (attachImages) {
        const result = this.uploadImagesDialog.componentInstance.uploadedImages;
        this.uploadImagesDialog.close(result);
        this.uploadedImages = result;
        this.uploading = false;
      }

      if (submitReview) {
        this.submitForm();
      }
    });
  }

  submitForm() {
    this.formSubmitted.emit({
      ...this.reviewForm.value,
      date: new Date(),
      images: this.uploadedImages
    });

    this.reviewForm.reset();
    this.resetUploader();

    this.reviewForm.markAsUntouched();
    Object.keys(this.reviewForm.controls).forEach((name) => {
      let control = this.reviewForm.controls[name];
      control.setErrors(null);
    });
  }

  fileHandles: FileHandle[] = [];
  uploadedImages: Array<UploadedMedia> = [];
  uploading = false;

  filesDropped(fileHandles: FileHandle[]): void {
    this.uploading = true;
    this.uploadImagesDialog = this.dialog.open(MediaUploadDialogComponent, {
      data: { fileHandles },
      disableClose: true,
    });

    this.uploadImagesDialog.afterClosed().subscribe(result => {
      this.uploadedImages = result;
      this.uploading = false;
    });
  }

  resetUploader() {
    this.fileHandles = [];
    this.uploadedImages = [];
  }
}
