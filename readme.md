# InDesign Menu Mapper Plugin

This InDesign script generates InDesign menus based on a directory/file structure on disk. It allows you to create dynamic menus and menu items by simply organizing files and folders.

## Directory Structure

Place your menus/submenus/commands in the `menu_mapper/menus` directory.

- directory names become the name of the menu or submenu
- file names for any scripts become the name of the command
- you can use optional numeric-string prefixes to control the order they will appear in the format `00100_`. These can be any numeric strings, using the leading and trailing zeros allows you to insert new menus/commands where you want them at a later date without renaming all the other files.
- any file found with loads of dashes will become a divider. This system means that when you're looking at the directory contents in your file browser you get a visual clue as the what the menu contents will look like.

### Allowed Script Types
- `.js`
- `.jsx`
- `.scptd`
- `.scpt`
- `.applescript`

I've not yet used a UXP script, so these are not allowed at the moment. I don't know if it's possible to allow them from extendscript.


### Location on Disk
You must place the file `_menu_mapper.jsx` in the startup scripts directory.

On macOS this would be something like `/Applications/Adobe InDesign $YEAR/Scripts/startup scripts/`

This script is what creates the menus based on the directory structure it finds in the menu directory `menu_mapper/menus/**`.

By default the `menu_mapper` directory is assumed to be next to the `startup scripts` directory, ie `/Applications/Adobe InDesign $YEAR/Scripts/menu_mapper`.

If you want to put this somewhere else, change the `menuMapperDirectory` setting in `_menu_mapper.jsx`, using an absolute path.


### Example Directory Structure

By default, `menu_mapper` should go in your InDesign `Scripts` directory, `/Applications/Adobe InDesign $YEAR/Scripts/menu_mapper`

```
menu_mapper/
    menus/
        00100_example menu/
            00100_example command.jsx
            00200_----------------------- example divider
            00300_another command.jsx
        00200_another example menu/
            00100_example command.jsx
            00200_----------------------- example divider
            00300_another command.jsx
        003200_third menu/
            00100_example command.jsx
            00200_----------------------- example divider
            00300_another command.jsx
```
