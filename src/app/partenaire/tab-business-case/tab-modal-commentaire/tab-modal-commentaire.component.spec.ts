import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabModalCommentaireComponent } from './tab-modal-commentaire.component';

describe('TabModalCommentaireComponent', () => {
  let component: TabModalCommentaireComponent;
  let fixture: ComponentFixture<TabModalCommentaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabModalCommentaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabModalCommentaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
