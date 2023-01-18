import { TestBed } from '@angular/core/testing';

import { RapportDelegueService } from './rapport-delegue.service';

describe('RapportDelegueService', () => {
  let service: RapportDelegueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapportDelegueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
