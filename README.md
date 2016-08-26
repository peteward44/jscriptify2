# jscriptify
Browserify plugin to (attempt) to support the antiquated Microsoft JScript ASP engine

This doesn't guarantee compatibility with JScript, but might give you a better chance!

## What it does
* It replaces any future reserved keywords (as described in Ecma-262, section 7.5.3) with string literals
* It removes the 'global' identifier as this does not exist in JScript

Note: The work done by this transform may be undone by uglifiers. Try to make it the last transform in the list.

## Executing directly
You don't have to use browserify if you don't want to, just use
```
var jscriptify = require( 'jscriptify' );
var mycode = "var g = 3;";
jscriptify.exec( mycode, function( err, transformedCode ) {
	// transformedCode now contains your new code
} );
```

## Warning
If you are populating the global object by computing property names or concatenating strings; this will break. Don't do this
