import { TestBed } from '@angular/core/testing';

import { BusinessCaseService } from './business-case.service';

describe('BusinessCaseService', () => {
  let service: BusinessCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
