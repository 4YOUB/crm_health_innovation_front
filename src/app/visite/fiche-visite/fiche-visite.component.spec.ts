import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheVisiteComponent } from './fiche-visite.component';

describe('FicheVisiteComponent', () => {
  let component: FicheVisiteComponent;
  let fixture: ComponentFixture<FicheVisiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FicheVisiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheVisiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
