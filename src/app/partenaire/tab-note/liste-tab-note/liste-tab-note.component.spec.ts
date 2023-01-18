import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTabNoteComponent } from './liste-tab-note.component';

describe('ListeTabNoteComponent', () => {
  let component: ListeTabNoteComponent;
  let fixture: ComponentFixture<ListeTabNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeTabNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeTabNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
