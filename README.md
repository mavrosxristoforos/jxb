# jxb
Joomla Extension Continuous Deployment Action

JXB allows you to build and deploy your extension, using specific instructions from a build file.

## Inputs

### `build-file`

**Required** The name of the file to use as a guide, for building the extension. For available syntax, please read below. Default `"build.jxb"`.

### `ignore-inc-version`

A boolean argument to ignore version incrementations. Build files commonly include INCVERSION commands, to increment the extension build version, but you may not want to do that when releasing the extension through this action.

## Example usage

    uses: mavrosxristoforos/jxb@master
      with:
        build-file: 'build.jxb'
        ignore-inc-version: true
  
## Available Syntax for Build files
  - `DELETE:file_to_delete`
  - `INCVERSION:path/to/extension_xml_file.xml`
  - `MINIFY:js_or_css_file_to_minify target_minified_file_in_same_directory`
  - `RENAME:old_name new_name`
  - `ZIPDIR:directory_to_zip`
  - `ZIPFILES:target_zip_file_name files to zip separated by space...`