import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRapportComponent } from './ajouter-rapport.component';

describe('AjouterRapportComponent', () => {
  let component: AjouterRapportComponent;
  let fixture: ComponentFixture<AjouterRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterRapportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
