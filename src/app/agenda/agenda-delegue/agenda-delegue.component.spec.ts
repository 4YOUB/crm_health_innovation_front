import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaDelegueComponent } from './agenda-delegue.component';

describe('AgendaEquipeComponent', () => {
  let component: AgendaDelegueComponent;
  let fixture: ComponentFixture<AgendaDelegueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaDelegueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaDelegueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
