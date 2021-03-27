#!/usr/bin/env node

import generateSite from './main.js';

const DEFAULT_SOURCE_PATH = 'pages';
const DEFAULT_CONTENT_TEMPLATE = 'templates/content.html';
const DEFAULT_INDEX_TEMPLATE = 'templates/index.html';
const DEFAULT_OUTPUT_PATH = 'site';

let sourcePath = process.argv[2] == undefined ? DEFAULT_SOURCE_PATH : process.argv[2];
let contentTemplate = process.argv[3] == undefined ? DEFAULT_CONTENT_TEMPLATE : process.argv[3];
let indexTemplate = process.argv[4] == undefined ? DEFAULT_INDEX_TEMPLATE : process.argv[4];
let outputPath = process.argv[5] == undefined ? DEFAULT_OUTPUT_PATH : process.argv[5];

console.log(`MDWeblog`);
console.log(`========`);
console.log(`Source path: ${sourcePath}`);
console.log(`Content template: ${contentTemplate}`);
console.log(`Index template: ${indexTemplate}`);
console.log(`Output path: ${outputPath}`);

const numPages =
    generateSite(sourcePath, indexTemplate, contentTemplate, outputPath);

console.log(`Generated ${numPages} pages.`);
