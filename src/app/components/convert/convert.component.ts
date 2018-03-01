import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TransformerService } from '../../services/transformer.service';
import { ParserService } from '../../services/parser.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css']
})

export class ConvertComponent implements OnInit {
  inputDoc: Document;
  inputString : string;
  outputText: string;
  testFiles : string[];
  testFileLookup : {};
  fn : string;

  constructor(
    private http: HttpClient,
    private transformer: TransformerService,
    private parser: ParserService) {
      // this.testFiles = [
      // '../../assets/test/examples/unix_style/webgl_geometry_cube.html',
      // '../../assets/test/examples/unix_style/webgl_geometries.html',
      // '../../assets/test/examples/unix_style/webgl_shaders_ocean.html'
      //     ];
      this.testFiles = [
        'webgl_geometry_cube.html',
        'webgl_geometries.html',
        'webgl_shaders_ocean.html',
        'webgl_shaders_ocean2.html(x)',
        'webgl_mirror.html'
      ];

      this.testFileLookup = new Object();
      this.testFileLookup['webgl_geometry_cube.html'] = '../../assets/test/examples/unix_style/webgl_geometry_cube.html';
      this.testFileLookup['webgl_geometries.html'] = '../../assets/test/examples/unix_style/webgl_geometries.html';
      this.testFileLookup['webgl_shaders_ocean.html'] = '../../assets/test/examples/unix_style/webgl_shaders_ocean.html';
      this.testFileLookup['webgl_shaders_ocean2.html(x)'] = '../../assets/test/examples/unix_style/webgl_shaders_ocean2.html';
      this.testFileLookup['webgl_mirror.html'] = '../../assets/test/examples/unix_style/webgl_mirror.html';

      // default to the default file in the select dropdown.
      this.fn = this.testFileLookup['webgl_geometry_cube.html'];
  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    console.log(`Convert.onSubmit: entered, f.value=${f.controls.inputText.value}`);
    console.log(`f.value=${f.value}`);
    // console.log(`testFile.value=${testFile.value}`);
    // debugger;
    let inputText = f.controls.inputText.value;
    if (inputText) {
      this.userConvert(inputText);

      this.outputText = _.unescape(
        new XMLSerializer().serializeToString(this.inputDoc));
    }
    else {
      this.http.get(this.fn, {responseType: 'text'})
      .subscribe(
        data => {
          this.inputString = data;
          // console.log(`inputString=${this.inputString}`);
          this.userConvert(this.inputString);
          // this.outputText = new XMLSerializer().serializeToString(this.inputDoc);
          // Note: we have to call decodeURI to get rid of things like '&lt;' in the
          // javascript (XMLSerializer will escape all the javascript)
          // debugger;
          this.outputText = _.unescape(
          new XMLSerializer().serializeToString(this.inputDoc));
          console.log(`outputText=${this.outputText}`);
        },
        (err: HttpErrorResponse) => {
          console.log('parseHtml: err=' + err, 'httperror=' + err.error);
        },
        () => {
          //TODO: put calls for other files here and put the 'done()' call in the last of the chain
          console.log('webgl_geometries loaded');
        }
      );

    }

    // let fn = '../../assets/test/examples/unix_style/webgl_geometry_cube.html';
    // let fn = '../../assets/test/examples/unix_style/webgl_geometries.html';
    // let fn = '../../assets/test/examples/unix_style/webgl_shaders_ocean.html';

    // this.userConvert(this.inputString);
    // this.outputText = new XMLSerializer().serializeToString(this.inputDoc);
    // console.log(`outputText=${this.outputText}`);
  }

  onChange(fn) {
    console.log(`onChange: fn=${fn}`);
    this.fn = this.testFileLookup[fn];
    console.log(`this.fn=${this.fn}`);
  }

  onClick(e) {
    console.log(`onClick: e=${e}`);

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
    // console.log(`Convert.userConvert: inputText.value=${inputText}`);
    //
    let domParser = new DOMParser();

    this.inputDoc = domParser.parseFromString(inputHtml, "text/html");
    // let inputDoc = domParser.parseFromString(this.inputString, "text/html");

    this.transformer.liftDoc(this.inputDoc);

    // console.log(`userConvert: output=${inputDoc.scripts[3].innerHTML}`);

  }
}
