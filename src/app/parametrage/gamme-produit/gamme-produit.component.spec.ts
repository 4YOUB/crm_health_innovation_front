import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GammeProduitComponent } from './gamme-produit.component';

describe('GammeProduitComponent', () => {
  let component: GammeProduitComponent;
  let fixture: ComponentFixture<GammeProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GammeProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GammeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
