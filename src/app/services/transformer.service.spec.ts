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

let domParser = new DOMParser();

let basicDoc : Document;

describe('TransformerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TransformerService, ParserService, BaseService, UtilsService, HttpClient]
    });
    service = TestBed.get(TransformerService);
    basicDoc = domParser.parseFromString(basicHtml, "text/html");
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
});
