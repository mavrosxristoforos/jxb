const core = require('@actions/core');
const github = require('@actions/github');

try {
  const buildFileName = core.getInput('build-file');
  console.log(`Build File: ${buildFileName}!`);

  console.log(`Workspace: ${process.env.GITHUB_WORKSPACE}`);

  var fs = require('fs');

  fs.readdir(process.env.GITHUB_WORKSPACE, function(err, items) {
    console.log("Listing workspace directory");
    console.log(items);
 
    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
  });

  var buildFile = process.env.GITHUB_WORKSPACE+'/'+buildFileName;
  console.log(buildFile);

  if (fs.existsSync(buildFile)) {
    var contents = fs.readFileSync(buildFile, 'utf8');
    console.log(contents);
    var lines = contents.split("\n");
    for (var i = lines.length - 1; i >= 0; i--) {
      var parts = lines[i].split(":");
      var command = parts[0];
      switch(command) {
        case "INCVERSION":
          console.log("Increase version of file "+parts[1]);
          break;
        case "DELETE":
          console.log("Delete file "+parts[1]);
          break;
        case "MINIFY":
          console.log("Minify file "+parts[1]+" into "+parts[2]);
          break;
        case "RENAME":
          console.log("Rename file "+parts[1]+" into "+parts[2]);
          break;
        case "ZIPDIR":
          console.log("Zip directory "+parts[1]);
          break;
        case "ZIPFILES":
          console.log("Zip Files into "+parts[1]);
          break;
      }
    }
  }
  else {
    core.setFailed('Build File does not exist: '+buildFile);
  }

  //const time = (new Date()).toTimeString();
  //core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
