import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBusinessCaseComponent } from './liste-business-case.component';

describe('ListeBusinessCaseComponent', () => {
  let component: ListeBusinessCaseComponent;
  let fixture: ComponentFixture<ListeBusinessCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeBusinessCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeBusinessCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
