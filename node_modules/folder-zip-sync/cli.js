#!/usr/bin/env node
'use strict';
const zipFolderSync = require('./')
const path = require('path')
const args = process.argv.slice(2)
const folder = path.join(process.cwd(), args[0])
const outputFile = args[1] || 'output.zip'
const ignores = args.slice(2) || ['.git']

process.stdout.write(`Zipping ${outputFile}...`)

zipFolderSync(folder, outputFile, ignores)
