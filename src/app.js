import glob from 'glob';
import path from 'path';
import { readFile } from './files.js';
import { buildContentFile, buildIndexFile } from './render.js';

// Derives the output file name from a content source file.
//
// Strips the file path and replaces the extension with .html
//
// Params:
//  * filePath - The file path of the source content file.
const getOutputFileName = filePath => {
    const basename = path.basename(filePath);
    const contentFileName =
        basename.substring(0, basename.indexOf('.')) + '.html';

    return contentFileName;
}

// Renders content files from the source path using the supplied template and
//  writes the rendered output to the provided output path.
//
// Params:
//  * sourcePath   - The source path from which to read content files.
//  * templatePath - The path to the template used to render content.
//  * outputPath   - The destination path in which to write output.
const generateContent = (sourcePath, templatePath, outputPath) => {
    const template = readFile(templatePath);
    let contentList = [];

    const filePaths = glob.sync(sourcePath + '/**/**.md');
    filePaths.forEach(filePath => {
        const outputFileName = getOutputFileName(filePath);
        const outputFilePath = path.join(outputPath, outputFileName);
        buildContentFile(filePath, template, outputFilePath);
        contentList.push(outputFileName);
    });

    return contentList;
}

// Generates the website.
//
// Params:
//  * contentSourcePath   - The path to the content source files.
//  * contentTemplatePath - The path to the content template.
//  * indexTemplatePath   - The path to the index template.
//  * outputPath          - The path in which to render the generated files.
const generateSite = (
    contentSourcePath,
    contentTemplatePath,
    indexTemplatePath,
    outputPath) => {
    // Generate content files
    const contentList =
        generateContent(contentSourcePath, contentTemplatePath, outputPath);

    // Generate index file
    const indexOutputPath = path.join(outputPath, 'index.html');
    const indexTemplate = readFile(indexTemplatePath);
    buildIndexFile(contentList, indexTemplate, indexOutputPath);
}

export default generateSite;
