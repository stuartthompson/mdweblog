import fs from 'fs';
import marked from 'marked';
import matter from 'gray-matter';
import path from 'path';
import { readFile, saveFile } from './files.js';

/**
 * Parses a markdown content file.
 *
 * @param {string} filePath - The path to the content file to parse.
 */
const parseContentFile = filePath => {
    const contents = readFile(filePath);
    const parsed = matter(contents, { excerpt: true });
    const html = marked(parsed.content);

    return { ...parsed, html };
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
        .replace(/<!--Title-->/g, title)
        .replace(/<!--Date-->/g, date)
        .replace(/<!--Content-->/g, content);
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

    // Build post list
    let postList = ``;
    contentList.map(c => {
        postList += `
        <div class="postContainer">
            <a href="${c.file}" class="postLink">${c.title}</a><br/>
            <div class="postExcerpt">${c.excerpt}</div>
        </div>
        `;
    });

    return template
        .replace(/<!--PageCount-->/g, pageCount)
        .replace(/<!--PostList-->/g, postList);

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
    const date = content.data.date;
    const rendered = renderContent(template, title, date, content.html);

    saveFile(outputFilePath, rendered);

    return {
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
