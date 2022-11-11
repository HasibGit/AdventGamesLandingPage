import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvRestaurantLandingPageComponent } from './sv-restaurant-landing-page.component';

describe('SvRestaurantLandingPageComponent', () => {
  let component: SvRestaurantLandingPageComponent;
  let fixture: ComponentFixture<SvRestaurantLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvRestaurantLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvRestaurantLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
