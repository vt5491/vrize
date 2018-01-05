import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

import { TransformerService } from '../../services/transformer.service';
import { ParserService } from '../../services/parser.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css']
})

export class ConvertComponent implements OnInit {
  inputDoc: Document;
  outputText: string;

  constructor(
    private transformer: TransformerService,
    private parser: ParserService) {

  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    console.log(`Convert.onSubmit: entered, f.value=${f.controls.inputText.value}`);
    // debugger;
    // this.userConvert(f.controls.inputText.value);
    this.userConvert(this.inputString);
    // let mainScriptIdx = this.parser.findMainScript(this.inputDoc);
    // f.controls.outputText.value = this.inputDoc.scripts[mainScriptIdx];
    // debugger;
    this.outputText = new XMLSerializer().serializeToString(this.inputDoc);
    console.log(`outputText=${this.outputText}`);
    // f.controls.outputText.value = this.outputText;
    // debugger;
  }
  // userConvert(e : Event) {
  userConvert(inputText : string) {
    // console.log(`Convert.userConvert: e=${e});
    // console.log(`Convert.userConvert: inputText=${inputText}`);
    // console.log(`Convert.userConvert: inputText.value=${inputText.value}`);
    // let el = document.querySelector('#inputText');
    // let inputHtml = el.innerHTML;
    let inputHtml = inputText;
    // console.log(`Convert.userConvert: inputText.value=${el.innerHTML}`);
    console.log(`Convert.userConvert: inputText.value=${inputText}`);
    //
    let domParser = new DOMParser();

    this.inputDoc = domParser.parseFromString(inputHtml, "text/html");
    // let inputDoc = domParser.parseFromString(this.inputString, "text/html");

    this.transformer.liftDoc(this.inputDoc);

    // console.log(`userConvert: output=${inputDoc.scripts[3].innerHTML}`);

  }

  // This is totally deletable. Only used for testing.
  // this is 'three.js/examples/webgl_geometry_cube.html'.  I specify it here
  // so I don't have to continuously paste it into the input form.
  inputString = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>three.js webgl - geometry - cube</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
      <style>
        body {
          margin: 0px;
          background-color: #000000;
          overflow: hidden;
        }
      </style>
    </head>
    <body>

      <script src="../build/three.js"></script>

      <script>

        var camera, scene, renderer;
        var mesh;

        init();
        animate();

        function init() {

          camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
          camera.position.z = 400;

          scene = new THREE.Scene();

          var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

          var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
          var material = new THREE.MeshBasicMaterial( { map: texture } );

          mesh = new THREE.Mesh( geometry, material );
          scene.add( mesh );

          renderer = new THREE.WebGLRenderer();
          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.setSize( window.innerWidth, window.innerHeight );
          document.body.appendChild( renderer.domElement );

          //

          window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize( window.innerWidth, window.innerHeight );

        }

        function animate() {

          requestAnimationFrame( animate );

          mesh.rotation.x += 0.005;
          mesh.rotation.y += 0.01;

          renderer.render( scene, camera );

        }

      </script>

    </body>
  </html>

  `

}
