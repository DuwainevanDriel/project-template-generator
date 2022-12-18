#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const inquirer = __importStar(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const template = __importStar(require("./utils/template"));
const shell = __importStar(require("shelljs"));
const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What template would you like to use?',
        choices: CHOICES
    },
    {
        name: 'name',
        type: 'input',
        message: 'Please input a new project name:'
    }
];
const CURR_DIR = process.cwd();
let isUpdate = false;
let options;
inquirer.prompt(QUESTIONS).then(answers => {
    const projectChoice = answers['template'];
    const projectName = answers['name'];
    //@ts-ignore
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    //@ts-ignore
    const tartgetPath = path.join(CURR_DIR, projectName);
    options = {
        //@ts-ignore
        projectName,
        //@ts-ignore
        templateName: projectChoice,
        templatePath,
        tartgetPath
    };
    createProject(tartgetPath);
    //@ts-ignore
    createDirectoryContents(templatePath, projectName);
    postProcess(options);
});
function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk_1.default.yellowBright('Updating the project..'));
        isUpdate = true;
    }
    else if (!fs.existsSync(projectPath)) {
        console.log(chalk_1.default.yellowBright('Creating the project..'));
        fs.mkdirSync(projectPath);
    }
}
const SKIP_FILES = ['node_modules', '.template.json'];
function createDirectoryContents(templatePath, projectName) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1)
            return;
        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = template.render(contents, { projectName });
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            if (!fs.existsSync(path.join(CURR_DIR, projectName, file))) {
                // create folder in destination folder
                fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            }
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}
function postProcess(options) {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        shell.cd(options.tartgetPath);
        const result = shell.exec('npm install');
        if (result.code !== 0) {
            console.log(chalk_1.default.redBright('Failed'));
            return false;
        }
    }
    if (isUpdate) {
        console.log(chalk_1.default.greenBright('Project successfully updated'));
    }
    else {
        console.log(chalk_1.default.greenBright('Project successfully created'));
    }
    return true;
}
//# sourceMappingURL=index.js.map