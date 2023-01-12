const fs = require( 'fs' )
const {convertContent} = require('./convertScripts.js');
const args = JSON.parse(process.argv[2]);
const content = fs.readFileSync(args.input,{encoding:'utf-8'})
const res =convertContent(content,args.scriptPath);
fs.writeFileSync( args.output, res );
