import { TestBed } from '@angular/core/testing';

import { ListeCodifService } from './liste-codif.service';

describe('ListeCodifService', () => {
  let service: ListeCodifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeCodifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
