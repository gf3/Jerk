var sys = require( 'sys' )
  , path = require( 'path' )
  , fs = require( 'fs' )
  , IRC

/* ------------------------------ Init ------------------------------ */
require.paths.unshift( path.join( __dirname, '..', 'node_modules' ) )
IRC = require( 'irc-js' )

/* ------------------------------ Jerk ------------------------------ */
var Jerk = new ( function Jerk() {
  var bot
    , watchers = []
    , connect = _connect.bind(  this )
    , watch_for = _watch_for.bind(  this  )


  /* ------------------------------ Public Methods ------------------------------ */
  this.addWatchers = function( block ) {
    block( { watch_for: watch_for } )
    return { connect: connect }
  }

  /* ------------------------------ Private Methods ------------------------------ */
  function _connect( options ) { var i
    bot = new IRC( options || {} )
    bot
      .addListener( 'privmsg', _receive_message.bind( this ) )
      .connect( function(){
        setTimeout( function() {
          // Join channels
          if ( Array.isArray( bot.options.channels ) )
            for ( i = 0; i < bot.options.channels.length; i++ )
              this.join( bot.options.channels[i] )
        }.bind( this ), 15000 )
      })
    
    return { say:     _privmsg_protected.bind( this )
           , action:  _bot_do( function( to, msg ) { return bot.privmsg( to, '\001ACTION ' + msg + '\001' ) } ).bind( this )
           , part:    _bot_do( 'part' ).bind( this )
           , join:    _bot_do( 'join' ).bind( this )
           , quit:    _bot_do( 'quit' ).bind( this )
           }
  }

  function _watch_for( pattern, hollaback ) {
    watchers.push( [ pattern, hollaback ] )
  }

  function _receive_message( message ) {
    var i = watchers.length
      , source = message.params[0] == bot.options.nick ? message.person.nick : message.params[0]
      , text = message.params.slice( -1 ).toString()
      , md

    while ( i-- )
      // If a match is found
      if ( md = text.match( watchers[i][0] ) )
        watchers[i][1](
          { say: _privmsg_protected.bind( this, source )
            msg: _privmsg_protected.bind( this, message.person.nick )
          , match_data: md
          , user: message.person.nick
          , source: source
          , text: message.params.slice( -1 )
          }
        )
  }

  function _bot_do( what ) {
    if ( typeof what === "string" )
      return function() { return bot[what].apply( bot, arguments ) }
    else
      return what
  }

  function _privmsg_protected( receiver, msg ) {
    return bot.privmsg( receiver, msg, true )
  }

})()

/* ------------------------------ Package Info ------------------------------ */
fs.readFile( path.join( __dirname, '..', 'package.json' ), function( err, data ) {
  if ( err )
    throw err
  else
    Jerk.info = JSON.parse(  data  )
})

/* ------------------------------ EXPORTS ------------------------------ */
module.exports = Jerk.addWatchers

