import { inject, TestBed } from '@angular/core/testing';

import { UnAuthGuard } from './unauth.guard';

describe('UnAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnAuthGuard]
    });
  });

  it('should ...', inject([UnAuthGuard], (guard: UnAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
