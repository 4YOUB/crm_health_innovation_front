import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAjouterDocumentComponent } from './tab-ajouter-document.component';

describe('TabAjouterDocumentComponent', () => {
  let component: TabAjouterDocumentComponent;
  let fixture: ComponentFixture<TabAjouterDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabAjouterDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabAjouterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
