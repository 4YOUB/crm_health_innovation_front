import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBusinessCaseComponent } from './ajouter-business-case.component';

describe('AjouterBusinessCaseComponent', () => {
  let component: AjouterBusinessCaseComponent;
  let fixture: ComponentFixture<AjouterBusinessCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBusinessCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBusinessCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
