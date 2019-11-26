# jxb
Joomla Extension Continuous Deployment Action

JXB allows you to build your extension, using specific instructions from a build file.

## Inputs

### `build-file`

**Required** The path of the file to use as a guide, for building the extension. For available syntax, please read below. Default `"build.jxb"`.

### `version-file`

The path of the file from which to retrieve the release version.

## Outputs

### `output-version`

The package version to use for the release.

## Example usage

    uses: mavrosxristoforos/jxb@master
      with:
        build-file: 'build.jxb'

## Console usage

    node index.js -f path/to/buildfile
  
## Available Syntax for Build files
  - `COPY:file_to_copy new_location`
  - `DELETE:file_or_dir_to_delete`
  - `MKDIR:directory_to_create`
  - `RENAME:old_name new_name`
  - `ZIPDIR:directory_to_zip`
  - `ZIPFILES:target_zip_file_name files to zip separated by space`

## Example Build file to package a Joomla Extension

    # First, delete the com_example.zip file
    DELETE:com_example.zip
    # Then, zip the com_example directory
    ZIPDIR:com_example
    # Same for our module
    DELETE:mod_example.zip
    ZIPDIR:mod_example
    # Then, create a package zip file adding a pkg_example.xml file and the zips we just created
    ZIPFILES:pkg_example.zip pkg_example.xml com_example.zip mod_example.zip