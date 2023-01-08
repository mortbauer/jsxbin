const fs = require( 'fs' )
const {convertContent} = require('./convertScripts.js');
const args = JSON.parse(process.argv[2]);
const res =convertContent(args.content,args.scriptPath);
fs.writeFileSync( args.output, res );
