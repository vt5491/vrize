import { Injectable } from '@angular/core';
import { log } from 'util';

@Injectable()
export class BaseService {

  public jsMarkupCommentBegin : string;
  public jsMarkupCommentEnd : string;
  public jsMarkupCommentOutBegin : string;
  public jsMarkupCommentOutEnd : string;
  public jsMarkupAlterBegin : string;
  public jsMarkupAlterEnd : string;

  public htmlMarkupCommentBegin : string;
  public htmlMarkupCommentEnd : string;

  constructor() { 
    this.jsMarkupCommentBegin = "//vrize add start";
    this.jsMarkupCommentEnd = "//vrize add end";

    this.jsMarkupCommentOutBegin = "//vrize comment out start";
    this.jsMarkupCommentOutEnd = "//vrize comment out end";

    this.jsMarkupAlterBegin = "//vrize alter start";
    this.jsMarkupAlterEnd = "//vrize alter end";

    // note: the '<!--' and '-->' that normally bracket html comments are
    // added in the function itself via 'document.createComment'
    this.htmlMarkupCommentBegin = "vrize add start";
    this.htmlMarkupCommentEnd = "vrize add end";
  }

  doSomething() {
    return 44;
  }

}
