import { TestBed, inject, async } from '@angular/core/testing';

import { ReflectiveInjector } from '@angular/core';
import { ParserService } from './parser.service';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { log } from 'util';
import { serializePath } from '@angular/router/src/url_tree';
import { Injector } from '@angular/core/src/di/injector';

let parserService: ParserService;
let service : ParserService;
let httpMock: HttpTestingController;
let globalHttp: HttpClient;
let http: HttpClient;
let scriptText1 : string;
/*
// function getAnnotations(typeOrFunc: Type<any>): any[]|null {
function getAnnotations(typeOrFunc: any): any[]|null {
  // Prefer the direct API.
  if ((<any>typeOrFunc).annotations) {
    let annotations = (<any>typeOrFunc).annotations;
    if (typeof annotations === 'function' && annotations.annotations) {
      annotations = annotations.annotations;
    }
    return annotations;
  }

  // API of tsickle for lowering decorators to properties on the class.
  if ((<any>typeOrFunc).decorators) {
    return convertTsickleDecoratorIntoMetadata((<any>typeOrFunc).decorators);
  }

  // API for metadata created by invoking the decorators.
  // if (Reflect && Reflect.getOwnMetadata) {
  //   return Reflect.getOwnMetadata('annotations', typeOrFunc);
  // }
  return null;
}

function convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
  if (!decoratorInvocations) {
    return [];
  }
  return decoratorInvocations.map(decoratorInvocation => {
    const decoratorType = decoratorInvocation.type;
    const annotationCls = decoratorType.annotationCls;
    const annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
    return new annotationCls(...annotationArgs);
  });
}

const injector = ReflectiveInjector.resolveAndCreate(getAnnotations(HttpClientModule)[0].providers);
const httpInjected = injector.get(HttpClient);
// const injector = ReflectiveInjector.resolveAndCreate([
//   Http,
//   BrowserXhr,
//   {provide: RequestOptions, useClass: BaseRequestOptions},
//   {provide: ResponseOptions, useClass: BaseResponseOptions},
//   {provide: ConnectionBackend, useClass: XHRBackend},
//   {provide: XSRFStrategy, useFactory: () => new CookieXSRFStrategy()},
// ]);
// const http = injector.get(Http);


  let testScript1 : string;
  // helper function.  Read
  // function readTestScript() {

  // }
  beforeAll( (done) => {
    console.log(`ut.beforeAll: entered`);
    let fn = '../../assets/test/examples/webvr_cubes.html';

    // let injector = new Injector();
    // let http = injector.get(HttpClient);
    // let http = new HttpClient( new HttpHandler());
    httpInjected.get(fn, {responseType: 'text'})
    .subscribe(
      data => {
        console.log(`beforeAll:data=${data}`);
        done();
      },
      err => console.log('parseHtml: err=' + err),
      () => console.log('yay')
    );
  })
  */

fdescribe('ParserService', () => {
  beforeAll((done) => {
    console.log(`ParserService.beforeAll: entered`);
    
    // TestBed.configureTestingModule({
    //   providers: [HttpClient]
    // })
    let fn = '../../assets/test/examples/webvr_cubes.html';
    fetch(fn, { method: 'get' })
    .then((response) => {
        let reader = response.body.getReader();
        reader.read().then( (data) => {
          var string = new (window as any).TextDecoder("utf-8").decode(data.value);
          // console.log(`beforeAll.reader:string=${string}`);
          scriptText1 = string;
          // debugger;
          done();
        })
        // debugger;
        console.log(`ut.beforeAll:response=${response}`);
        // done();
    });
  });

  beforeEach(() => {
  // beforeAll(() => {
    console.log(`ut.beforeEach: entered`);
    
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      // providers: [ParserService, HttpClient, HttpHandler, HttpClientTestingModule, HttpTestingController]
      providers: [ParserService, HttpClient, HttpTestingController]
    });
    // get our services here, instead of injecting directy into the signature of the it function.
    parserService = TestBed.get(ParserService);
    service = parserService; // alias
    httpMock = TestBed.get(HttpTestingController);
    globalHttp = TestBed.get(HttpClient);
    http = globalHttp; // alias
  });

  // fit('should be created', inject([ParserService], (service: ParserService) => {
  it('should be created',  () => {
    // expect(service).toBeTruthy();
    expect(parserService).toBeTruthy();
  });

  // it('should return error if country request failed', (done) => {
  //   parserService.parseHtml('abc')
  //                  .subscribe((res: any) => {
  //                    expect(res.failure.error.type).toBe('ERROR_LOADING_COUNTRIES');
  //                    done();
  //                  });

  //   // let countryRequest = httpMock.expectOne('./assets/countries.json');
  //   // countryRequest.error(new ErrorEvent('ERROR_LOADING_COUNTRIES'));

  //   // httpMock.verify();
  // });

  // it('parseHtml works', inject([ParserService], (service: ParserService) => {
  it('parseHtml works',  () => {
    // expect(service).toBeTruthy();
    let htmlText = `
    <html>
      <head id='myHead'></head>
      <body>abc</body>
    </html>
    `;
    let doc = service.parseHtml(htmlText);
    expect(doc.getElementById('myHead')).toBeTruthy();
    // debugger;
  });

  // fit('getMainScript works', inject([ ParserService, HttpClient], 
  //   (service: ParserService, http: HttpClient, done ) => {
  fit('extractMainScript works', () => { 
    // ( done ) => {
    // console.log(`ut.getMainscript: entered`);
    
    // let fn = '../../assets/test/examples/webvr_cubes.html';
    // fetch(fn, { method: 'get' })
    // .then((response) => {
    //     let reader = response.body.getReader();
    //     reader.read().then( (data) => {
    //       var string = new (window as any).TextDecoder("utf-8").decode(data.value);
    //       console.log(`reader:string=${string}`);
    //       // debugger;
    //       done();
    //     })
    //     // debugger;
    //     console.log(`ut.getMainScript:response=${response}`);
    //     // done();
    // });
    let result = service.extractMainScript(scriptText1);
    expect(result).toBeTruthy();
    // debugger;
    // globalHttp.get(fn, {responseType: 'text'})
    // http.get(fn, {responseType: 'text'})
    // .subscribe(
    //   data => {
    //     debugger;
    //     console.log(`ut.getMainScript:data=${data}`);
    //     done();
    //   },
    //   err => {
    //     console.log('ut.getMainScript: err=' + err);
    //     done();
    //   },
    //   () => console.log('yay')
    // );
  });

  /*
  fit('parseHtml properly parses', inject([ParserService, HttpClient, HttpTestingController], 
    (service: ParserService, http: HttpClient, httpMock: HttpTestingController) => {
    let fn = '../../assets/test/examples/webvr_cubes.html';
    console.log('now in parseHtml test driver');
    // let fn = './parser.service.ts';
    async(
      // 2. inject HttpClient and HttpTestingController into the test
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
        console.log('now in async');
        // 3. send a simple request
        // http.get('/foo/bar').subscribe();
        http.get(fn).subscribe();

        // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
        // here two, it's significantly less boilerplate code needed to verify an expected request
        backend.expectOne({
          url: fn,
          method: 'GET'
        });
      })
    )

    http
    .get(fn)
    .subscribe(data => expect(data['name']).toEqual('Test Data'));

    const req = httpMock.expectOne(fn);

    expect(req.request.method).toEqual('GET');
    
     // Next, fulfill the request by transmitting a response.
     req.flush({name: 'Test Data'});
    
    //  // Finally, assert that there are no outstanding requests.
    //  httpMock.verify();

    // http.get(fn, {responseType: 'text'})
    //  .subscribe(data => {
    //    console.log('now in subscribe handler');
    //    console.log(data);
    //  },
    //  err => {
    //    console.log(`err=${err}`);
    //  }
    // );
    // http.get(fn, {responseType: 'text'})
    // .subscribe(
    //   data => console.log(data),
    //   err => console.log(err),
    //   () => console.log('yay')
    // );
    // service.parseHtml('<html></html>');

  }));
  */
});

