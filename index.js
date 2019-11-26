const core = require('@actions/core');
const github = require('@actions/github');
const io = require('@actions/io');
const fs = require('fs');
require('node-zip');

class JXBCommand {

  constructor(commandString) {
    var parts = commandString.trim().split(":");
    this._command = parts[0];
    this._args = parts[1].split(" ");
  }

  async execute() {
    switch(this._command) {
      case "COPY":
        console.log(`Copying file ${this._args[0]} to ${this._args[1]}`);
        if (fs.existsSync(this._args[0])) {
          try {
            await io.cp(this._args[0], this._args[1], {recursive:true, force:true});
            //fs.copyFileSync(this._args[0], this._args[1]);
          } catch(err) {
            console.log(err);
            return false;
          }
        }
        else {
          console.log(`Error: File ${this._args[0]} does not exist.`);
          return false;
        }
        break;
      case "INCVERSION":
        console.log("Skipping INCVERSION. Versions must have been incremented before commiting.");
        break;
      case "DELETE":
        console.log(`Deleting file ${this._args[0]}`);
        if (fs.existsSync(this._args[0])) {
          try {
            await io.rmRF(this._args[0]);
            //fs.unlinkSync(this._args[0]);
          } catch(err) {
            console.log(err);
            return false;
          }
        }
        else {
          console.log(`File ${this._args[0]} does not exist. Continuing...`);
        }
        break;
      case "MINIFY":
        console.log("Skipping MINIFY. Files must have been minified before commiting.");
        break;
      case "MKDIR":
        console.log(`Creating directory ${this._args[0]}`);
        try {
          await io.mkdirP(this._args[0]);
          //fs.mkdirSync(this._args[0], { recursive: true });
        } catch(err) {
          console.log(err);
          return false;
        }
        break;
      case "RENAME":
        console.log(`Renaming file ${this._args[0]} into ${this._args[1]}`);
        try {
          fs.renameSync(this._args[0], this._args[1]);
        } catch(err) {
          console.log(err);
          return false;
        }
        break;
      case "ZIPDIR":
        console.log(`Zipping directory ${this._args[0]}`);
        //var zip = new JSZip();

        break;
      case "ZIPFILES":
        console.log(`Zip Files into ${this._args[0]}`);
        break;
      default:
        console.log(`Unknown command: ${this._command}`);
        break;
    }
    return true;
  }
}

class JXB {

  readFile(buildFile) {
    this.buildFile = buildFile;
    this._commands = [];
    if (fs.existsSync(buildFile)) {
      var contents = fs.readFileSync(buildFile, 'utf8');
      var lines = contents.split("\n");
      for (var i = 0; i <= lines.length - 1; i++) {
        if (lines[i].charAt(0) == '#') continue;
        this._commands.push(new JXBCommand(lines[i]));
      }
      return true;
    }
    else {
      return false;
    }
  }

  async execute() {
    var result;
    for (var i = 0; i <= this._commands.length - 1; i++) {
      result = await this._commands[i].execute();
      if (!result) return i;
    }
    return true;
  }
}

(async () => {
  try {
    console.log('Welcome to JXB.')
    const jxb = new JXB();
    
    var argv = require('minimist')(process.argv.slice(2));
    var buildFile = (typeof argv.f !== 'undefined') ? argv.f : process.env.GITHUB_WORKSPACE+'/'+core.getInput('build-file', { required: true });

    if (!jxb.readFile(buildFile)) {
      core.setFailed(`Could not read build file: ${jxb.buildFile}`);
    }
    else {
      var result = await jxb.execute();
      if (result !== true) {
        core.setFailed(`Could not execute command: ${jxb._commands[result]._command} at line ${result}`);
      }
      else {
        console.log('Build finished successfully. Thanks for using JXB.');
        outputVersion = '1.0.0';
        core.setOutput('output-version', outputVersion);
      }
    }

    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    //console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();