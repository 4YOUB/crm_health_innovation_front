import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenairesModalComponent } from './partenaires-modal.component';

describe('PartenairesModalComponent', () => {
  let component: PartenairesModalComponent;
  let fixture: ComponentFixture<PartenairesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartenairesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenairesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
