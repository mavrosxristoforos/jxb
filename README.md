# jxb
Joomla Extension Building Action

## Inputs

### `build-file`

**Required** The name of the file to use as a guide, for building the extension. For available syntax, please read below. Default `"build.jxb"`.

## Example usage

    uses: actions/jxb@v1
      with:
        build-file: 'build.jxb'
  

## Available Syntax for Build files
  - `INCVERSION:path/to/extension_xml_file.xml`
  - `ZIPDIR:directory_to_zip`
  - `ZIPFILES:target_zip_file_name files to zip separated by space...`
  - `MINIFY:js_or_css_file_to_minify target_minified_file_in_same_directory`
