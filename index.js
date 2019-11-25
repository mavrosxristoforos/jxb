const core = require('@actions/core');
const github = require('@actions/github');

try {
  const ignoreIncVersion = core.getInput('ignore-inc-version');
  const buildFileName = process.env.GITHUB_WORKSPACE+'/'+core.getInput('build-file', { required: true });
  var fs = require('fs');

  if (fs.existsSync(buildFileName)) {
    var contents = fs.readFileSync(buildFileName, 'utf8');
    var lines = contents.split("\n");
    for (var i = 0; i <= lines.length - 1; i++) {
      var parts = lines[i].split(":");
      var command = parts[0];
      var args = parts[1].split(" ");
      switch(command) {
        case "INCVERSION":
          if (ignoreIncVersion) {
            console.log("Ignoring INCVERSION command");
          }
          else {
            console.log("Increase version of file "+args[0]);
          }
          break;
        case "DELETE":
          console.log("Delete file "+args[0]);
          break;
        case "MINIFY":
          console.log("Minify file "+args[0]+" into "+args[1]);
          break;
        case "RENAME":
          console.log("Rename file "+args[0]+" into "+args[1]);
          break;
        case "ZIPDIR":
          console.log("Zip directory "+args[0]);
          break;
        case "ZIPFILES":
          console.log("Zip Files into "+args[0]);
          break;
        default:
          console.log("Unknown command: "+command);
          break;
      }
    }
  }
  else {
    core.setFailed('Build File does not exist: '+buildFileName);
  }
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
