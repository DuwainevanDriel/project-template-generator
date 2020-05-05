# Project Template Generator

Build your own custom project templates with this project template generator from anywhere on your machine.

## Why the Project Template Generator

If you have to create alot new projects with the same setup you can use this template generator to setup a single project and reuse that project for your new projects.

### Steps to setup the template generator

```
1. run npm install
2. create your project template in the dist/templates directory. I have already added a sample-project in there for guidance.
3. Once you have added your "base project" run npm build.
4. run npm start to test if everything works.
5. choose your project to use and name your new project.
6. wait for the new template post processor to finish installing your new projects node_modules.
```

### Use Generator from anywhere

Register generate-template as a command line interface

```
1. run npm link
2. When successfull you can run generate-template from anywhere on your machine
```

