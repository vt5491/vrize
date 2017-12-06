#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_service_1 = require("../services/base.service");
//console.log('msg =' + my_lib.getMsg());
// console.log('msg2 =' + getMsg());
var bs = new base_service_1.BaseService();
console.log('baseService.doSomething3=' + bs.doSomething());
