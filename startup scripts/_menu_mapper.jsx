// This script must go in the startup scripts directory for InDesign:
// path_to_InDesign/Scripts/startup scripts/_menu_mapper.jsx

// You must make a folder to contain the directories and scripts for your menus
// using this format:

// InDesign/Scripts/menuMapperDirectory/userMenuFolderName/menuName/

// For each sub-directory the script finds in `userMenuFolderName` it will make
// a new sub-menu with the name of that folder.

// For each file it finds in that sub-folder it will make a new menu item and
// associate the file as the menu action.

//@target "InDesign"

$.level = 0

var userName = File( '~' ).displayName.toLowerCase()

var prefs = {
  // This is the name/path of the directory inside the InDesign scripts folder.
  // It defaults to "menu_mapper" but you can change it to whatever you want.
  // If it's just a name, the directory needs to be placed next to the 'startup scripts' directory.
  // If it's a path, it will look for the directory at that path.
  menuMapperDirectory: 'menu_mapper',

  // example of specifying a path instead (should be absolute):
  // menuMapperDirectory: "/users/me/documents/menu_mapper",
}


function fileNameSort( a, b ) { return a.displayName > b.displayName };


function main() {

  var menuMapperDirectory
  var menuMapperDirectoryPath
  if ( prefs.menuMapperDirectory.match( /^\// ) ) {
    menuMapperDirectory = Folder( prefs.menuMapperDirectory )
    menuMapperDirectoryPath = prefs.menuMapperDirectory
  } else {
    var here = new File( $.fileName )
    var menuMapperDirectory = here.parent.parent.getFiles( prefs.menuMapperDirectory )[ 0 ]
    menuMapperDirectoryPath = here.parent.parent.fsName + '/' + prefs.menuMapperDirectory + '/' + 'menus'
  }

  var menuFolders
  try {
    menuFolders = menuMapperDirectory.getFiles( 'menus' )[ 0 ].getFiles().sort( fileNameSort )
  } catch ( e ) {
    alert( 'Could not find menuMapperDirectory\n' + menuMapperDirectoryPath )
    return
  }

  for ( var i = 0; i < menuFolders.length; i++ ) {
    deleteMenu( menuFolders[ i ] )
    createMenu( menuFolders[ i ], app.menus.item( '$ID/Main' ) )
  }

  // Delete menus that no longer have contents. ie they were made by this
  // system then the folders were removed from disk. InDesign still keeps
  // the empty menu for some reason.
  var submenus = app.menus.item( '$ID/Main' ).submenus.everyItem().getElements()
  for ( var i = 0; i < submenus.length; i++ ) {
    var element = submenus[ i ]
    if ( !element.menuItems.length ) {
      element.remove()
    }
  }
}


function deleteMenu( folder ) {
  try {
    var menuName = parseName( folder.displayName )
    var mnu = app.menus.item( '$ID/Main' ).submenus.item( menuName )
    if ( mnu.isValid ) { mnu.remove() }
  } catch ( e ) { }
}


function createMenu( folder, baseMenu ) {
  var files = folder.getFiles().sort( fileNameSort )

  var menuName = parseName( folder.displayName )

  var mnu = baseMenu.submenus.add( menuName )

  for ( i = 0; i < files.length; i++ ) {
    if ( files[ i ].constructor.name == 'File' || files[ i ].name.match( /\.scptd/ ) ) {
      if ( !files[ i ].name.match( /\.js$|\.jsx$|\.scpt|\.applescript|----/ ) ) { continue }
      addMenuItem( files[ i ], mnu )
    } else {
      createMenu( files[ i ], mnu )
    }
  }
}


function addMenuItem( file, mnu ) {
  var fileName = file.displayName
  if ( !$.os.match( /Macintosh/ ) ) {
    if ( fileName.match( /\.applescript|\.scptd/g ) ) {
      return
    }
  }

  // Mac OS hidden files
  if ( fileName.charAt( 0 ) === '.' ) { return }

  var scriptMenuActionTitle = parseName( fileName )

  if ( scriptMenuActionTitle.match( /----/ ) ) {
    mnu.menuSeparators.add()
    return
  }

  var identifier = file.fsName

  var tmp = app.scriptMenuActions.item( identifier )
  if ( tmp.isValid ) {
    tmp.remove()
  }
  var sma = app.scriptMenuActions.add( identifier )

  sma.title = scriptMenuActionTitle

  sma.addEventListener(
    'onInvoke',
    file.fsName
  )

  mnu.menuItems.add( sma )
}


function parseName( name ) {
  return name.replace( /^\d+_/, '' )
    .replace( /%20/, ' ' )
    .replace( /\.jsx*|\.jsxbin/, '' )
    .replace( /\.scptd*/, '' )
    .replace( /\.applescript/, '' )
}



main()