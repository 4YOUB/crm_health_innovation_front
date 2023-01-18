import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriListComponent } from './tri-list.component';

describe('TriListComponent', () => {
  let component: TriListComponent;
  let fixture: ComponentFixture<TriListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
