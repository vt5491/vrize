import { TestBed, inject } from '@angular/core/testing';

import { VrizeCliService } from './vrize-cli.service';

describe('VrizeCliService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VrizeCliService]
    });
  });

  it('should be created', inject([VrizeCliService], (service: VrizeCliService) => {
    expect(service).toBeTruthy();
  }));
});
