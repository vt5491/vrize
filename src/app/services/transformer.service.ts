import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { UtilsService } from './utils.service';
import { ParserService } from './parser.service';

@Injectable()
export class TransformerService {

  constructor(private parser: ParserService) { }

  // pipeline to transform (vr-ize) a plain three.js script into a vr-compatible script.
  liftDoc (doc: Document) : Document {
    // debugger;
    let threeJsIndex = this.liftLibs(doc);
    this.parser.addWebVrScript(doc, threeJsIndex);

    // script level processing
    let mainScriptIndex = this.parser.findMainScript(doc);
    let scriptText = doc.scripts[mainScriptIndex].innerHTML;

    let result : any = this.parser.addVrRenderer(scriptText);

    let newText = result.newText;
    let rendererName = result.rendererName;

    newText = this.parser.addVrButton(newText, rendererName);
    newText = this.parser.addVrAnimateFn(newText);

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
