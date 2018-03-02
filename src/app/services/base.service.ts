import { Injectable } from '@angular/core';
import { log } from 'util';

@Injectable()
export class BaseService {

  public appTag : string;

  public jsMarkupCommentBegin : string;
  public jsMarkupCommentEnd : string;
  public jsMarkupCommentOutBegin : string;
  public jsMarkupCommentOutEnd : string;
  public jsMarkupAlterBegin : string;
  public jsMarkupAlterEnd : string;
  public jsMarkupAlter : string;

  public htmlMarkupCommentBegin : string;
  public htmlMarkupCommentEnd : string;
  public htmlMarkupComment : string;

  constructor() { 
    this.appTag = `vrize`;
    this.jsMarkupCommentBegin = `//${this.appTag} add start`;
    this.jsMarkupCommentEnd = `//${this.appTag} add end`;

    this.jsMarkupCommentOutBegin = `//${this.appTag} comment out start`;
    this.jsMarkupCommentOutEnd = `//${this.appTag} comment out end`;

    this.jsMarkupAlterBegin = `//${this.appTag} alter start`;
    this.jsMarkupAlterEnd = `//${this.appTag} alter end`;
    // single line comment out, with the following line the implied replacement.
    this.jsMarkupAlter = `//${this.appTag} alter`;

    // note: the '<!--' and '-->' that normally bracket html comments are
    // added in the function itself via 'document.createComment'
    this.htmlMarkupCommentBegin = `${this.appTag} add start`;
    this.htmlMarkupCommentEnd = `${this.appTag} add end`;
  }

  doSomething() {
    return 44;
  }

}
