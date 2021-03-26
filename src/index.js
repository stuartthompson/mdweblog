import generateSite from './app.js';

// Main entry point
const contentSourcePath = 'pages';
const contentTemplatePath = 'templates/content.html';
const indexTemplatePath = 'templates/index.html';
const outputPath = 'site';

// Generate the site
generateSite(
    contentSourcePath, contentTemplatePath, indexTemplatePath, outputPath);
