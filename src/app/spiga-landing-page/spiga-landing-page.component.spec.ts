import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpigaLandingPageComponent } from './spiga-landing-page.component';

describe('SpigaLandingPageComponent', () => {
  let component: SpigaLandingPageComponent;
  let fixture: ComponentFixture<SpigaLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpigaLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpigaLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
