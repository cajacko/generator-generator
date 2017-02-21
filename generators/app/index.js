const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your generator name (whatever you enter will be prepended with: generator-)',
      default: 'title'
    }]).then((answers) => {
      const name = `generator-${answers.name}`;
      this.name = name;
    });
  }

  initialiseGit() {
    this.composeWith(require.resolve('generator-git/generators/app'));
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
