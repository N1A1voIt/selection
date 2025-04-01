import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryFixedComponent } from './gallery-fixed.component';

describe('GalleryFixedComponent', () => {
  let component: GalleryFixedComponent;
  let fixture: ComponentFixture<GalleryFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryFixedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
