import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { log } from 'util';
import { Node, Element } from '@angular/compiler';

import { BaseService } from './base.service';
import { UtilsService } from './utils.service';
import * as THREE from 'THREE';

@Injectable()
export class ParserService {

// if a regex is used more than once, you might want to consider making it
// a class wide property, so you use a consistent pattern throughout the code.
extractCameraDeclarationRegEx = new RegExp(/var.*camera.*;/,'m'); 
extractCameraCreationRegEx = new RegExp(/new THREE.PerspectiveCamera\([^\)]*\);/, 'm');
extractCameraCreationLineRegEx = new RegExp(/^.*new THREE.PerspectiveCamera\([^\)]*\);/, 'm');
 

  constructor(private base: BaseService, private utils: UtilsService, private http: HttpClient) { }

  // Parse the html into a dom, so we can subsquently extract things such as the main
  // script.
  parseHtml(html : string) : Document {
    // console.log(`ParserService.parseHtml: entered`);
    
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");

    return doc;

  }

  // add an html comment as the first line to indicate the date-time this 
  // conversion was performed.
  addHtmlTimeStamp(doc) {
    let htmlEl = doc.getElementsByTagName('html')[0]
    let now = (new Date()).toString();
    let timeStampComment = doc.createComment(`vrize conversion performed on ${now}`);
    // console.log(`ParserService.addHtmlTimeStamp: now=${now}`);

    htmlEl.insertBefore(timeStampComment, doc.getElementsByTagName('head')[0]);
  }

  // try to identify the "main" script of the html dom
  // return the index of the main script.  Note, this does not return the text of the
  // script itself.  If the caller wants the text of the script they will have to do
  // a doc.scripts[index].innerHTML or some such call.
  findMainScript(doc) : number {
    // debugger;
    let scriptEls = doc.getElementsByTagName('script')

    // loop through all script elements and assume the one with the biggest 
    // innerHtml is the "main" script.
    let candScriptEl = null;
    let foundCand = false;
    let maxLen = 0;

    for (let i = 0; i < scriptEls.length; i++) {
      let scriptLen = scriptEls[i].innerHTML.length;

      if (scriptLen > maxLen) {
        candScriptEl = i;
        foundCand = true;
      }
    }

    // foundCand ? return scriptEls[candScriptEl].innerHtml : return null;
    // let result = {text: null, scriptIndex: null};
    let result = null;

    if( foundCand) {
      // result.text = scriptEls[candScriptEl].innerHTML;
      // result.scriptIndex = candScriptEl;
      result = candScriptEl;
    }

    return result;
    // // console.log(`ParserService.extractMainScript: text=${text}`);
    // // var re : RegExp = /<script>.*</script>/gm;
    // var re = new RegExp('<script.*>.*</script>', 'gm');
    // // var s = text;
    // var m;

    // // debugger
    // do {
    //   m = re.exec(text);
    //   // debugger;
    //   if (m) {
    //       console.log(m[0]);
    //   }
    // } while (m);
  }

  // find the index of the three.js script (so we can concatenate webvr after it)
  findThreeJsScript(doc) {
    // debugger;
    let scriptEls = doc.getElementsByTagName('script')

    // loop through all script elements and regex on the 'src=three.js'
    let candScriptEl = null;
    let foundCand = false;

    for (let i = 0; i < scriptEls.length; i++) {
      // if( scriptEls[i].innerHTML.match(/\/three\.js/)) {
      if (scriptEls[i].getAttribute('src').match(/three\.js/) ) {
        foundCand = true;
        candScriptEl = i;
        break;
      }
    };

    let result = foundCand ? candScriptEl : null;

    return result;
  }

  // addWebVrScript(parentNode: HTMLElement) {
  //TODO: rename to addLibs
  //Defunct: replaced by addLibs
  // addWebVrScript(doc: Document, threeJsScriptIndex: number) {
  //   // add vrize_kbd.js
  //   let el = document.createElement('script');
  //   el.setAttribute('src', 'js/vrize/vrize_kbd.js');

  //   let refNode = doc.getElementsByTagName('script')[threeJsScriptIndex];
  //   this.utils.insertAfter(el, refNode);

  //   // wrap the new node in a comment bracket
  //   // this.utils.htmlCommentSandwich(doc, el);
  //   this.utils.htmlCommentPost(doc, el);

  //   // add webVr script
  //   el = document.createElement('script');
  //   el.setAttribute('src', 'js/vr/WebVR.js');
  //   this.utils.insertAfter(el, refNode);

  //   // wrap the new node in a comment bracket
  //   // this.utils.htmlCommentSandwich(doc, el);
  //   // this.utils.htmlCommentPre(doc, el);
  // }

  addLibs(doc: Document, threeJsScriptIndex: number) {
    // // add vrize_kbd.js
    // let el = document.createElement('script');
    // el.setAttribute('src', 'js/vrize/vrize_kbd.js');

    let refNode = doc.getElementsByTagName('script')[threeJsScriptIndex];
    // this.utils.insertAfter(el, refNode);

    // // wrap the new node in a comment bracket
    // // this.utils.htmlCommentSandwich(doc, el);
    // this.utils.htmlCommentPost(doc, el);

    // add webVr script
    let webVrEl = document.createElement('script');
    webVrEl.setAttribute('src', 'js/vr/WebVR.js');
    this.utils.insertAfter(webVrEl, refNode);
    this.utils.htmlCommentPre(doc, webVrEl);

    // add vrize_kbd.js
    let vrizeKbdEl = document.createElement('script');
    vrizeKbdEl.setAttribute('src', 'js/vrize/vrize_kbd.js');
    this.utils.insertAfter(vrizeKbdEl, webVrEl);

    // add vrize_controller.js
    let vrizeControllerEl = document.createElement('script');
    vrizeControllerEl.setAttribute('src', 'js/vrize/vrize_controller.js');
    this.utils.insertAfter(vrizeControllerEl, vrizeKbdEl);

    // add vrize_controller.js
    let vrControllerEl = document.createElement('script');
    vrControllerEl.setAttribute('src', 'js/vr/VRController.js');
    this.utils.insertAfter(vrControllerEl, vrizeControllerEl);

    this.utils.htmlCommentPost(doc, vrControllerEl);

    // wrap the new node in a comment bracket
    // this.utils.htmlCommentSandwich(doc, el);
    // this.utils.htmlCommentPre(doc, el);
  }

  // script parsing

  // add line 'renderer.vr.enabled = true;' after the renderer init statement in the script
  addVrRenderer(text: string) : object {
    // find the renderer init line in the script 
    // let m = text.match(/(\n)(.*new THREE\.WebGLRenderer.*)(\n)/m);
    let m = text.match(/([a-zA-z0-9_\.]+)(\s*=\s*)(new THREE\.WebGLRenderer.*)/m);
    // debugger;

    // pass the renderer variable name and get actual variable-specific insert text
    let rendererName = m[1];
    let vrRendererLine = this.getVrRendererTemplate(rendererName);
    let insertText = this.utils.jsCommentSandwich(vrRendererLine);

    //TODO: double escape special vars in string
    // actually..don't need to do because it's in the replace string
    let newText = text.replace(/.*new THREE\.WebGLRenderer.*/m, 
      `$&\n${insertText}\n`);
    // debugger;
    
    // return newText;
    return {newText: newText, rendererName: rendererName};

  }

  // Return the string to be inserted by 'addVrRenderer'.  If a renderer name is passed, this
  // will be substituted in the template.  If no string is passed, then the paramaterized string
  // will passed raw, such that the client can substitute a value.
  getVrRendererTemplate(renderer? : string) : string {
    // return '&renderer.vr.enabled = true;';
    let templateStr = '{{renderer}}.vr.enabled = true;';

    if (renderer) {
      templateStr = templateStr.replace(/{{renderer}}/, renderer);
    }

    return templateStr;
  }

  addVrButton(text: string, rendererName: string) {
    // extract the dom element we need to append to
    // let re = new RegExp(`([a-zA-z0-9_\.]+)\.appendChild\(\s*${rendererName}\.domElement\s*\)`, 'm');
    let re = new RegExp(`([a-zA-z0-9_\.]+)\\.appendChild\\(\\s*${rendererName}\\.domElement\\s*\\)`, 'm');
    // let re = new RegExp('([a-zA-z0-9_\.]+)\.appendChild\(\s*' + rendererName + '\.domElement\s*\)', 'm');
    // let re = new RegExp('([a-zA-z0-9_\.]+)\.appendChild\(\s*' + rendererName + '\.domElement\s*\)', 'm');
    // let reStr = '([a-zA-z0-9_\.]+)\.appendChild\(\s*' + rendererName + '\.domElement\s*\)';
    // let reStr = 'appendChild(' + rendererName + ')';
    // let re = new RegExp( reStr, 'm');

    let m = text.match(re);
    let elName = m[1];
    // let m = text.match(/([a-zA-z0-9_\.]+)(\s*=\s*)(new THREE\.WebGLRenderer.*)/m);
    // let newText = text.replace(/.*new THREE\.WebGLRenderer.*/m, `$&\n${insertText}\n`);
    // pass the append element name and get actual variable-specific insert text
    let vrButtonLine = this.getVrButtonTemplate(elName, rendererName);
    let insertText = this.utils.jsCommentSandwich(vrButtonLine);

    // let newText = text.replace(/.*new THREE\.WebGLRenderer.*/m, `$&\n${insertText}\n`);
    // let re2 = new RegExp(`${elName}\.appendChild\(\s*${rendererName}\.domELement\s*\)`);
    let re2 = new RegExp(`${elName}\\.appendChild\\(\\s*${rendererName}\\.domElement\\s*\\)`, 'm');
    // let newText = text.replace(re2, 
    //   `$&\n${elName}\.appendChild\(WEBVR.createButton\(${rendererName}\)\);\n`);
    let newText = text.replace(re2, `$&\n${insertText}\n`);

    // debugger;

    return newText;

  }
  
  getVrButtonTemplate(appendEl : string ,renderer : string) : string {
    // let templateStr = '{{appendEl}}.appendChild\(WEBVR.createButton\({{renderer}}\)\);';
    // let templateStr = '{{appendEl}}.appendChild\\(WEBVR.createButton\\({{renderer}}\\)\\);';
    let templateStr = '{{appendEl}}.appendChild(WEBVR.createButton({{renderer}}));';

    // if (renderer) {
    templateStr = templateStr.replace(/{{appendEl}}/, appendEl);
    templateStr = templateStr.replace(/{{renderer}}/, renderer);
    // }

    return templateStr;
  }

  //
  // This does several things.  It:
  // 1. adds a new "animate" function
  // 2. renames the original "animate" function to 'vrize_render'
  // 3. add statement 'THREE.VRController.update();' to the 'vrize_render' fn.
  addVrAnimateFn(text: string) : string {
    let newText = '';

    let vrizeRenderName = `${this.base.appTag}_render`;
    // rename any prior 'animate' fn to 'render'
    newText = text.replace(/(function\s+)(animate)(\s*)(\(.*\))(\s*)(\{)/m, 
      // `${this.base.jsMarkupAlterBegin}\n$1render$2\n${this.base.jsMarkupAlterEnd}`);
      `${this.base.jsMarkupAlterBegin}\n//$1$2$3$4$5$6` + 
      `\n$1${vrizeRenderName}$4$5$6\n${this.base.jsMarkupAlterEnd}`);
    // debugger;

    // insert the the vr animate fn
    let insertText = this.getVrAnimateFnTemplate();
    insertText = this.utils.jsCommentSandwich(insertText);

    newText = newText + insertText + "\n";

    //comment out any 'requestAnimationFrame'
    newText = newText.replace(/[^\n]*requestAnimationFrame[^\n]*/m, 
      `${this.base.jsMarkupCommentOutBegin}\n//$&\n${this.base.jsMarkupCommentOutEnd}`);
    // debugger;
    // newText = newText.replace(/(\n)(^\s*requestAnimationFrame)/m, `//$1`);
    // add VRController.update
    let vrControllerRe = 
      new RegExp(`function ${vrizeRenderName}[\\s\\S]+${this.base.jsMarkupCommentOutEnd}`, 'm');

    let controllerUpdateText = this.utils.jsCommentSandwich('THREE.VRController.update();');
    newText = newText.replace(vrControllerRe, `$&\n${controllerUpdateText}`);
    

    return newText;
  }

  getVrAnimateFnTemplate() : string {
    let vrizeRenderName = `${this.base.appTag}_render`;
    // let vrizeRenderName = `render`;
    return `
function animate() {
  renderer.animate(${vrizeRenderName});
};
`

  }

  // return a parse lookup table, where the key represents some major portion of the 
  // program text e.g 'html', or 'mainScript' and the value is the string text for that
  // particular portion.
  parseScript(text: string) : Object {
    let parseLookup = {};

    return parseLookup;

  }

  // Attempt to find the position the script sets the camera to.  We need
  // this so we can properly set the dolly's position later.
  extractInitCameraPos(scriptText) : THREE.Vector3 {
    let extractedPos = new THREE.Vector3();
    let reMatch = []

    // camera.position.set( 30, 30, 100 );
    // if( scriptText.match(//)) {
    if (reMatch = scriptText.match(/camera\.position\.set\(\s*(\d+)[,|\s]+(\d+)[,|\s]+(\d+)\s*\)/m) ) {
    // if (reMatch == []) {
      // console.log(`position.set detected,re1=${reMatch[1]}`);
      extractedPos.x = parseInt(reMatch[1]);
      extractedPos.y = parseInt(reMatch[2]);
      extractedPos.z = parseInt(reMatch[3]);
    }
    else {
      // console.log(`position.x detected`);

    // look for 'camera.position.n' statements.
    // Note: we don't specify 'g' (global search), so that the bracketing
    // will work.  Unfortunately, this means we pull the first match.  Presumably
    // if multiple dimensions are set, they won't be using this syntax.
    let re= new RegExp(/camera\.position\.([xyz])\s*=\s*(\d+)/, 'm')

    reMatch = scriptText.match(re);
    // debugger;

    if (reMatch && reMatch[1] && reMatch[2]) {
      let numericPos = parseInt(reMatch[2]);

      switch(reMatch[1]) {
        case 'x':
          extractedPos.x = numericPos;
          break;
        case 'y':
          extractedPos.y = numericPos;
          break;
        case 'z':
          extractedPos.z = numericPos;
          break;
      }
    }
    }

    return extractedPos;
  }

  // add a 'var dolly;' statement
  addDollyVar(scriptText: string) : string {
    // look for the 'var=camera' line and add it after that
    let newText : string;

    // let insertRe = new RegExp(/var.*camera.*;/,'m');
    // let insertRe = this.extractCameraDeclarationRegEx();
    let insertRe = this.extractCameraDeclarationRegEx;

    let insertText = 'var dolly;';
    insertText = this.utils.jsCommentSandwich(insertText);

    newText = scriptText.replace(insertRe, `$&\n${insertText}\n`);

    return newText;
  }

  // add the dolly definition at top of init method, since it has no dependencies.
  addDolly(scriptText: string) : string {
    let newText : string;

    // new THREE.Scene();
    // find the creation of the 'scene' object.  After this is where we will
    // add in the dolly stub.  A case can be made for doing at the end of the
    // init method, since we need to be sure camera and scene are defined, but
    // for now just assume after the scene object creation will work.
    // let insertRe = new RegExp(/new THREE.Scene\(\);/, 'm');
    let insertRe = new RegExp(/function init\([^\)]*\)\s*\{/, 'm');

    let extractedPos = this.extractInitCameraPos(scriptText);

    let insertText = '';
    // let insertText = "dolly.position.set(0, 0, 400);"
    insertText += "dolly = new THREE.Object3D();\n";
    if (extractedPos) {
      insertText += `dolly.position.set(${extractedPos.x}, ${extractedPos.y}, ${extractedPos.z});`;
    }
    // insertText += "scene.add(dolly);\n";
    // insertText += "dolly.add(camera);\n";

    insertText = this.utils.jsCommentSandwich(insertText);

    newText = scriptText.replace(insertRe, `$&\n${insertText}\n`);

    return newText;
  }

  // add the dolly to the scene after scene has been defined.
  addDollyToScene(scriptText: string) : string {
    let newText : string;

    let insertRe = new RegExp(/new THREE.Scene\(\);/, 'm');

    // let insertText = "dolly.add(camera);\n";
    let insertText = "scene.add(dolly);";
    insertText = this.utils.jsCommentSandwich(insertText);

    newText = scriptText.replace(insertRe, `$&\n${insertText}\n`);

    return newText;
  };

  // we need to add the camera to the dolly after the camera has been initialized
  // so we have to separate out from the dolly defintion (method 'addDolly')
  addCameraToDolly(scriptText: string) : string {
    let newText : string;

    // let insertRe = new RegExp(/new THREE.PerspectiveCamera\([^\)]*\);/, 'm');
    // let insertRe = this.extractCameraCreationRegEx();
    let insertRe = this.extractCameraCreationRegEx;

    let insertText = "dolly.add(camera);";
    insertText = this.utils.jsCommentSandwich(insertText);

    newText = scriptText.replace(insertRe, `$&\n${insertText}\n`);

    return newText;
  }

  // VR Controllers are very sensitive to the camera near plane. A lot of
  // scripts with "1 unit= 1cm" rules with a near-plane of 1, cause the VR
  // controllers to disappear when close to the camera, since VRController
  // uses "1 unit= 1m" rules.
  alterCameraNearPlane(scriptText: string) : string {
    // camera = new THREE.PerspectiveCamera
    // ( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    // debugger;
    let cameraCreationRe = this.extractCameraCreationLineRegEx;

    // let cameraCreationText = scriptText.match(cameraCreationRe)[0]; 
    let match = scriptText.match(cameraCreationRe); 
    let cameraCreationText;
    if (match && match[0]) {
      cameraCreationText = match[0];
    }
    else {
      // no camera statment found, so just return with original text
      return scriptText;
    }
    console.log(`alterCameraNearPlane: cameraCreationText=${cameraCreationText}`);

    let newText, newScriptText;

    if (cameraCreationText) {
      // newText = cameraCreationText.replace(/([\d]+)([\s]*,[\s\d]+)$/, "0.1,$2");
      // let match = cameraCreationText.match(/([\d]+)([\s]*,[\s\d]+)$/);
      // let match = /([\d]+)([\s]*,[\s\d]+)$/.exec(cameraCreationText);
      // console.log(`$1=${match[1]}, $2=${match[2]}`);
      newText = cameraCreationText.replace(/(.*)([\d]+)([\s]*,[\s\d]+\);)$/, "$1" + "0.1" + "$3");

      // now put the new string into the scriptText after original statement
      if (newText) {
        newScriptText = scriptText.replace(cameraCreationRe, 
          `${this.base.jsMarkupAlter}$&\n${newText}`);
      }
      
    }

    // console.log(`alterCameraNearPlane: newText=${newText}`);
    // console.log(`alterCameraNearPlane: newScriptText=${newScriptText}`);

    return newScriptText;

  }

  addVrDisplayActivate(scriptText: string, rendererName: string) : string {
    let newText : string;

    console.log(`Parser.addVrDisplayActivate:`);
    // debugger;
    
    newText = this.getVrDisplayActivateTemplate(rendererName);

    newText = this.utils.jsCommentSandwich(newText);

    // let re = new RegExp(`${elName}\\.appendChild\\(\\s*${rendererName}\\.domElement\\s*\\)`, 'm');
    // newText = text.replace(re2, `$&\n${insertText}\n`);

    // simply put it at the end of the script
    return scriptText + newText;
  }

  getVrDisplayActivateTemplate(renderer: string) : string {
    let template = `
    window.addEventListener('vrdisplayactivate', function (event) {
      event.display.requestPresent([{ source: ${renderer}.domElement }]);
    });
    `

    return template;
  }


  // Parser specific help methods go here.  
  // These could be put in utils, but since they're really only specific to the
  // the parser service (i.e. they're not "general"), we place inside the
  // parser service instead.

  // We abstract out several regexes because some of these may be used in
  // multiple places, and we want to use a consistent pattern in each case.
  // extractCameraDeclarationRegEx(scriptText: string) : RegExp {
  // extractCameraDeclarationRegEx() : RegExp {
  //   return new RegExp(/var.*camera.*;/,'m');
  // }

  // // extractCameraCreationRegEx(scriptText: string) : RegExp {
  // extractCameraCreationRegEx() : RegExp {
  //   return new RegExp(/new THREE.PerspectiveCamera\([^\)]*\);/, 'm');
  // }

  // end parser helper methods.

}
