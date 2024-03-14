import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { RawReview } from '../review';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FileHandle } from '../drag-and-drop.directive';
import { ImageUplouderService } from '../image-uplouder.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Partial<RawReview>> = new BehaviorSubject({});

  @Output()
  formValuesChanged = new EventEmitter<RawReview>();

  @Output()
  formSubmitted = new EventEmitter<RawReview>();

  reviewForm: FormGroup;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  get name() { return this.reviewForm.get('name')!; }
  get text() { return this.reviewForm.get('text')!; }

  constructor(
    private fb: FormBuilder,
    private imageUploader: ImageUplouderService
  ) { }

  ngOnInit(): void {
    this.initialState.subscribe(review => {
      this.reviewForm = this.fb.group({
        name: [ review.name, [Validators.required] ],
        text: [ review.text, [ Validators.required, Validators.minLength(10) ] ],
      });
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
  uploadedImages: { fileName: string, mimeType: string }[] = [];
  uploading = false;

  filesDropped(fileHandles: FileHandle[]): void {
    this.fileHandles = fileHandles;
    this.upload();
  }

  resetUploader() {
    this.fileHandles = [];
    this.uploadedImages = [];
  }

  upload(): void {
    const promises = [];
    for (let fileHandle of this.fileHandles) {
      this.uploading = true;

      const promise = this.imageUploader.upload(fileHandle.file)
          .then((result) => {
            this.uploadedImages.push({ fileName: result.fileName, mimeType: fileHandle.file.type });
          })
          .catch((error) => {
            console.error(error);
          });

      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      this.uploading = false;
    });
  }
}
