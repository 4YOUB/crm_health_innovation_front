import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCodifComponent } from './ajouter-codif.component';

describe('AjouterCodifComponent', () => {
  let component: AjouterCodifComponent;
  let fixture: ComponentFixture<AjouterCodifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterCodifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterCodifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
