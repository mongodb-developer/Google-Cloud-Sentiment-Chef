import { TestBed } from '@angular/core/testing';

import { ImageUplouderService } from './image-uplouder.service';

describe('ImageUplouderService', () => {
  let service: ImageUplouderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUplouderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
