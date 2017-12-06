import { TestBed, inject } from '@angular/core/testing';

import { TransformerService } from './transformer.service';

describe('TransformerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransformerService]
    });
  });

  it('should be created', inject([TransformerService], (service: TransformerService) => {
    expect(service).toBeTruthy();
  }));
});
