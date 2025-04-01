import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageEditorPage } from './image-editor.page';

describe('ImageEditorPage', () => {
  let component: ImageEditorPage;
  let fixture: ComponentFixture<ImageEditorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
