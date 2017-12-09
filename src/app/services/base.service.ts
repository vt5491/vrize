import { Injectable } from '@angular/core';
import { log } from 'util';

@Injectable()
export class BaseService {

  public markupCommentBegin : string;
  public markupCommentEnd : string;

  constructor() { 
    this.markupCommentBegin = "// vrize add";
    this.markupCommentEnd = "// vrize end";
    
    
  }

  doSomething() {
    return 44;
  }

}
