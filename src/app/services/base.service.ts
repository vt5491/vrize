import { Injectable } from '@angular/core';
import { log } from 'util';

@Injectable()
export class BaseService {

  public markupCommentBegin : string;
  public markupCommentEnd : string;
  public markupCommentOutBegin : string;
  public markupCommentOutEnd : string;
  public markupAlterBegin : string;
  public markupAlterEnd : string;

  constructor() { 
    this.markupCommentBegin = "//vrize start add";
    this.markupCommentEnd = "//vrize end add";

    this.markupCommentOutBegin = "//vrize start comment out";
    this.markupCommentOutEnd = "//vrize end comment out";

    this.markupAlterBegin = "//vrize start alter";
    this.markupAlterEnd = "//vrize end alter";
  }

  doSomething() {
    return 44;
  }

}
