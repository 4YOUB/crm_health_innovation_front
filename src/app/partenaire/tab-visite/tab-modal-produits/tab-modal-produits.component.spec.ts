import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabModalProduitsComponent } from './tab-modal-produits.component';

describe('TabModalProduitsComponent', () => {
  let component: TabModalProduitsComponent;
  let fixture: ComponentFixture<TabModalProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabModalProduitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabModalProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
