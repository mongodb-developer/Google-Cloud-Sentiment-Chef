import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantDetailsComponent } from './restaurant-details.component';

describe('RestaurantDetailsComponent', () => {
  let component: RestaurantDetailsComponent;
  let fixture: ComponentFixture<RestaurantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantDetailsComponent]
    });
    fixture = TestBed.createComponent(RestaurantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
