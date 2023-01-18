import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRegionsVillesSecteursComponent } from './liste-regions-villes-secteurs.component';

describe('ListeRegionsVillesSecteursComponent', () => {
  let component: ListeRegionsVillesSecteursComponent;
  let fixture: ComponentFixture<ListeRegionsVillesSecteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeRegionsVillesSecteursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeRegionsVillesSecteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
