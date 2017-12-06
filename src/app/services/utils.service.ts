import { Injectable } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { log } from 'util';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UtilsService {

  constructor(private http: HttpClient) { }

  // return the (program) text contained in the specified file.
  getText(fn : string): Observable<any> {
  // getText(fn : string): Subscription {
    console.log(`Utils.getText: fn=${fn}`);
    
    // return this.http.get(fn)
    //                 .catch((error: any) => console.log(error)); 
    // this.http.get('https://api.github.com/users/seeschweiler')
    return this.http.get(fn, {responseType: 'text'})
            //  .subscribe(data => {
            //    console.log('now in subscribe handler');
            //    console.log(data);
            //  });
  }

  // }
  // public getJSON(): Observable<any> {
  //   return this.http.get("./file.json")
  //                   .map((res:any) => res.json())
  //                   .catch((error:any) => console.log(error));

  // }

}
