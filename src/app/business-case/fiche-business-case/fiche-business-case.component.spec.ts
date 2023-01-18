import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheBusinessCaseComponent } from './fiche-business-case.component';

describe('FicheBusinessCaseComponent', () => {
  let component: FicheBusinessCaseComponent;
  let fixture: ComponentFixture<FicheBusinessCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FicheBusinessCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheBusinessCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
