import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeVisiteComponent } from './liste-visite.component';

describe('ListeVisiteComponent', () => {
  let component: ListeVisiteComponent;
  let fixture: ComponentFixture<ListeVisiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeVisiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeVisiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
