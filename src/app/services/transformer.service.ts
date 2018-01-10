import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { UtilsService } from './utils.service';
import { ParserService } from './parser.service';

@Injectable()
export class TransformerService {

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
    let mainScriptIndex = this.parser.findMainScript(doc);
    let scriptText = doc.scripts[mainScriptIndex].innerHTML;

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

    doc.scripts[mainScriptIndex].innerHTML = newText;
    return doc;
  }

  // transform the lib section of the doc (.e.g. scripts tags) that are needed for the vr lift.
  // liftLibs(doc) : Document {
  liftLibs(doc) : number {
    let threeJsIndex = this.parser.findThreeJsScript(doc);

    this.parser.addWebVrScript(doc, threeJsIndex);

    return threeJsIndex;
  }

}
