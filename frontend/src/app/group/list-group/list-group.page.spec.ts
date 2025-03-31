import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListGroupPage } from './list-group.page';

describe('ListGroupPage', () => {
  let component: ListGroupPage;
  let fixture: ComponentFixture<ListGroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
