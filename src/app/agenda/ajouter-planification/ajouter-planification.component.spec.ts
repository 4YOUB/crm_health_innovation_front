import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPlanificationComponent } from './ajouter-planification.component';

describe('AjouterPlanificationComponent', () => {
  let component: AjouterPlanificationComponent;
  let fixture: ComponentFixture<AjouterPlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterPlanificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
