const exec = require( 'child_process' ).exec

const archive = `esdebugger-core-${process.platform === 'darwin' ? 'mac' : 'win'}.tar.gz`
exec( `tar -xzf ${archive}` )
if (process.platform === 'linux'){
  console.log('please make sure you have a working wine executeable in your path\n and the windows node.exe downloaded \n and the environment variable NODE_EXE pointing to it')
}
