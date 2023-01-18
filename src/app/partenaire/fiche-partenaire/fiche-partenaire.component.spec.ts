import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichePartenaireComponent } from './fiche-partenaire.component';

describe('FichePartenaireComponent', () => {
  let component: FichePartenaireComponent;
  let fixture: ComponentFixture<FichePartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichePartenaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichePartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
