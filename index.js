const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `build-file` input defined in action metadata file
  const buildFileName = core.getInput('build-file');
  console.log(`Build File: ${buildFileName}!`);

  console.log(`Workspace: ${process.env.GITHUB_WORKSPACE}`);

  var buildFile = process.env.GITHUB_WORKSPACE+buildFileName;
  console.log(buildFile);

  var fs = require('fs');
  if (fs.existsSync(buildFile)) {
    var contents = fs.readFileSync(buildFile, 'utf8');
    console.log(contents);
  }
  else {
    console.log('File does not exist.');
  }

  //const time = (new Date()).toTimeString();
  //core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
