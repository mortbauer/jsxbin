const path = require( 'path' )
const fs = require( 'fs' )
const log = require( './logger' )

function GetESDInterface() {
	const platform = `${process.platform}`
	const platformArch = `${process.arch}`
	let esdinterface
	if ( platform === 'darwin' ) {
		esdinterface = require( '../esdebugger-core/mac/esdcorelibinterface.node' )
	} else if ( platform === 'win32' ) {
		if ( platformArch === 'x64' || platformArch === 'arm64' ) {
			esdinterface = require( '../esdebugger-core/win/x64/esdcorelibinterface.node' )
		} else {
			esdinterface = require( '../esdebugger-core/win/win32/esdcorelibinterface.node' )
		}
	} else if ( platform === 'linux' ) {
		if ( platformArch === 'x64' || platformArch === 'arm64' ) {
			esdinterface = require( '../esdebugger-core/win/x64/esdcorelibinterface.node' )
		} else {
			esdinterface = require( '../esdebugger-core/win/win32/esdcorelibinterface.node' )
		}
  }

	if ( esdinterface === undefined ) {
		throw new Error( `Platform not supported: ${platform}` )
	}

	return esdinterface
}

function getESDError() {
	const error = GetESDInterface().esdGetLastError()
	let message = 'unknown'
	if ( error.status !== 0 && error.data ) {
		message = error.data
	}
	throw new Error( `Error with ESTK: '${message}'` )
}

function convertContent(content,scriptPath){
    initializeESDInterface()
	  const includePath = path.dirname( scriptPath )
    const content_clean = content.replace( /^\uFEFF/, '' )
    if (content_clean){
      const apiData = GetESDInterface().esdCompileToJSXBin( content, scriptPath, includePath )
      log.debug( 'Convert response', { apiData })
      if ( apiData.status === 0 ) {
        return apiData.data
      }
      getESDError()
    }
}

function convertFileContents( scriptPath ) {
	let content
	try {
		content = fs.readFileSync( scriptPath ).toString()
	} catch ( error ) {
		log.error( error )
		return null
	}

	if ( content ) {
    return convertContent(content,scriptPath)
	}

}

let initialized = false

function initializeESDInterface() {
	if ( !initialized ) {
		const initData = GetESDInterface().esdInit()
		if ( initData.status === 0 ) {
			initialized = true
		} else {
			getESDError()
		}
	}
}
function convertScripts( input, output ) {
    log.verbose( 'Converting', { input, output })
    initializeESDInterface()
    for ( let i = 0; i < input.length; i++ ) {
      const scriptPath = input[i]
      const outputPath = output[i]
      const compiledContent = convertFileContents( scriptPath )
      if ( compiledContent ) {
        log.verbose( 'Writing', { outputPath, compiledContent })
        fs.writeFileSync( outputPath, compiledContent )
      } else {
        log.warn( `No compiled content found for '${scriptPath}'. Skipping.` )
      }
    }
  }

module.exports = {
  convertScripts: convertScripts,
  convertContent: convertContent,
}
