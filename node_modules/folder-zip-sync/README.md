# folder-zip-sync

zip a folder synchronously.

## as a function

```bash
npm install --save folder-zip-sync
```

```js
const zipFolder = require('folder-zip-sync')

zipFolder('./myFolder', 'myZipFile.zip', ['privateFile.txt'])
// Done!
```


## as a command line

```bash
Install:
  npm install -g folder-zip-sync

Usage:
  folder-zip-sync [source] [output] [ignored]

Arguments:
    source: The folder you want to zip
    output: Optional. Name of the file created. Defaults to output.zip
    ignored: Optional. List of files you want to exclude. Defaults to .git
```