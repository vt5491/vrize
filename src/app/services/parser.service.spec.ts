import { TestBed, inject, async, resetFakeAsyncZone } from '@angular/core/testing';

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
import * as _ from 'lodash';

let parserService: ParserService;
let service : ParserService;
let httpMock: HttpTestingController;
let globalHttp: HttpClient;
let http: HttpClient;
let base : BaseService;
let utils : UtilsService;
// webvr_cubes.html is an example of a script that is already 'vr-ized'.  Thus it can serve
// as an example of a script that should *not* be altered by any vr-izing methods.
let webvr_cubes_html : string;
let webgl_geometry_cube_html : string;
let testScriptHtml : string;
let testScriptText : string;
let testScriptDoc : Document;
let basicHtml : string;
let basicDoc : Document;
let simpleScriptText : string;
let parser : DOMParser;

describe('ParserService', () => {

  //Note: the file load is not what causes the few seconds lag in the browser
  // running the uts.  What is slowing it down is the 'ng test' compile step
  beforeAll((done) => {
  // beforeAll(() => {
    console.log(`ParserService.beforeAll: entered`);

    // TestBed.resetTestEnvironment();
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      // Note: we purposely do *not* provide an HttpHandler here.  If we do specify 'HttpHandler'
      // then TestBed will provide a test HttpHandler for the HttpClient, and it doesn't have
      // a 'handle' method, and the file read won't work.  We probably shouldn't have 'HttpClient'
      // in here either, but it works anyway, so leave it in.
      providers: [HttpClient]
    })
    // TestBed.configureTestingModule({
    //   imports: [
    //     HttpClientTestingModule
    //   ],
    //   // providers: [ParserService, HttpClient, HttpHandler, HttpClientTestingModule, HttpTestingController]
    //   providers: [ParserService, HttpClient, HttpTestingController, BaseService, UtilsService]
    // });
    // let httpHandler = TestBed.get(HttpHandler);
    // let httpHandler = Injector.(HttpHandler);
    let http = TestBed.get(HttpClient);
    // read 'webgl_geometry_cube.html' as a test for a non-vr-ized file.
    // let fn = '../../assets/test/examples/unix_style/webgl_geometry_cube.html';
    let fn = '../../assets/test/examples/windows_style/webgl_geometry_cube.html';
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
      () => {
        //TODO: put calls for other files here and put the 'done()' call in the last of the chain
        console.log('yay')
      }
    );

    // // read 'webvr_cubes.html' as a test for a already vr-ized file.
    // fn = '../../assets/test/examples/webvr_cubes.html';
    // http.get(fn, {responseType: 'text'})
    // .subscribe(
    //   data => {
    //     // console.log(data);
    //     webvr_cubes_html = data;
    //     done();
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log('parseHtml: err=' + err, 'httperror=' + err.error);
    //     done();
    //   },
    //   () => console.log('yay')
    // );

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

    simpleScriptText =
    `
    var camera, scene, renderer;
    var mesh;

    function init() {
      innerGame.innerWebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
      var a = 7;
      document.body.appendChild( innerGame.innerWebGLRenderer.domElement );
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.z = 400;
      scene = new THREE.Scene();
    }

    function animate() {

      requestAnimationFrame( animate );

      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;

      renderer.render( scene, camera );

    }
    `
  });

  beforeEach(() => {
    // console.log(`ut.beforeEach: entered`);

    // TestBed.resetTestEnvironment();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      // providers: [ParserService, HttpClient, HttpHandler, HttpClientTestingModule, HttpTestingController]
      providers: [ParserService, HttpClient, HttpTestingController, BaseService, UtilsService]
    });
    // get our services here, instead of injecting directy into the signature of the it function.
    parserService = TestBed.get(ParserService);
    base = TestBed.get(BaseService);
    utils = TestBed.get(UtilsService);
    service = parserService; // alias
    httpMock = TestBed.get(HttpTestingController);
    globalHttp = TestBed.get(HttpClient);
    http = globalHttp; // alias

    parser = new DOMParser();

    // some methods alter the script text, so we need to make a test copy we can alter
    // the string each time.
    testScriptHtml = webgl_geometry_cube_html;

    // technically, anything that uses this is an integration test, since we're assuming
    // that 'findMainScript' and 'parseHtml' are working properly.
    testScriptDoc = service.parseHtml(testScriptHtml);
    let testScriptIndex = service.findMainScript(testScriptDoc);
    testScriptText = testScriptDoc.scripts[testScriptIndex].innerHTML;
    // debugger;
    // console.log(`testScriptText=${testScriptText}`);
    basicDoc = parser.parseFromString(basicHtml, "application/xml");

  });

  // afterEach(() => {
  //   TestBed.resetTestingModule();
  // });

  // fit('should be created', inject([ParserService], (service: ParserService) => {
  it('should be created',  () => {
    // expect(service).toBeTruthy();
    expect(parserService).toBeTruthy();
  });

  it('addHtmlTimeStamp works',  () => {
    service.addHtmlTimeStamp(basicDoc);

    var htmlEl= basicDoc.getElementsByTagName('html')[0]

    let now = (new Date()).toString();
    // verify an html comment has been inserted right after the html tag appendEl
    // before the <head> tag.
    // just check the month and date, as our compare time could be a little different.
    expect(htmlEl.childNodes[1].textContent.substring(0,41))
      .toMatch('vrize conversion performed on ' + now.substring(0,10));

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

  it('addLibs properly adds after the three.js script tag', () => {
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

    let result = service.addLibs(doc, threeJsScriptIndex);

    let scriptEls = doc.getElementsByTagName('script');
    expect(scriptEls.length).toEqual(scriptCnt + 4);


    // verify the three.js is unaffected
    scriptEls[threeJsScriptIndex].getAttribute('src').match(/three\.js/);
    // and the script tag after it is webVr.
    scriptEls[threeJsScriptIndex + 1].getAttribute('src').match(/js\/vr\/WebVR.js/);
    // and the script tag after that is vrize_kbd.
    scriptEls[threeJsScriptIndex + 2].getAttribute('src').match(/js\/vrize\/vrize_kbd.js/);
    // and the script tag after that is vrize_controller.
    scriptEls[threeJsScriptIndex + 3].getAttribute('src').match(/js\/vrize\/vrize_controller.js/);
    // and the script tag after that is VRController.
    scriptEls[threeJsScriptIndex + 4].getAttribute('src').match(/js\/vrize\/VRController.js/);

    // make sure the text has a lib per line e.g not all placed on one line
    // console.log(`ut.addWebVrScript: doc.innerHTML=${doc.documentElement.innerHTML}`);
    // console.log(`ut.addWebVrScript: doc.outerHTML=${doc.documentElement.innerHTML}`);
    // let resultText = doc.documentElement.innerHTML;
    //
    // let pat = `three\\.js.*</script\>\\n.*<!--${base.jsMarkupCommentBegin}`;
    // // expect(resultText).toMatch(/three\.js.*\</script\>\n.*<--!${})
    // expect(resultText).toMatch(new RegExp(pat));

    // console.log(`result=${doc.scripts[threeJsScriptIndex + 1].getAttribute('src')}`);
    // console.log(`result=${doc.documentElement.innerHTML}`);

    // make sure it's wrapped in a coment sandwich
    // believe it or not, this is really hard to do, so skip it.
    // expect(scriptEls)
    // console.log(`nextSibiling=${scriptEls.nextSibling}`);
    // debugger;
    // console.log(`nextSibiling=${scriptEls.nextSibling}`);

  })

  it('addVrRenderer properly adds a comment sandwich and the line "renderer.vr.enabled = true;"', () => {
    let result = service.addVrRenderer(simpleScriptText);

    // console.log(`base.begincomment=${base.markupCommentBegin}`);
    // expect(result).toMatch(/renderer\.vr\.enabled = true;/gm);
    let newText = service.getVrRendererTemplate('innerGame.innerWebGLRenderer');
    let insertText = utils.jsCommentSandwich(newText);
    let re = new RegExp(insertText, "gm");

    expect(result['newText']).toMatch(re);
    expect(result['rendererName']).toEqual('innerGame.innerWebGLRenderer');
    // expect(testScriptHtml).toMatch(/renderer\.vr\.enabled = true;/gm);
  })

  it('addVrRenderer works on a real script', () => {
    let result = service.addVrRenderer(testScriptHtml);

    let newText = service.getVrRendererTemplate('renderer');
    let insertText = utils.jsCommentSandwich(newText);
    let re = new RegExp(insertText, "gm");

    expect(result['newText']).toMatch(re);
    expect(result['rendererName']).toEqual('renderer');
    // expect(testScriptHtml).toMatch(/renderer\.vr\.enabled = true;/gm);
    // console.log(`ut:addVrRenderer: result=${result}`);

  })

  it('addVrButton works on a basic script', () => {
    let rendererName = 'innerGame.innerWebGLRenderer';
    let appendEl = 'document.body';
    let result = service.addVrButton(simpleScriptText, rendererName);

    let newText = service.getVrButtonTemplate(appendEl, rendererName);
    let insertText = utils.jsCommentSandwich(newText);
    //Don't know why I have to escape it in the ut, but not in the main code..
    // insertText = insertText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    insertText = utils.escapeText(insertText);
    // console.log(`ut:insertText=${insertText}`);

    let re = new RegExp(insertText, "m");

    expect(result).toMatch(re, 'm');
    // console.log(`ut:result=${result}`);
    // debugger;
  });

  it('addVrAnimateFn works with a simple script', () => {
    let result = service.addVrAnimateFn(simpleScriptText);
    let vrizeRenderName = `${base.appTag}_render`;
    console.log(`ut:addVrAnimateFn: result=${result}`);
    // debugger;
    let expectedText = service.getVrAnimateFnTemplate();

    let re = new RegExp(`renderer.animate\\(${vrizeRenderName}\\)`, 'm');
    expect(expectedText).toMatch(re);
    // expectedText = expectedText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    expectedText = utils.escapeText(expectedText)

    re = new RegExp(`\n\s*${expectedText}\s*\n`, 'gm');
    // let re = new RegExp(`{expectedText}`, 'gm');

    let ms = result.match(re);

    expect(ms.length).toEqual(1);

    // verify the original animate function is renamed to 'render'
    // let animateCommentOutRe = new RegExp(`//\s*function animate`, 'm');
    // let renderRe = new RegExp(/\n\s*function render\(/, 'm');
    // let vrizeRenderName = `render`;
    // let renderRe = new RegExp(/\n\s*function render\(.*\) \{/, 'm');
    let renderRe = new RegExp(`\\n\\s*function ${vrizeRenderName}\\(.*\\) \\{`, 'm');
    expect(result).toMatch(renderRe);

    // verify 'requestAnimationFrame is commented out
    let rafRe= new RegExp(/\/\/\s*requestAnimationFrame/);
    expect(result).toMatch(rafRe);

    // verify statement 'THREE.VRController.update();' has been added
    re = new RegExp(`${base.jsMarkupCommentBegin}\\n.*THREE.VRController.update.*\\n.*${base.jsMarkupCommentEnd}`);
    // console.log(`newText`);
    expect(result).toMatch(re, 'm');
  })

  it('addVrAnimateFn works on a real script', () => {
    let result = service.addVrAnimateFn(testScriptText);

    let expectedText = service.getVrAnimateFnTemplate();
    expectedText = utils.escapeText(expectedText)

    let re = new RegExp(`\n\s*${expectedText}\s*\n`, 'gm');

    let ms = result.match(re);

    expect(ms.length).toEqual(1);

    // verify the original animate function is renamed to 'vrize_render'
    let vrizeRenderName = `${base.appTag}_render`;
    // let renderRe = new RegExp(/\n\s*function render/, 'm');
    let renderRe = new RegExp(`\\n\\s*function ${vrizeRenderName}`, 'm');
    expect(result).toMatch(renderRe);

    // verify 'requestAnimationFrame is commented out
    let rafRe= new RegExp(/\/\/\s*requestAnimationFrame/);
    expect(result).toMatch(rafRe);

    // console.log(`result=${result}`);

  })

  it('extractInitCameraPos works on a simple script', () => {
    let extractedPos = service.extractInitCameraPos(simpleScriptText);

    expect(extractedPos.z).toEqual(400);
  })

  it('extractInitCameraPos works on position.set', () => {
    let testScript = `
camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
camera.position.set( 30, 40, 100 );
    `
    let extractedPos = service.extractInitCameraPos(testScript);

    expect(extractedPos.x).toEqual(30);
    expect(extractedPos.y).toEqual(40);
    expect(extractedPos.z).toEqual(100);
  })

  it('addDolly properly inserts its stub', () => {
    let newScript = service.addDolly(simpleScriptText);
    // console.log(`ut.parser.service.spec.ts: newScript=${newScript}`);

    // expect(newScript).toMatch(/dolly\.position\.set\(0, 0, 400\)/, 'm');
    expect(newScript).toMatch(/dolly\.position\.set\(0, 0, 400\)/, 'm');

  })

  it('addDollyToScene works', () => {
    let newScript = service.addDollyToScene(simpleScriptText);
    // newScript = utils.escapeText(newScript);
    // console.log(`ut.parser.service.spec.ts: newScript=${newScript}`);
    // let re = /scene = new THREE.Scene\(\);
    // let line1 = 'scene = new THREE.Scene\\(\\);\n';
    let line1 = 'scene = new THREE.Scene\\(\\);\n';
    let line2 = base.jsMarkupCommentBegin + "\n";
    // let line2 = _.unescape(base.jsMarkupCommentBegin) + "\n";
    // line2 = _.unescape(line2);
    // console.log(`line2=${line2}`);
    let line3 = 'scene.add\\(dolly\\);';

//     let expectedText = `scene = new THREE.Scene();
//     .*
// scene.add(dolly);
// `

    let re = new RegExp(_.unescape(line1 + line2 + line3), 'm');
    // let re = new RegExp(expectedText, 'm');

    expect(newScript).toMatch(re);

    // expect(newScript).toMatch(/dolly\.position\.set\(0, 0, 400\)/, 'm');
  });

  it('addCameraToDolly works', () => {
    let newScript = service.addCameraToDolly(simpleScriptText);
    // console.log(`ut.parser.service.spec.ts: newScript=${newScript}`);
    let line1 = 'camera = new THREE.PerspectiveCamera.*\\n';
    let line2 = base.jsMarkupCommentBegin + "\n";
    let line3 = 'dolly.add\\(camera\\);';

    // let re = new RegExp(_.unescape(line1 + line2 + line3), 'm');
    let re = new RegExp(line1 + line2 + line3, 'm');

    expect(newScript).toMatch(re);
  });

  it('addDollyVar works', () => {
    let newScript = service.addDollyVar(simpleScriptText);
    // console.log(`ut.parser.service.spec.ts: newScript=${newScript}`);
    expect(newScript).toMatch(/var dolly;/, 'm');
  })

  it('addVrDisplayActivate works', () => {
    let renderer = "testRenderer";
    let newScript = service.addVrDisplayActivate(simpleScriptText, renderer);
    console.log(`ut.parser.service.spec.ts: newScript=${newScript}`);
    expect(newScript).toMatch(/window.addEventListener\(\'vrdisplayactivate\'/, 'm');

    // expect(newScript).toMatch(/testRenderer.vr.getDevice\(\).requestPresent/, 'm');
    expect(newScript).toMatch(/event\.display\.requestPresent\(\[\{ source: testRenderer.domElement /, 'm');

  })

  xit('alterCameraNearPlane changes nearplane parm to 0.1', () => {
    let newScriptText = service.alterCameraNearPlane(simpleScriptText);

    // original is commented out
    let pat1 = new RegExp(`${base.jsMarkupAlter}.*camera`);
    expect(newScriptText).toMatch(pat1, 'm');
    // expect(newScriptText).toMatch(/0\.1, 1000 \)/);
    // and new has '0.1' in the third parameter
    let pat2 = new RegExp(`camera = new THREE\.PerspectiveCamera.*0.1,`);
    expect(newScriptText).toMatch(pat2, 'm');
  })


});
