import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { log } from 'util';


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

  // return a parse lookup table, where the key represents some major portion of the 
  // program text e.g 'html', or 'mainScript' and the value is the string text for that
  // particular portion.
  parseScript(text: string) : Object {
    let parseLookup = {};

    return parseLookup;

  }

  extractMainScript(text) {
    // console.log(`ParserService.extractMainScript: text=${text}`);
    // var re : RegExp = /<script>.*</script>/gm;
    var re = new RegExp('<script.*>.*</script>', 'gm');
    // var s = text;
    var m;

    // debugger
    do {
      m = re.exec(text);
      debugger;
      if (m) {
          console.log(m[0]);
      }
  } while (m);
    

  }

}
