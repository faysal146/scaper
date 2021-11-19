import path from 'path';
import fs, { fstatSync } from 'fs';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const options = {
    pageUrl: {
        type: 'input',
        name: 'pageUrl',
        message: 'Enter the url of the page ',
        validate(input) {
            return input.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            )
                ? true
                : 'url is invalid';
        },
    },
    outputDir: {
        type: 'input',
        name: 'outputDir',
        message: 'Output Dir Name ',
        default: 'current',
        validate(input) {
            if (input === 'current') return true;
            else {
                const dirFound = fs.existsSync(path.join(process.cwd(), input));
                return dirFound ? true : 'output folder not found';
            }
        },
    },
    outputFileName: {
        type: 'input',
        name: 'outputFileName',
        message: 'Enter output file name',
        default(content) {
            return content.pageUrl
                .split(/\.[a-z]{2,6}\//gi)[1]
                .replace(/\/$/g, '');
        },
        validate(input) {
            return input === '' ? 'Please Provide Your filename' : true;
        },
        transformer(input) {
            return input.trim().endsWith('.md') ? input : input + '.md';
        },
    },
    pageSelectorType: {
        type: 'list',
        name: 'pageSelectorType',
        message: 'select page root entry point type ',
        default: 'root',
        choices: ['root', 'id', 'tag', 'class'],
    },
    pageSelector: {
        type: 'input',
        name: 'entrySelector',
        message: 'enter your selector ',
    },
    excludeSelctor: {
        type: 'input',
        name: 'excludeSelector',
        message: 'exclude any item from page ? ',
        // transformer(text) {
        //     return text.split(' ').join(', ');
        // },
    },
};

export default async () => {
    const firstAns = await inquirer.prompt([
        options.pageUrl,
        options.outputDir,
        options.outputFileName,
        options.pageSelectorType,
    ]);
    const newPromot = [];
    if (firstAns.pageSelectorType !== 'root')
        newPromot.push(options.pageSelector);

    const secondAns = await inquirer.prompt([
        ...newPromot,
        options.excludeSelctor,
    ]);

    return Object.assign(firstAns, secondAns);
};
