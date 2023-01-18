import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEtablissementComponent } from './liste-etablissement.component';

describe('ListeEtablissementComponent', () => {
  let component: ListeEtablissementComponent;
  let fixture: ComponentFixture<ListeEtablissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeEtablissementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeEtablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
