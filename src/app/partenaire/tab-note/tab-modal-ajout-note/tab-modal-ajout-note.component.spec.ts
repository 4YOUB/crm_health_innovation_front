import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabModalAjoutNoteComponent } from './tab-modal-ajout-note.component';

describe('TabModalAjoutNoteComponent', () => {
  let component: TabModalAjoutNoteComponent;
  let fixture: ComponentFixture<TabModalAjoutNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabModalAjoutNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabModalAjoutNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
