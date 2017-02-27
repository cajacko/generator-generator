const Generator = require('yeoman-generator');
const npmCheck = require('npm-check');
const path = require('path');
const npmName = require('../../package.json').name;
const checkOutOfDatePackages = require('check-out-of-date-packages');

module.exports = class extends Generator {
  initializing() {
    const cwd = path.join(__dirname, '../../');
    return checkOutOfDatePackages(cwd);
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
