import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { RawReview } from '../review';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {
  @Input()
  state: BehaviorSubject<Partial<RawReview>>;

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
  ) { }

  ngOnInit(): void {
    this.state.subscribe(review => {
      this.reviewForm = this.fb.group({
        name: [ review.name, [Validators.required] ],
        text: [ review.text, [ Validators.required, Validators.minLength(10) ] ],
      });
    });
  }

  submitForm() {
    this.formSubmitted.emit({
      ...this.reviewForm.value,
      date: new Date()
    });

    this.reviewForm.reset();

    this.reviewForm.markAsUntouched();
    Object.keys(this.reviewForm.controls).forEach((name) => {
      let control = this.reviewForm.controls[name];
      control.setErrors(null);
    });
  }
}