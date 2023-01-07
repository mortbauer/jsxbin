// invoke with node src/convertScriptsCMD.js test.jsx - test.jsxbin
const convertScripts = require('./convertScripts.js');
const args = process.argv.slice(2);
const split_pos = args.findIndex((item)=>item === '-');
convertScripts(args.slice(0,split_pos),args.slice(-1*(args.length - split_pos -1)))
