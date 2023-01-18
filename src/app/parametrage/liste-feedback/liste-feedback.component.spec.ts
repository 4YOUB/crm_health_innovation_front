import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFeedbackComponent } from './liste-feedback.component';

describe('ListeFeedbackComponent', () => {
  let component: ListeFeedbackComponent;
  let fixture: ComponentFixture<ListeFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
