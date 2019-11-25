# jxb
Joomla Extension Continuous Deployment Action

JXB allows you to build your extension, using specific instructions from a build file.

## Inputs

### `build-file`

**Required** The path of the file to use as a guide, for building the extension. For available syntax, please read below. Default `"build.jxb"`.

### `version-file`

The path of the file from which to retrieve the release version.

## Outputs

The package version.

## Example usage

    uses: mavrosxristoforos/jxb@master
      with:
        build-file: 'build.jxb'
        ignore-inc-version: true
  
## Available Syntax for Build files
  - `DELETE:file_to_delete`
  - `RENAME:old_name new_name`
  - `ZIPDIR:directory_to_zip`
  - `ZIPFILES:target_zip_file_name files to zip separated by space...`
