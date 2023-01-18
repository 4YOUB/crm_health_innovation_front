import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTabDocumentComponent } from './liste-tab-document.component';

describe('ListeTabDocumentComponent', () => {
  let component: ListeTabDocumentComponent;
  let fixture: ComponentFixture<ListeTabDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeTabDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeTabDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
