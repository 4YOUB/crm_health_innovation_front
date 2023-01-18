import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePlanificationComponent } from './fiche-planification.component';

describe('FichePlanificationComponent', () => {
  let component: FichePlanificationComponent;
  let fixture: ComponentFixture<FichePlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichePlanificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichePlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
