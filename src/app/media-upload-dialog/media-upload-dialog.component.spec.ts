import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaUploadDialogComponent } from './media-upload-dialog.component';

describe('MediaUploadDialogComponent', () => {
  let component: MediaUploadDialogComponent;
  let fixture: ComponentFixture<MediaUploadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediaUploadDialogComponent]
    });
    fixture = TestBed.createComponent(MediaUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
