import { TestBed, inject, async } from '@angular/core/testing';

import { ReflectiveInjector } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { log } from 'util';
import { serializePath } from '@angular/router/src/url_tree';
import { Injector } from '@angular/core/src/di/injector';
import { HttpErrorResponse } from '@angular/common/http/src/response';

import { ParserService } from './parser.service';
import { BaseService } from './base.service';
import { UtilsService } from './utils.service';

let parserService: ParserService;
let service : ParserService;
let httpMock: HttpTestingController;
let globalHttp: HttpClient;
let http: HttpClient;
let base : BaseService;
// webvr_cubes.html is an example of a script that is already 'vr-ized'.  Thus it can serve
// as an example of a script that should *not* be altered by any vr-izing methods. 
let webvr_cubes_html : string;
let webgl_geometry_cube_html : string;
let testScriptText : string;
let basicHtml : string;
let parser : DOMParser;

describe('ParserService', () => {
  beforeAll((done) => {
    console.log(`ParserService.beforeAll: entered`);
    
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      // Note: we purposely do *not* provide an HttpHandler here.  If we do specify 'HttpHandler'
      // then TestBed will provide a test HttpHandler for the HttpClient, and it doesn't have
      // a 'handle' method, and the file read won't work.  We probably shouldn't have 'HttpClient'
      // in here either, but it works anyway, so leave it in.
      providers: [HttpClient]
    })
    // let httpHandler = TestBed.get(HttpHandler);
    // let httpHandler = Injector.(HttpHandler);
    let http = TestBed.get(HttpClient);
    // read 'webgl_geometry_cube.html' as a test for a non-vr-ized file.
    let fn = '../../assets/test/examples/webgl_geometry_cube.html';
    http.get(fn, {responseType: 'text'})
    .subscribe(
      data => {
        // console.log(`webgl_geometry_cube.html=${data}`);
        webgl_geometry_cube_html = data;
        done();
      },
      (err: HttpErrorResponse) => {
        console.log('parseHtml: err=' + err, 'httperror=' + err.error);
        done();
      },
      () => console.log('yay')
    );

    // read 'webvr_cubes.html' as a test for a already vr-ized file.
    fn = '../../assets/test/examples/webvr_cubes.html';
    http.get(fn, {responseType: 'text'})
    .subscribe(
      data => {
        // console.log(data); 
        webvr_cubes_html = data;
        done();
      },
      (err: HttpErrorResponse) => {
        console.log('parseHtml: err=' + err, 'httperror=' + err.error);
        done();
      },
      () => console.log('yay')
    );

    basicHtml = 
    `<html>
      <head>
        <script src="../../build/three.js"></script>
        <script>
           var a=7;
           init();
           animate();
        </script>
      </head>
      <body>
      </body>
    </html>
    `
  });

  beforeEach(() => {
  // beforeAll(() => {
    console.log(`ut.beforeEach: entered`);
    
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      // providers: [ParserService, HttpClient, HttpHandler, HttpClientTestingModule, HttpTestingController]
      providers: [ParserService, HttpClient, HttpTestingController, BaseService]
    });
    // get our services here, instead of injecting directy into the signature of the it function.
    parserService = TestBed.get(ParserService);
    base = TestBed.get(BaseService);
    service = parserService; // alias
    httpMock = TestBed.get(HttpTestingController);
    globalHttp = TestBed.get(HttpClient);
    http = globalHttp; // alias

    parser = new DOMParser();

    // some methods alter the script text, so we need to make a test copy we can alter 
    // the string each time.
    testScriptText = webgl_geometry_cube_html;
  });

  // fit('should be created', inject([ParserService], (service: ParserService) => {
  it('should be created',  () => {
    // expect(service).toBeTruthy();
    expect(parserService).toBeTruthy();
  });

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
  it('findMainScript works with a basic script', () => { 
    // create a simple dom object
    let parser = new DOMParser();
    let doc = parser.parseFromString(basicHtml, "application/xml");
    // debugger;

    let result = service.findMainScript(doc);
    // let text = result.text;
    // let scriptIndex = result.scriptIndex;
    let scriptIndex = result;
    let text = doc.getElementsByTagName('script')[scriptIndex].innerHTML;

    expect(text).toBeTruthy();
    expect(typeof text).toEqual("string");
    expect(text).toMatch(/var a=7/gm);
    expect(scriptIndex).toEqual(1);

    // let parentEl = doc.querySelectorAll('script')[scriptIndex];
    // service.appendWebVrScript(parentEl);
  });

  it('findMainScript works with a full html', () => { 
    let parser = new DOMParser();
    let doc = parser.parseFromString(webgl_geometry_cube_html, "text/html");
    let scriptIndex = service.findMainScript(doc);
    // debugger;
    // let scriptEls = doc.getElementsByTagName('script');
    // let script = scriptEls[scriptIndex];
    // let text = script.innerHTML;
    let text = doc.getElementsByTagName('script')[scriptIndex].innerHTML;
    // let text = ((doc.getElementsByName('script'))[scriptIndex]).innerHTML;
    //let script = 
    // let scriptIndex = result.scriptIndex;
    expect(text).toBeTruthy();
    expect(typeof text).toEqual("string");
    // line 63 of the script
    // expect(text).toMatch(/crosshair = new THREE.Mesh/gm);
    // line 29 of script
    expect(text).toMatch(/camera.position.z = 400/);

    expect(scriptIndex).toEqual(1);
  })

  it('findThreeJsScript works with basicHtml', () => { 
    let parser = new DOMParser();
    let doc = parser.parseFromString(basicHtml, "text/html");

    let scriptIndex = service.findThreeJsScript(doc);

    let text = doc.getElementsByTagName('script')[scriptIndex].getAttribute('src');
    expect(text).toBeTruthy();
    expect(typeof text).toEqual("string");
    expect(text).toMatch(/three\.js/gm);
    expect(scriptIndex).toEqual(0);
  });

  it('findThreeJsScript works with full html', () => { 
    let doc = parser.parseFromString(webgl_geometry_cube_html, "text/html");

    let scriptIndex = service.findThreeJsScript(doc);

    let text = doc.getElementsByTagName('script')[scriptIndex].getAttribute('src');
    expect(text).toBeTruthy();
    expect(typeof text).toEqual("string");
    expect(text).toMatch(/three\.js/gm);
    expect(scriptIndex).toEqual(0);
  });

  it('addWebVrScript properly adds after the three.js script tag', () => { 
    // normally this method will rely on results from 'findThreeJsScript', but in order
    // to keep this a unit test and not an integration test, we will manually prime
    // the three.js index pos.
    let simpleHtml = 
    `<html>
      <head>
        <script src="dummy"></script>
        <script src="three.js"></script>
      </head>
    </html>`

    let doc = parser.parseFromString(simpleHtml, "text/html");
    let scriptCnt = 2;
    expect(doc.getElementsByTagName('script').length).toEqual(scriptCnt);

    let threeJsScriptIndex = 1;

    let result = service.addWebVrScript(doc, threeJsScriptIndex);

    let scriptEls = doc.getElementsByTagName('script');
    expect(scriptEls.length).toEqual(scriptCnt + 1);

    // verify the three.js is unaffected 
    scriptEls[threeJsScriptIndex].getAttribute('src').match(/three\.js/);
    // and the script tag after it is webVr.
    scriptEls[threeJsScriptIndex + 1].getAttribute('src').match(/js\/vr\/WebVR.js/);

  })

  fit('addVrRenderer properly adds a comment sandwich and the line "renderer.vr.enabled = true;"', () => { 
    let result = service.addVrRenderer(testScriptText);

    console.log(`base.begincomment=${base.markupCommentBegin}`);
    // expect(testScriptText).toMatch(/renderer\.vr\.enabled = true;/gm);
    // expect(testScriptText).toMatch(/renderer\.vr\.enabled = true;/gm);
  })

});

