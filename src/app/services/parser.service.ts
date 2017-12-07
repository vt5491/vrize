import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { log } from 'util';
import { Node, Element } from '@angular/compiler';


@Injectable()
export class ParserService {

  constructor(private http: HttpClient) { }

  // Parse the html into a dom, so we can subsquently extract things such as the main
  // script.
  parseHtml(html : string) : Document {
    console.log(`ParserService.parseHtml: entered`);
    
    // let fn = './parser.service.ts';
    // let fn = '../../assets/test/examples/webvr_cubes.html';
    // this.http.get(fn, {responseType: 'text'})
    // .subscribe(
    //   data => console.log(data),
    //   err => console.log('parseHtml: err=' + err),
    //   () => console.log('yay')
    // );

    // return this.http.get(fn, {responseType: 'text'});
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "application/xml");

    return doc;

  }


  // try to identify the "main" script of the html dom
  extractMainScript(doc) {
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
    let result = {text: null, scriptIndex: null};

    if( foundCand) {
      result.text = scriptEls[candScriptEl].innerHTML;
      result.scriptIndex = candScriptEl;
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

  appendWebVrScript(parentNode: HTMLElement) {
    let el = document.createElement('script')

    parentNode.appendChild(el);
  }
  
  // return a parse lookup table, where the key represents some major portion of the 
  // program text e.g 'html', or 'mainScript' and the value is the string text for that
  // particular portion.
  parseScript(text: string) : Object {
    let parseLookup = {};

    return parseLookup;

  }

}
