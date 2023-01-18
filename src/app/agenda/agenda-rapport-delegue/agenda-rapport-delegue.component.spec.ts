import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaRapportDelegueComponent } from './agenda-rapport-delegue.component';

describe('AgendaEquipeComponent', () => {
  let component: AgendaRapportDelegueComponent;
  let fixture: ComponentFixture<AgendaRapportDelegueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaRapportDelegueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaRapportDelegueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
