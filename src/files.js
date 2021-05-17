import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

/**
 * Reads a file from disk.
 * @param {*} filename - The name of the file to read.
 * @returns The requested file if found, null otherwise.
 */
const readFile = (filename) => {
    const contents =
        fs.readFileSync(path.join(path.resolve(), filename), 'utf8');
    return contents;
}

/**
 * Saves a file to disk.
 * @param {*} filename - The name of the file to save.
 * @param {*} contents - The file contents.
 */
const saveFile = (filename, contents) => {
    const dir = path.dirname(filename);
    mkdirp.sync(dir);
    fs.writeFileSync(filename, contents);
}

export { readFile, saveFile };
