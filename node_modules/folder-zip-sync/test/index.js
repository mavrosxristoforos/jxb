var fs = require('fs')
var path = require('path')
var test = require('tape')

var folderZip = require('../.')
var outputName = path.join(__dirname, 'test.zip')

test('zip a directory', function zipADirectory (t) {
  var targetDir = path.join(__dirname, 'testfolder')
  folderZip(targetDir, outputName, [''])

  t.equal(fs.existsSync(outputName), true, 'zip file exists')
  fs.unlinkSync(outputName)
  t.end()
})

test('zip a directory using the cli', function (t) {
  process.argv = [null, null, 'test/testfolder', 'test/test.zip']
  console.log(process.argv)
  require('../cli')

  t.equal(fs.existsSync(outputName), true, 'zip file exists')
  fs.unlinkSync(outputName)
  t.end()
})
