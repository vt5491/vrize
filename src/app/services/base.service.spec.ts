import { TestBed, inject } from '@angular/core/testing';

import { BaseService } from './base.service';

describe('BaseService', () => {

  let service : BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseService]
    });
    service = TestBed.get(BaseService); 
  });

  it('should be created', inject([BaseService], (service: BaseService) => {
    expect(service).toBeTruthy();
  }));

  it('global constants should be properly set', () => {
    expect(service.markupCommentBegin).toBeTruthy();
    expect(service.markupCommentEnd).toBeTruthy();
  });
});
