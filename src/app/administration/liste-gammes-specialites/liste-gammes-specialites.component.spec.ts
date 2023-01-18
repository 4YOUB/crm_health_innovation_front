import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeGammesSpecialitesComponent } from './liste-gammes-specialites.component';

describe('ListeGammesSpecialitesComponent', () => {
  let component: ListeGammesSpecialitesComponent;
  let fixture: ComponentFixture<ListeGammesSpecialitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeGammesSpecialitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeGammesSpecialitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
