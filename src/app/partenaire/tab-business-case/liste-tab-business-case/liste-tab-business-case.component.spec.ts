import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTabBusinessCaseComponent } from './liste-tab-business-case.component';

describe('ListeTabBusinessCaseComponent', () => {
  let component: ListeTabBusinessCaseComponent;
  let fixture: ComponentFixture<ListeTabBusinessCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeTabBusinessCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeTabBusinessCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
