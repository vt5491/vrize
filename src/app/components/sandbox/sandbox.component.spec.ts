import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';

import { SandboxComponent } from './sandbox.component';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';
import { ParserService } from '../../services/parser.service';

describe('SandboxComponent', () => {
  let component: SandboxComponent;
  let fixture: ComponentFixture<SandboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxComponent ],
      providers: [ BaseService, UtilsService, HttpClient, HttpHandler, ParserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
