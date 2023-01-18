import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidezPdfComponent } from './aidez-pdf.component';

describe('AidezPdfComponent', () => {
  let component: AidezPdfComponent;
  let fixture: ComponentFixture<AidezPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AidezPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AidezPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
