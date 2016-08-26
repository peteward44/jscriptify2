var transformTools = require( 'browserify-transform-tools' );

// Taken from Ecma-262, section 7.5.3
// https://msdn.microsoft.com/en-us/library/mt227924(v=vs.85).aspx
var illegalNames = [
	"abstract",
	"arguments",
	"case",
	"continue",
	"enum",
	"else",
	"eval",
	"new",
	"int",
	"null",
	"instanceof",
	"short",
	"boolean",
	"break",
	"do",
	"in",
	"export",
	"for",
	"false",
	"finally",
	"interface",
	"static",
	"switch",
	"byte",
	"extends",
	"long",
	"if",
	"super",
	"char",
	"final",
	"native",
	"let",
	"synchronized",
	"class",
	"float",
	"package",
	"throws",
	"this",
	"const",
	"goto",
	"private",
	"transient",
	"true",
	"typeof",
	"return",
	"debugger",
	"implements",
	"protected",
	"volatile",
	"double",
	"import",
	"public",
	"default",
	"delete",
	"function",
	"throw",
	"catch",
	"try",
	"var",
	"void",
	"while",
	"with",
	"yield"
];


function process( node, transformOptions, done ) {
	// object properties: ie. object.default = "mystring"
	if ( node.type === 'MemberExpression' ) {
		if ( typeof node.property === "object" && typeof node.property.name === "string" && typeof node.property.type === "string" && node.property.type === "Identifier" ) {
			if ( illegalNames.indexOf( node.property.name ) >= 0 ) {
				var code = node.source();
				var newCode = code.replace( /\..*$/, "['" + node.property.name + "']" );
				node.update( newCode );
			}
		}
	}
	
	// object expression: ie. { default: "mystring" }
	if ( node.type === 'Property' ) {
		if ( typeof node.key === "object" && typeof node.key.name === "string" && typeof node.key.type === "string" && node.key.type === "Identifier" ) {
			if ( illegalNames.indexOf( node.key.name ) >= 0 ) {
				var code = node.source();
				var newCode = code.replace( /.*?:/, "'" + node.key.name + "':" );
				node.update( newCode );
			}
		}
	}
	
	// replace global keywork with nothing
	// see: http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
	if ( node.type === 'MemberExpression' ) {
		if ( typeof node.object === "object"
			&& typeof node.object.name === "string"
			&& typeof node.object.type === "string"
			&& node.object.type === "Identifier"
			&& node.object.name === "global" ) {
			
			if ( node.property.type === "Identifier" ) {
				// global.keyname = "valuename" style
				var code = node.source();
				var newCode = code.replace( /global\./g, "" );
				node.update( newCode );
			} else if ( node.property.type === "Literal" ) {
				// global['keyname'] = "valuename" style
				// Note: This will break if concatenating 2 strings or computing somehow else
				var code = node.source();
				var newCode = code.replace( /global\[\s*("|')(.*)?("|')\s*\]/g, "$2" );
				node.update( newCode );
			}
		}
	}
	
	done();
}

var jscriptify = transformTools.makeFalafelTransform( "jscriptify", { jsFilesOnly: true }, process );

jscriptify.exec = function( content, callback ) {
	return transformTools.runTransform(
		jscriptify,
		"dummyfilename.js",
		{
			content: content
		},
		callback
	);
};

module.exports = jscriptify;
