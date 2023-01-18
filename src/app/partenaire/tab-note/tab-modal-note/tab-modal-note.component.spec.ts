import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabModalNoteComponent } from './tab-modal-note.component';

describe('TabModalNoteComponent', () => {
  let component: TabModalNoteComponent;
  let fixture: ComponentFixture<TabModalNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabModalNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabModalNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
