import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdministrationComponent } from './page-administration.component';

describe('PageAdministrationComponent', () => {
  let component: PageAdministrationComponent;
  let fixture: ComponentFixture<PageAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
