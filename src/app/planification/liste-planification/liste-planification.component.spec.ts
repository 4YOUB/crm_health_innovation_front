import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePlanificationComponent } from './liste-planification.component';

describe('ListePlanificationComponent', () => {
  let component: ListePlanificationComponent;
  let fixture: ComponentFixture<ListePlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListePlanificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
