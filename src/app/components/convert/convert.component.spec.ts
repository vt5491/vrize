import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {NgForm} from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';

import { ConvertComponent } from './convert.component';

import { TransformerService } from '../../services/transformer.service';
import { ParserService } from '../../services/parser.service';
import { BaseService } from '../../services/base.service';
import { UtilsService } from '../../services/utils.service';

describe('VrizeConvertComponent', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [ ConvertComponent ],
      providers: [TransformerService, ParserService, BaseService, UtilsService, HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
