const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your generator name (must start with: generator-)',
      default: 'generator-title'
    }]).then((answers) => {
      this.log('app name', answers.name);
      this.name = answers.name;
    });
  }

  initialiseGit() {
    const destinationPath = this.destinationPath();
    const path = `${destinationPath}/.git`;

    if (!fs.existsSync(path)) {
      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['flow', 'init', '-f', '-d']);
    }
  }

  addReadme() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { title: this.name }
    );
  }

  setupPackageJson() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        packageTitle: this.name,
        packageAuthor: 'Charlie Jackson'
      }
    );
  }

  installPackages() {
    this.npmInstall(['yeoman-generator']);
  }

  copyGenerators() {
    this.fs.copyTpl(
      this.templatePath('generators/**/*'),
      this.destinationPath('generators'),
      { title: 'Templating with Yeoman' }
    );

    this.fs.copyTpl(
      this.templatePath('generators/**/.*'),
      this.destinationPath('generators'),
      { title: 'Templating with Yeoman' }
    );
  }

  end() {
    this.composeWith(require.resolve('generator-editor-config/generators/app'));
    this.composeWith(require.resolve('generator-eslint/generators/app'));
    this.composeWith(require.resolve('generator-gitignore/generators/app'));
  }
};
