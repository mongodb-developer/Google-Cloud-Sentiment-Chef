import { TestBed } from '@angular/core/testing';

import { RealmAppService } from './realm-app.service';

describe('RealmAppService', () => {
  let service: RealmAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealmAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
