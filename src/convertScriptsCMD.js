const convertScripts = require('./convertScripts.js');
const args = JSON.parse(process.argv[2])
convertScripts(args.input,args.output)
