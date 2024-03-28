import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDetailsGuidedComponent } from './restaurant-details-guided.component';

describe('RestaurantDetailsGuidedComponent', () => {
  let component: RestaurantDetailsGuidedComponent;
  let fixture: ComponentFixture<RestaurantDetailsGuidedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantDetailsGuidedComponent]
    });
    fixture = TestBed.createComponent(RestaurantDetailsGuidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
