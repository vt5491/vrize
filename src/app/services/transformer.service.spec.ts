import { TestBed, inject } from '@angular/core/testing';
import { identifierModuleUrl } from '@angular/compiler';

import { TransformerService } from './transformer.service';
import { ParserService } from './parser.service';
import { BaseService } from './base.service';
import { UtilsService } from './utils.service';
// import { HttpClient } from '@angular/common/http/src/client';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


let service : TransformerService;
let basicHtml =
`<html>
  <head>
    <script src="../../build/three.js"></script>
    <script>
        var a=7;
        init();
        animate();
        function init() {
          renderer = new THREE.WebGLRenderer();
          document.body.appendChild( renderer.domElement );
        }
    </script>
  </head>
  <body>
  </body>
</html>
  `

// This represents the raw result returned for parsing processing
let basicPostParseText =
`<html>
  <head>
    <script src="../build/three.js"></script><!--vrize add start--><script src="js/vr/WebVR.js"></script><!--vrize add end--><!--vrize add start--><script src="js/vrize/vrize_kbd.js"></script><!--vrize add end-->
    <script>
        var a=7;
        init();
        animate();
        function init() {
          renderer = new THREE.WebGLRenderer();
//vrize add start
renderer.vr.enabled = true;
//vrize add end
          document.body.appendChild( renderer.domElement );
        }
    </script>
  </head>
  <body>
  </body>
</html>
`
// let parser = new DOMParser();
let base : BaseService;
let utils : UtilsService;
let domParser = new DOMParser();
let basicDoc : Document;
let basicPostParseDoc : Document;
// let base = TestBed.get(BaseService);

describe('TransformerService', () => {

  // beforeAll(() => {
  //   TestBed.configureTestingModule({
  //     imports: [HttpClientModule],
  //     providers: [BaseService, UtilsService]
  //   });
  //   base = TestBed.get(BaseService);
  //   utils = TestBed.get(UtilsService);
  // })

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TransformerService, ParserService, BaseService, UtilsService, HttpClient]
    });
    service = TestBed.get(TransformerService);
    base = TestBed.get(BaseService);
    utils = TestBed.get(UtilsService);
    basicDoc = domParser.parseFromString(basicHtml, "text/html");
    basicPostParseDoc = domParser.parseFromString(basicPostParseText, "text/html");
  });

  it('should be created', inject([TransformerService], (service: TransformerService) => {
    expect(service).toBeTruthy();
  }));

  // Note: here we do not test all the invidual transforms that the pipeline should do,
  // as we rely on the unit test for each 'pipe-step' for that.  If we were to also test
  // the result here, if we ever changed a transormation, then we would have to update
  // places (here and in parer.html) to keep everything in sync.  We basically just
  // want to verify that pipelines runs here.
  it ('liftDoc properly transforms', () => {
    let result : Document= service.liftDoc(basicDoc);

    // debugger;
    expect(result.nodeName).toMatch('#document');
  })

  it ('beautifyJsLibChainHtml produces one lib per line', () => {
    // expect(7).toEqual(7);
    // implicitly modifies the passed doc object
    let resultText = service.beautifyJsLibChainHtml(basicPostParseText);

    // make sure the text has a lib per line e.g not all placed on one line
    // console.log(`ut.addWebVrScript: doc.innerHTML=${doc.documentElement.innerHTML}`);
    // console.log(`ut.addWebVrScript: doc.outerHTML=${doc.documentElement.innerHTML}`);
    // let resultText = doc.documentElement.innerHTML;
    //
    // console.log(`basicPostParseText=${basicPostParseText}`);
    console.log(`resultText=${resultText}`);
    let pat = `three\\.js.*</script\>\\n.*<!--${base.htmlMarkupCommentBegin}`;
    // // expect(resultText).toMatch(/three\.js.*\</script\>\n.*<--!${})
    expect(resultText).toMatch(new RegExp(pat, 'm'));
  })

  it ('beautifyJsLibChainHtml produces one lib per line', () => {
    // Since this is not an integration test, and the mainScriptIndex is set by
    // the parser service, we have to manually set this variable ourseleves, with
    // unfortunate side effect that we couple this test to 'basicPostParseDoc' as it's
    // currently written.
    service.mainScriptIndex = 3;

    let resultDoc = service.beautifyMainScript(basicPostParseDoc);
    // console.log(`newText=${resultDoc.querySelectorAll('script')[service.mainScriptIndex].innerHTML}`);

    // expect to see a js comment with some whitespace before 'renderer.vr.enabled=true'
    let pat = `^[\\s]{2,}${base.jsMarkupCommentBegin}.*\n[\\s]*renderer.vr.enabled`;
    let re = new RegExp(pat, 'm');
    expect(utils.docToString(resultDoc)).toMatch(re);
  })
});
