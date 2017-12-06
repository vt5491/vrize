#!/usr/bin/env node
//var my_lib = require('myLib');
//console.log('hi from index.js');
// import {getMsg} from "myLib";
import { BaseService } from '../services/base.service';
import { log } from "util";

//console.log('msg =' + my_lib.getMsg());
// console.log('msg2 =' + getMsg());
let bs = new BaseService();
console.log('baseService.doSomething3=' + bs.doSomething());

