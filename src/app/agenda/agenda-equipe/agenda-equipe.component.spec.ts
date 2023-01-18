import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaEquipeComponent } from './agenda-equipe.component';

describe('AgendaEquipeComponent', () => {
  let component: AgendaEquipeComponent;
  let fixture: ComponentFixture<AgendaEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaEquipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
