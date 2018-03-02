// The transformer is for end to end processing, as well as doing post-processing
// on the inputDoc returned by the parser.  The parser is more for the internal
// structure of the document.  So, we do post-parsing cleanup here, and not 
// in 'parser.service.ts'
// The transformer can also be a little presumptive about the structures it's
// dealing with, since it mostly created by this app.  It therefore, doesn't
// have to be as "general" as the parser service.

import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { UtilsService } from './utils.service';
import { ParserService } from './parser.service';
import * as beautify from 'js-beautify';

@Injectable()
export class TransformerService {
  mainScriptIndex : number;

  constructor(private parser: ParserService) { }

  // full pipeline to transform (vr-ize) a plain three.js script into a vr-compatible script.
  // We transform html using a doc, but generally use text to manipulate script
  // text.
  liftDoc (doc: Document) : Document {
    // debugger;
    // add a timestamp
    this.parser.addHtmlTimeStamp(doc);

    let threeJsIndex = this.liftLibs(doc);
    // this.parser.addWebVrScript(doc, threeJsIndex);

    // script level processing
    // let mainScriptIndex = this.parser.findMainScript(doc);
    this.mainScriptIndex = this.parser.findMainScript(doc);
    let scriptText = doc.scripts[this.mainScriptIndex].innerHTML;

    let result : any = this.parser.addVrRenderer(scriptText);

    let newText = result.newText;
    let rendererName = result.rendererName;

    newText = this.parser.addVrButton(newText, rendererName);
    newText = this.parser.addVrAnimateFn(newText);

    // add dolly support
    newText = this.parser.addDollyVar(newText);
    newText = this.parser.addDolly(newText);
    newText = this.parser.addDollyToScene(newText);
    newText = this.parser.addCameraToDolly(newText);
    newText = this.parser.alterCameraNearPlane(newText);

    // add the 'vrdisplayactivate' handler (so vr-mode is transitive)
    // Note: this is only needed if you don't have a customized 'examples/js/vr/WebVR.js'.
    // A customized webvr button function will do this automatically for us.
    // cf https://github.com/mrdoob/three.js/issues/13105
    // newText = this.parser.addVrDisplayActivate(newText, rendererName);

    doc.scripts[this.mainScriptIndex].innerHTML = newText;
    return doc;
  }

  // transform the lib section of the doc (.e.g. scripts tags) that are needed for the vr lift.
  // liftLibs(doc) : Document {
  liftLibs(doc) : number {
    let threeJsIndex = this.parser.findThreeJsScript(doc);

    // this.parser.addWebVrScript(doc, threeJsIndex);
    this.parser.addLibs(doc, threeJsIndex);

    return threeJsIndex;
  }

  // Post-parser cleanup routines.  The parser is for getting into structure of the doc.

  // cleanup the js <script> libs that are added after the main 'three.js' lib.
  // e.g make it so they're not all on one line.
  // We have to deal with this at the string level (text level) since I don't
  // know how to control formatting at the doc level.
  // Note: string is pass by value, so we get a copy of the text and we can manipulate
  // without altering the original.
  // <script src="../build/three.js"></script><!--vrize add start--><script src="js/vr/WebVR.js"></script><!--vrize add end--><!--vrize add start--><script src="js/vrize/vrize_kbd.js"></script><!--vrize add end-->
  beautifyJsLibChainHtml(text : string) {
    // let newText = text;

    // return newText;
    // text += "hello";
    // identify the "<script src=..three.js>" line.  This will be the long line
    // that has all the concatenated libs
    let regex = /<script\s+src=['"].*three\.js.*/
    let threeJsLibMatch = text.match(regex)

    // if found, pass to beautify
    if (threeJsLibMatch && threeJsLibMatch[0]) {
      let newText = beautify.html(threeJsLibMatch[0]);

      // and then sub it back in
      text = text.replace(regex, newText);
    }

    return text;

  }

  // use beautify to clean up the main script.  We can use the doc objecct
  // for this.
  beautifyMainScript(doc : Document) {
    // console.log(`beautifyMainScript: mainScriptInex=${this.mainScriptIndex}`);

    let mainScriptText = doc.querySelectorAll('script')[this.mainScriptIndex].innerHTML;

    // console.log(`beautifyMainScript: mainsScriptText=${mainScriptText}`);

    let newText = beautify.js(mainScriptText);
    // console.log(`beautifyMainScript: newText=${newText}`);

    doc.querySelectorAll('script')[this.mainScriptIndex].innerHTML = newText;

    return doc;

  }

}
