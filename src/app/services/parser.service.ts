import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { log } from 'util';
import { Node, Element } from '@angular/compiler';

import { BaseService } from './base.service';
import { UtilsService } from './utils.service';


@Injectable()
export class ParserService {

  constructor(private base: BaseService, private utils: UtilsService, private http: HttpClient) { }

  // Parse the html into a dom, so we can subsquently extract things such as the main
  // script.
  parseHtml(html : string) : Document {
    console.log(`ParserService.parseHtml: entered`);
    
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");

    return doc;

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
  addWebVrScript(doc: Document, threeJsScriptIndex: number) {
    let el = document.createElement('script');
    el.setAttribute('src', 'js/vr/WebVR.js');

    // parentNode.appendChild(el);
    // doc.getElementsByTagName('script')[threeJsScriptIndex].appendChild(el);
    // doc.getElementsByTagName('script')[threeJsScriptIndex].appendChild(el);
    // debugger;
    let refNode = doc.getElementsByTagName('script')[threeJsScriptIndex];
    // refNode.parentNode.insertBefore(el, refNode.nextSibling);
    // this.utils.insertBefore(el, refNode);
    this.utils.insertAfter(el, refNode);

    // wrap the new node in a comment bracket
    // this.utils.htmlCommentSandwich(doc, refNode);
    this.utils.htmlCommentSandwich(doc, el);
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
  addVrAnimateFn(text: string) : string {
    let newText = '';
    // rename any prior 'animate' fn to 'render'
    newText = text.replace(/(function\s+)(animate)(\s*)(\(.*\))(\s*)(\{)/m, 
      // `${this.base.jsMarkupAlterBegin}\n$1render$2\n${this.base.jsMarkupAlterEnd}`);
      `${this.base.jsMarkupAlterBegin}\n//$1$2$3$4$5$6` + 
      `\n$1render$4$5$6\n${this.base.jsMarkupAlterEnd}`);
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

    return newText;
  }

  getVrAnimateFnTemplate() : string {
    return `
function animate() {
  renderer.animate(render);
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

}
