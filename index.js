const core = require('@actions/core');
const github = require('@actions/github');
const io = require('@actions/io');
const fs = require('fs');
const path = require('path');
const zipFolder = require('folder-zip-sync');

class JXBCommand {

  constructor(commandString) {
    var parts = commandString.trim().split(":");
    this._command = parts[0];
    this._args = parts[1].split(" ");
  }

  async copy(sourcePath, target) {
    console.log(`Copying file ${sourcePath} to ${target}`);
    if (fs.existsSync(sourcePath)) {
      try {
        await io.cp(sourcePath, target, {recursive:true, force:true});
        //fs.copyFileSync(sourcePath, target);
      } catch(err) {
        console.log(err);
        return false;
      }
    }
    else {
      console.log(`Error: File ${this._args[0]} does not exist.`);
      return false;
    }
    return true;
  }

  async delete(pathToDelete) {
    console.log(`Deleting file ${pathToDelete}`);
    if (fs.existsSync(pathToDelete)) {
      try {
        await io.rmRF(pathToDelete);
      } catch(err) {
        console.log(err);
        return false;
      }
    }
    else {
      console.log(`File ${pathToDelete} does not exist. Continuing...`);
    }
    return true;
  }

  async mkdir(dirPath) {
    console.log(`Creating directory ${dirPath}`);
    try {
      await io.mkdirP(dirPath);
      //fs.mkdirSync(dirPath, { recursive: true });
    } catch(err) {
      console.log(err);
      return false;
    }
    return true;
  }

  async rename(oldName, newName) {
    console.log(`Renaming file ${oldName} into ${newName}`);
    try {
      fs.renameSync(oldName, newName);
    } catch(err) {
      console.log(err);
      return false;
    }
    return true;
  }

  async zipdir(dirName, targetZipName) {
    console.log(`Zipping directory ${dirName}`);
    if (fs.existsSync(dirName)) {
      zipFolder(dirName, targetZipName);
    }
    else {
      console.log(`Error: File ${dirName} does not exist.`);
      return false;
    }
    return true;
  }

  async zipfiles(args) {
    console.log(`Zip Files into ${args[0]}`);
    var result = true;
    // Create a temporary directory
    result = result && await this.mkdir('.jxbTmpDir');
    // Copy all files in that directory
    for (var i = 1; i < args.length; i++) {
      result = result && await this.copy(args[i], '.jxbTmpDir/'+path.basename(args[i]));
    }
    // Zip that directory with the desired file name.
    result = result && await this.zipdir('.jxbTmpDir', args[0]);
    // Delete the temporary directory
    result = result && await this.delete('.jxbTmpDir');
    if (result) {
      console.log(`Created file: ${args[0]}`);
    }
    return result;
  }

  async execute() {
    switch(this._command) {
      case "COPY":
        return await this.copy(this._args[0], this._args[1]);
        break;
      case "INCVERSION":
        console.log("Skipping INCVERSION. Versions must have been incremented before commiting.");
        break;
      case "DELETE":
        return await this.delete(this._args[0]);
        break;
      case "MINIFY":
        console.log("Skipping MINIFY. Files must have been minified before commiting.");
        break;
      case "MKDIR":
        return await this.mkdir(this._args[0]);
        break;
      case "RENAME":
        return await this.rename(this._args[0], this._args[1]);
        break;
      case "ZIPDIR":
        return await this.zipdir(this._args[0], this._args[0]+".zip");
        break;
      case "ZIPFILES":
        return await this.zipfiles(this._args);
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
        outputVersion = '1.0.0'; // TODO: Detect version
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