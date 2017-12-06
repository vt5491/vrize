import { Component, OnInit } from '@angular/core';
import { log } from 'util';
import { UtilsService } from '../../services/utils.service';
import { ParserService } from '../../services/parser.service';


@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {

  constructor(utils: UtilsService, parser: ParserService) { 
    console.log('SandboxComponent.ctor: entered');

    // let txtObs = utils.getText('../../../assets/test/abc.json');
    let txtObs = utils.getText('../../../assets/test/abc.html');

    console.log(`Sandbox.ctor: txtObs=${txtObs}`);
    
    txtObs.subscribe(
      data => {
        // debugger;
        console.log(`sb: data=${data}`);
      },   
      err => {
        // debugger;
        console.log(`sb: err=${err}`);
      },
      () => console.log('yay'),
    );

    parser.parseHtml('<abc>');
    
  }

  ngOnInit() {
    console.log('SandboxComponent.ngOnInit: entered');

  }

}
