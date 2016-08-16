module.exports = function() {
  var fs = require('fs');
  var chai = require('chai');
  var expect = chai.expect;

  var Testrail = require('testrail-api');

  var fsMock = require('mock-fs');


  this.When(/^There is a file named "(.*)" with the content:$/, function (filePath, fileContent, callback) {
    this.fsMockConfig['/feature/parent-section'] = {};
    this.fsMockConfig['/feature/parent-section/a-sub-section'] = {};

    this.fsMockConfig[filePath] = fsMock.file({
      content: fileContent,
      ctime: new Date(1),
      mtime: new Date(1)
    });

    callback();
  }.bind(this));


  this.Given(/^I (confirm|deny) the overwrite$/, function (actionType, callback) {
    this.ScenarioSynchronizer.__set__('inquirer', {
      prompt: function (options) {
        return Promise.resolve({ confirm: (actionType == 'confirm') });
      }
    });

    callback();
  }.bind(this));


  this.Given(/^I enable the overwrite.(.*) option$/, function (optionName, callback) {
    this.syncOptions.overwrite = this.syncOptions.overwrite || {};
    this.syncOptions.overwrite[optionName] = true;

    callback();
  }.bind(this));


  this.Given(/^I set the overwrite.(.*) option to "(.*)"$/, function (optionName, optionValue, callback) {
    this.syncOptions.overwrite = this.syncOptions.overwrite || {};
    this.syncOptions.overwrite[optionName] = optionValue;

    callback();
  }.bind(this));


  this.Then(/^The file "(.*)" should have the following content:$/, function (filePath, fileContent, callback) {
    expect(fs.readFileSync(filePath).toString()).to.equal(fileContent);

    callback();
  }.bind(this));


  this.Then(/^The file "(.*)" should not have been modified$/, function (filePath, callback) {
    expect(fs.statSync(filePath).mtime.getTime()).to.equal(new Date(1).getTime());

    callback();
  }.bind(this));


  this.Then(/^The TestCase should have the following Gherkins:$/, function (gherkins, callback) {
    var Testrail = require('testrail-api');
    var testrail = new Testrail({
      host: 'https://test.testrail.com', 
      user: 'test', 
      password: 'test'
    });

    testrail.getCase(100, callback);
  }.bind(this));
};
