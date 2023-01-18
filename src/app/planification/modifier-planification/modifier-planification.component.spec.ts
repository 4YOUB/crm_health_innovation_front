import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierPlanificationComponent } from './modifier-planification.component';

describe('ModifierPlanificationComponent', () => {
  let component: ModifierPlanificationComponent;
  let fixture: ComponentFixture<ModifierPlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierPlanificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
