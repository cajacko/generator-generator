const Generator = require('yeoman-generator');
const path = require('path');
const checkOutOfDatePackages = require('check-out-of-date-packages');

module.exports = class extends Generator {
  initializing() {
    const cwd = path.join(__dirname, '../../');
    return checkOutOfDatePackages(cwd, 'Charlie Jackson');
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your generator name (whatever you enter will be prepended with: generator-)',
        default: 'title'
      }
    ]).then((answers) => {
      const name = `generator-${answers.name}`;
      this.name = name;
    });
  }

  initialiseGit() {
    this.composeWith(require.resolve('generator-git-cj/generators/app'));
  }

  addReadme() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { title: this.name }
    );
  }

  setupPackageJson() {
    this.composeWith(require.resolve('generator-package-json/generators/app'), {
      name: this.name,
      keywords: 'javascript, yeoman-generator',
      files: 'generators'
    });
  }

  installPackages() {
    this.npmInstall(['yeoman-generator'], { save: true });
    this.npmInstall(['npm-check'], { save: true });
    this.npmInstall(['check-out-of-date-packages'], { save: true });
    this.npmInstall(['generator-readme-cj'], { save: true });
  }

  copyGenerators() {
    this.fs.copyTpl(
      this.templatePath('generators/**/*'),
      this.destinationPath('generators'),
      { title: this.name }
    );

    this.fs.copyTpl(
      this.templatePath('generators/**/.*'),
      this.destinationPath('generators'),
      { title: this.name }
    );
  }

  end() {
    this.composeWith(require.resolve('generator-editor-config/generators/app'));
    this.composeWith(require.resolve('generator-eslint-cj/generators/app'));
    this.composeWith(require.resolve('generator-gitignore-cj/generators/app'));
  }
};
