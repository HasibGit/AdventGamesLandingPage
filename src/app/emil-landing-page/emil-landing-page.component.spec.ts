import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmilLandingPageComponent } from './emil-landing-page.component';

describe('EmilLandingPageComponent', () => {
  let component: EmilLandingPageComponent;
  let fixture: ComponentFixture<EmilLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmilLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmilLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
