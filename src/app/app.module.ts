import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { BaseService } from './services/base.service';
import { UtilsService } from './services/utils.service';
import { ParserService } from './services/parser.service';

const appRoutes:Routes = [
  {path: '', component: SandboxComponent},
  {path: 'sandbox', component: SandboxComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    UtilsService,
    BaseService,
    ParserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
