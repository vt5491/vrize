The following is a list of scripts that could not be converted during testing for one reason or another.

1. 2018-01-18
webgl_postprocessing_advanced.html

Analysis:
This doesn't use 'camera' as the camera name.  It has two cameras: a 'cameraOrtho' and a 'cameraPerspctive'.  Thus at line 93 it gets:
'ReferenceError: camera is not defined':
```
				cameraOrtho = new THREE.OrthographicCamera( -halfWidth, halfWidth, halfHeight, -halfHeight, -10000, 10000 );
				cameraOrtho.position.z = 100;
				cameraPerspective = new THREE.PerspectiveCamera( 50, width / height, 1, 10000 );
//vrize add start
dolly.add(camera);
```

because it's trying to add 'camera' to dolly.

2) webgl_postprocessing_dof
reported: 2018-01-18

Analysis:
get message:

```
Error: WebGL warning: drawArrays: Drawing to a destination rect smaller than the viewport rect. (This warning will only be given once)
three.js:16249:4
THREE.WebGLRenderer: Can't change size while VR device is presenting.
three.js:20983:5
```

Just don't know on this one.  Maybe all 'postprocesing' examples are just not amenable to vr-ization?

3) Can't do a 'canvas' ones
e.g. canvas_particles_waves.html
Analysis:
because they use a 'CanvasRenderer'.  Even if I updated the parser to handle this case, they probably wouldn't work since webvr requires a 'WebGLRenderer' (?)

4) 'webgl_shader_lava.html'  
reported: 2018-01-18
Analysis:

It converts ok, but at runtime gets:
```
Error: WebGL warning: drawElements: Drawing to a destination rect smaller than the viewport rect. (This warning will only be given once)
```

This one also has a bunch of post-processors.  Is there something about postprocessors?  Need to investigate.

5) 'webgl_animation_scene.html'
reported: 2018-01-18
Analysis:
This one converts and display. However keyboard movement does not work.  It generates message:

```
TypeError: dolly is undefined  vrize_kbd.js:39:7  
```

This is becuase, while the dolly var is declared, it is never intialized becuase this script has no 'init()' method. The dolly var is initialized first thing after the init() method.  

Possible Soltion: 
in parser.addDolly(), if the insert after the init fails, then just insert after the 'var dolly' line.

6) webgl_clipping_advacned.html
reported: 2018-01-18
Analysis:

The call to 'renderer.shadowMap.renderSingleSided' is apparently deprecated
				renderer.shadowMap.enabled = true;
				//debugger;
				//vt-xrenderer.shadowMap.renderSingleSided = false;
				//vt-x add
				clipMaterial.shadowSide = false
				//vt-x end
				
gets message 'THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.'

7) light_physical: gets dolly problem
8)webgl_lines_colors:
get 
Error: WebGL warning: drawElements: Drawing to a destination rect smaller than the viewport rect. (This warning will only be given once)
get this one a lot