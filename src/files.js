import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

/// Reads a file from disk
const readFile = (filename) => {
    const contents = 
        fs.readFileSync(path.join(path.resolve(), filename), 'utf8');
    return contents;
}

/// Saves a file to disk
const saveFile = (filename, contents) => {
    const dir = path.dirname(filename);
    mkdirp.sync(dir);
    fs.writeFileSync(filename, contents);
}

export { readFile, saveFile };
