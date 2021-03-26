import fs from 'fs';
import marked from 'marked';
import matter from 'gray-matter';
import path from 'path';
import { readFile, saveFile } from './files.js';

// Parses a markdown content file.
//
// Params:
//  * filePath - The path to the content file to parse.
const parseContentFile = filePath => {
    const contents = readFile(filePath);
    const parsed = matter(contents);
    const html = marked(parsed.content);

    return { ...parsed, html };
}

// Renders content into a template.
//
// Params:
//  * template - The html template used to render the content.
//  * title    - The title of the content page.
//  * date     - The publish data of the content page.
//  * content  - The converted html content of the markdown source.
const renderContent = (template, title, date, content) => {
    return template
        .replace(/<!--Title-->/g, title)
        .replace(/<!--Date-->/g, date)
        .replace(/<!--Content-->/g, content);
}

// Renders the index content into the index page template.
//
// Params:
//  * template    - The html template for the index page.
//  * contentList - The list of content pages in the site.
const renderIndex = (template, contentList) => {
    const pageCount = contentList.length;

    return template
        .replace(/<!--PageCount-->/g, pageCount);

}

// Renders a content file as html and writes the file to disk.
//
// Params:
//  * sourceFilePath - The file path of the source content file.
//  * template       - The html template used to render the content.
//  * outputFilePath - The file path of the output file to write.
const buildContentFile = (sourceFilePath, template, outputFilePath) => {
    const content = parseContentFile(sourceFilePath);
    const title = content.data.title;
    const date = content.data.date;
    const rendered = renderContent(template, title, date, content.html);

    saveFile(outputFilePath, rendered);
}

// Renders the index file as html and writes the file to disk.
//
// Params:
//  * contentList    - The list of content files.
//  * template       - The html template for the index page.
//  * outputFilePath - The file path to write the index page to.
const buildIndexFile = (contentList, template, outputFilePath) => {
    const rendered = renderIndex(template, contentList);

    saveFile(outputFilePath, rendered);
}

export { buildContentFile, buildIndexFile };
