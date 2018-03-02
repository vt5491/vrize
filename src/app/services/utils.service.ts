import { Injectable } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { log } from 'util';
import { Subscription } from 'rxjs/Subscription';

import { BaseService } from './base.service';

@Injectable()
export class UtilsService {

  constructor(private base: BaseService, private http: HttpClient) { }

  // return the (program) text contained in the specified file.
  getText(fn : string): Observable<any> {
  // getText(fn : string): Subscription {
    // console.log(`Utils.getText: fn=${fn}`);
    
    // return this.http.get(fn)
    //                 .catch((error: any) => console.log(error)); 
    // this.http.get('https://api.github.com/users/seeschweiler')
    return this.http.get(fn, {responseType: 'text'})
            //  .subscribe(data => {
            //    console.log('now in subscribe handler');
            //    console.log(data);
            //  });
  }

  jsCommentSandwich(text : string) : string {
    let beginTag = this.base.jsMarkupCommentBegin;
    let endTag = this.base.jsMarkupCommentEnd;

    return `${beginTag}\n${text}\n${endTag}`;
  }

  jsCommentOutSandwich(text : string) : string {
    let beginTag = this.base.jsMarkupCommentOutBegin;
    let endTag = this.base.jsMarkupCommentOutEnd;

    return `${beginTag}\n//${text}\n${endTag}`;
  }

  alterSandwich(text : string) : string {
    let beginTag = this.base.jsMarkupAlterBegin;
    let endTag = this.base.jsMarkupAlterEnd;

    return `${beginTag}\n${text}\n${endTag}`;
  }

  // alterLine(text: string) : string {

  // }

  // Insert the pre comment before the refNode
  // CommentPre and CommentPost are like the top and bottom of a 
  // comment sandwich, respectively.
  htmlCommentPre(doc: Document, refNode: Node) {
    let beginTag = this.base.htmlMarkupCommentBegin;
    let beginNode = doc.createComment(beginTag);
    this.insertBefore(beginNode, refNode); 
  }

  htmlCommentPost(doc: Document, refNode: Node) {
    let endTag = this.base.htmlMarkupCommentEnd;
    let endNode = doc.createComment(endTag);
    this.insertAfter(endNode, refNode); 
  }

  // alter the doc directly
  htmlCommentSandwich(doc : Document, refNode: Node) {
    let beginTag = this.base.htmlMarkupCommentBegin;
    let endTag = this.base.htmlMarkupCommentEnd;

    let beginNode = doc.createComment(beginTag);
    // beginNode.innerHML
    // debugger;
    let endNode = doc.createComment(endTag);

    // return `${beginTag}\n${text}\n${endTag}`;
    // this.insertBefore(doc.createElement("br"), refNode);
    this.insertBefore(beginNode, refNode); 
    this.insertAfter(endNode, refNode); 
  }

  // escape special chars with a '\', which is necessary with regexes in some cases.
  escapeText(text) : string { 
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  docToString(doc: Document) : string {
    return new XMLSerializer().serializeToString(doc);
  }

  // }
  // public getJSON(): Observable<any> {
  //   return this.http.get("./file.json")
  //                   .map((res:any) => res.json())
  //                   .catch((error:any) => console.log(error));

  // }
  insertBefore(newNode, refNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
  }

  insertAfter(newNode, refNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    // refNode.parentNode.insertAfter(newNode, refNode);
  }


}
