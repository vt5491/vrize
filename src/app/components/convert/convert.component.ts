import { Component, OnInit } from '@angular/core';

import { TransformerService } from '../../services/transformer.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css']
})
export class ConvertComponent implements OnInit {

  constructor(private transformer: TransformerService) { }

  ngOnInit() {
  }

  userConvert(e : Event) {
  // userConvert(inputText : string) {
    // console.log(`Convert.userConvert: e=${e});
    // console.log(`Convert.userConvert: inputText=${inputText}`);
    // console.log(`Convert.userConvert: inputText.value=${inputText.value}`);
    // let el = document.querySelector('#inputText');
    // let inputHtml = el.innerHTML;
    // console.log(`Convert.userConvert: inputText.value=${el.innerHTML}`);
    //
    let domParser = new DOMParser();

    // let inputDoc = domParser.parseFromString(inputHtml, "text/html");
    let inputDoc = domParser.parseFromString(this.inputString, "text/html");

    this.transformer.liftDoc(inputDoc);

    console.log(`userConvert: output=${inputDoc.scripts[3].innerHTML}`);

  }

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