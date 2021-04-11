import fs from 'fs';
import marked from 'marked';
import matter from 'gray-matter';
import path from 'path';
import { readFile, saveFile } from './files.js';
import { after, formatDate } from './text.js'

/**
 * Parses a markdown content file.
 *
 * @param {string} filePath - The path to the content file to parse.
 */
const parseContentFile = filePath => {
    const contents = readFile(filePath);
    // Parse front-matter (---) into metadata and content
    const parsed = matter(contents, { excerpt: true });
    // Remove excerpt from content
    const postContent = after(parsed.content, '---');
    // Parse content (markdown) to html
    const html = marked(postContent);

    return { ...parsed, html};
}

/**
 * Renders content into a template.
 *
 * @param {string} template - The html template used to render the content.
 * @param {string} title - The title of the content page.
 * @param {string} date - The publish data of the content page.
 * @param {string} content - The converted html content of the markdown source.
 * @returns - The page content, rendered into the template.
 */
const renderContent = (template, title, date, content) => {
    return template
        .replace(/##TITLE##/g, title)
        .replace(/##DATE##/g, date)
        .replace(/##CONTENT##/g, content);
}

/**
 * Renders the index content into the index page template.
 *
 * @param {string} template - The html template for the index page.
 * @param {string} contentList - The list of content pages in the site.
 * @returns - The index page content, rendered into the template.
 */
const renderIndex = (template, contentList) => {
    const pageCount = contentList.length;

    const excerptTemplate = readFile('/templates/excerpt.html');

    // Build post list
    let postList = ``;
    const sortedContent = contentList.slice().sort(
        (a, b) => new Date(b.date) - new Date(a.date));
    sortedContent.map(c => {
        const excerpt =
            excerptTemplate
                .replace(/##DATE##/g, c.date)
                .replace(/##LINK##/g, c.file)
                .replace(/##TITLE##/g, c.title)
                .replace(/##EXCERPT##/g, c.excerpt);
        postList += excerpt;
    });

    return template
        .replace(/##PAGECOUNT##/g, pageCount)
        .replace(/##EXCERPTS##/g, postList);

}

/**
 * Renders a content file as html and writes the file to disk.
 *
 * @param {string} sourceFilePath - The file path of the source content file.
 * @param {string} template - The html template used to render the content.
 * @param {string} outputFilePath - The file path of the output file to write.
 * @returns - The content file descriptor (title, excerpt, path).
 */
const buildContentFile = (sourceFilePath, template, outputFilePath) => {
    const content = parseContentFile(sourceFilePath);
    const title = content.data.title;
    const date = formatDate(content.data.date);
    const rendered = renderContent(template, title, date, content.html);

    saveFile(outputFilePath, rendered);

    return {
        date,
        title: content.data.title,
        excerpt: content.excerpt,
        file: path.basename(outputFilePath)
    };
}

/**
 * Renders the index file as html and writes the file to disk.
 *
 * @param {string} contentPages - Content page data.
 * @param {string} template - The html template for the index page.
 * @param {string} outputFilePath - The file path to write the index page to.
 * @returns - Build the index page and writes the file to disk.
 */
const buildIndexFile = (contentPages, template, outputFilePath) => {
    const rendered = renderIndex(template, contentPages);

    saveFile(outputFilePath, rendered);
}

export { buildContentFile, buildIndexFile };
