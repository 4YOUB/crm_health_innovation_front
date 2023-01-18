import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDelegueComponent } from './liste-delegue.component';

describe('ListeDelegueComponent', () => {
  let component: ListeDelegueComponent;
  let fixture: ComponentFixture<ListeDelegueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeDelegueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDelegueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
