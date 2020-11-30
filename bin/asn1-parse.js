#!/usr/bin/env node

const {asn1Parse} = require('../build/src/cmdLine');
const output = asn1Parse();
console.log('output: ', output);
