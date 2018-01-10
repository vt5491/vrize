import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import {RouterTestingModule} from '@angular/router/testing'

import { UtilsService } from './utils.service';
import { BaseService } from './base.service';
import { log } from 'util';

// beforeEach(() => { TestBed.configureTestingModule({ declarations: [ AppComponent ], imports: [ RouterTestingModule ] });

let service : UtilsService;
let base : BaseService;
let parser : DOMParser;
let simpleDoc : Document;
let htmlStr = `
<html>
  <head>
    <script id='script1'></script>
  </head>
</html>
`

describe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService, BaseService, HttpClient, HttpHandler],
      imports: [RouterTestingModule]
    });
    service = TestBed.get(UtilsService);
    base = TestBed.get(BaseService);

    parser = new DOMParser();
    simpleDoc = parser.parseFromString(htmlStr, "text/html");
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('jsCommentSandwich put the passed text between "start" and "end" comments', () => {
    let result = service.jsCommentSandwich("abc");

    let beginTag = base.jsMarkupCommentBegin;
    let endTag = base.jsMarkupCommentEnd;

    // expect(result).toEqual(`${beginTag}\nabc\n${endTag}`);
  })

  it('htmlCommentSandwich adds a comment bracket to a node in simpleDoc', () => {
    let scriptNode = simpleDoc.getElementById('script1');
    let result = service.htmlCommentSandwich(simpleDoc, scriptNode);

    let beginTag = base.htmlMarkupCommentBegin;
    let endTag = base.htmlMarkupCommentEnd;

    let strResult = new XMLSerializer().serializeToString(simpleDoc);
    // console.log(`strResult=${strResult}`);
    let re = new RegExp(`\<\!--${beginTag}--\>[\n]*.*\<\!--${endTag}--\>`);
    expect(strResult).toMatch(re);
  })

  it('alterSandwich put the passed text between "start" and "end" comments', () => {
    let result = service.alterSandwich("abc");

    let beginTag = base.jsMarkupAlterBegin;
    let endTag = base.jsMarkupAlterEnd;

    expect(result).toEqual(`${beginTag}\nabc\n${endTag}`);
    // console.log(`result=${result}`);

  })
  // it('getFileText abc.html works', inject([UtilsService, HttpClient],
  //     (service: UtilsService, http: HttpClient) => {
  // // it('getFileText abc.html works', inject([UtilsService, HttpClient],
  // //     (service: UtilsService, http: HttpClient) => {
  //   // spyOn(http, "get").and.returnValue('<html></html>');
  //   // let textObs = service.getText('../../assets/test/abc.json');
  //   let textObs = service.getText('../../assets/test/abc.html');
  //   // let textObs = service.getText('/src/assets/test/abc.json');
  //   textObs.subscribe(
  //     data => {
  //       console.log(`ut: data=${data}`);
  //     },
  //     err => {
  //       debugger;
  //       console.log('err= ' + err);
  //     },
  //     () => console.log('yay'))
  //   // expect(text).toBeTruthy();
  //   // expect(text).toMatch(/<html>/);
  // }));

  // it('abc', inject([UtilsService, HttpClient], (service: UtilsService, http: HttpClient) => {
  //   spyOn(http, "get").and.returnValue('<html></html>');

  //   let utils = new UtilsService(http);

  //   let textObs = utils.getText('../../assets/test/abc.html');

  //   textObs.subscribe(
  //     data => {
  //       console.log(`ut: data=${data}`);
  //     },
  //     err => {
  //       debugger;
  //       console.log('err= ' + err);
  //     },
  //     () => console.log('yay'))

  // }))
});
