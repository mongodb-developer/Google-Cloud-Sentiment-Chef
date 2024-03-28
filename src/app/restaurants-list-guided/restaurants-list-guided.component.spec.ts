import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsListGuidedComponent } from './restaurants-list-guided.component';

describe('RestaurantsListGuidedComponent', () => {
  let component: RestaurantsListGuidedComponent;
  let fixture: ComponentFixture<RestaurantsListGuidedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantsListGuidedComponent]
    });
    fixture = TestBed.createComponent(RestaurantsListGuidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
