# jxb
Joomla Extension Building Action

## Inputs

### `build-file`

**Required** The name of the file to use as a guide, for building the extension. For available syntax, please read below. Default `"build.jxb"`.

## Example usage

    uses: mavrosxristoforos/jxb@master
      with:
        build-file: 'build.jxb'
  

## Available Syntax for Build files
  - `DELETE:file_to_delete`
  - `INCVERSION:path/to/extension_xml_file.xml`
  - `MINIFY:js_or_css_file_to_minify target_minified_file_in_same_directory`
  - `RENAME:old_name new_name`
  - `ZIPDIR:directory_to_zip`
  - `ZIPFILES:target_zip_file_name files to zip separated by space...`