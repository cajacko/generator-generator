const Generator = require('yeoman-generator');
const npmCheck = require('npm-check');
const path = require('path');

module.exports = class extends Generator {
  initializing() {
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
            return true;
          }

          throw new Error('Packages are out of date, please update and commit them before continuing.');
        });
      }

      return true;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('./**/*'),
      this.destinationPath('./'),
      { variable: 'value' }
    );

    this.fs.copyTpl(
      this.templatePath('./**/.*'),
      this.destinationPath('./'),
      { variable: 'value' }
    );
  }
};
