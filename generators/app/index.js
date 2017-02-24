const Generator = require('yeoman-generator');
const npmCheck = require('npm-check');
const path = require('path');

module.exports = class extends Generator {
  _generatorPrompts() {
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

  prompting() {
    const cwd = path.join(__dirname, '../../');

    return npmCheck({ cwd }).then((currentState) => {
      const npmPackages = currentState.get('packages');
      let needUpdating = false;

      npmPackages.forEach((npmPackage) => {
        if (npmPackage.latest !== npmPackage.installed) {
          needUpdating = true;
          this.log(`Package out of date: ${npmPackage.moduleName} ${npmPackage.installed} -> ${npmPackage.latest}`);
        }
      });

      if (needUpdating) {
        return this.prompt([{
          type: 'confirm',
          name: 'continue',
          message: 'This generator has packages which are out of date, do you want to continue?',
          default: false
        }]).then((answers) => {
          if (answers.continue) {
            return this._generatorPrompts();
          }

          throw new Error('Packages are out of date, please update and commit them before continuing.');
        });
      }

      return this._generatorPrompts();
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
    this.composeWith(require.resolve('generator-eslint-cj/generators/app'));
    this.composeWith(require.resolve('generator-gitignore-cj/generators/app'));
  }
};
