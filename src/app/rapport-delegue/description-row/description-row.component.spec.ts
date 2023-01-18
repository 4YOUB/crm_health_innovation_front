import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionRowComponent } from './description-row.component';

describe('DescriptionRowComponent', () => {
  let component: DescriptionRowComponent;
  let fixture: ComponentFixture<DescriptionRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
