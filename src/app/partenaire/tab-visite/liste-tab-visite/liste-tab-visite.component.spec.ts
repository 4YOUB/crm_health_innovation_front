import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTabVisiteComponent } from './liste-tab-visite.component';

describe('ListeTabVisiteComponent', () => {
  let component: ListeTabVisiteComponent;
  let fixture: ComponentFixture<ListeTabVisiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeTabVisiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeTabVisiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
