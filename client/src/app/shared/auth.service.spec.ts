import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AlertsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});