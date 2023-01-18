import { TestBed } from '@angular/core/testing';

import { ExpireSessionService } from './expire-session.service';

describe('ExpireSessionService', () => {
  let service: ExpireSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpireSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
