import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheEvenementAgendaComponent } from './fiche-evenement-agenda.component';

describe('FicheVisiteComponent', () => {
  let component: FicheEvenementAgendaComponent;
  let fixture: ComponentFixture<FicheEvenementAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FicheEvenementAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheEvenementAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
