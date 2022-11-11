import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndiamoLandingPageComponent } from './andiamo-landing-page.component';

describe('AndiamoLandingPageComponent', () => {
  let component: AndiamoLandingPageComponent;
  let fixture: ComponentFixture<AndiamoLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AndiamoLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndiamoLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
