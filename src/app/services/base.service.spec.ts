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

  //need this for some reason to prevent message when running parser.service.ts
  // 'Error: Cannot configure the test module when the test module has already been instantiated. Make sure you are not using `inject` before `TestBed.configureTestingModule`
  // see https://stackoverflow.com/questions/38985159/angular2-rc5-how-to-properly-configure-test-module
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', inject([BaseService], (service: BaseService) => {
    expect(service).toBeTruthy();
  }));

  it('global constants should be properly set', () => {
    expect(service.jsMarkupCommentBegin).toBeTruthy();
    expect(service.jsMarkupCommentEnd).toBeTruthy();
  });
});
