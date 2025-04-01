import { TestBed } from '@angular/core/testing';

import { FriendgroupService } from './friendgroup.service';

describe('FriendgroupService', () => {
  let service: FriendgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
