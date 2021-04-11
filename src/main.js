import glob from 'glob';
import path from 'path';
import { saveFile, readFile } from './files.js';
import { buildContentFile, buildIndexFile } from './render.js';

/**
 * Derives the output file name from a content source file.
 * Strips the file path and replaces the extension with .html
 *
 * @param {string} filePath - The file path of the source content file.
 * @return - The output path of the file to generate.
 */
const getOutputFileName = filePath => {
    const basename = path.basename(filePath);
    const contentFileName =
        basename.substring(0, basename.indexOf('.')) + '.html';

    return contentFileName;
}

/**
 * Renders content files from the source path using the supplied template and
 *  writes the rendered output to the provided output path.
 *
 * @param {string} sourcePath - The source path to read content files from.
 * @param {string} templatePath - The path to the content template.
 * @param {string} outputPath - The destination path to write to.
 * @returns - The generated content pages (title, excerpt, path).
 */
const generateContent = (sourcePath, templatePath, outputPath) => {
    const template = readFile(templatePath);
    let contentList = [];

    const filePaths = glob.sync(sourcePath + '/**/**.md');
    filePaths.forEach(filePath => {
        const outputFileName = getOutputFileName(filePath);
        const outputFilePath = path.join(outputPath, outputFileName);
        const content = buildContentFile(filePath, template, outputFilePath);
        contentList.push(content);
    });

    return contentList;
}

/**
 * Generates the website.
 *
 * @param {string} contentSourcePath - The path to the content source files.
 * @param {string} contentTemplatePath - The path to the content template.
 * @param {string} indexTemplatePath - The path to the index template.
 * @param {string} outputPath - The path to render the generated files into.
 * @returns - The number of content files that were generated.
 */
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

    // Copy styles
    const stylePaths = glob.sync('styles/**.css');
    stylePaths.forEach(stylePath => {
        const css = readFile(stylePath);
        saveFile(`site/styles/${path.basename(stylePath)}`, css);
    });

    return contentList.length;
}

export default generateSite;
