import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { BaseService } from './services/base.service';
import { UtilsService } from './services/utils.service';
import { ParserService } from './services/parser.service';
import { TransformerService } from './services/transformer.service';
import { ConvertComponent } from './components/convert/convert.component';

const appRoutes:Routes = [
  {path: '', component: ConvertComponent},
  {path: 'sandbox', component: SandboxComponent},
  {path: 'convert', component: ConvertComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent,
    ConvertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    UtilsService,
    BaseService,
    ParserService,
    TransformerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
