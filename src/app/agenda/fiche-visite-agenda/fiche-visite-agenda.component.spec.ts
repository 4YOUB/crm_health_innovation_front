import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheVisiteAgendaComponent } from './fiche-visite-agenda.component';

describe('FicheVisiteComponent', () => {
  let component: FicheVisiteAgendaComponent;
  let fixture: ComponentFixture<FicheVisiteAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FicheVisiteAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheVisiteAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
