var path = require( 'path' )
  , fs = require( 'fs' )
  , util = require('util')
  , IRC
  , Jerk
  , globalCache = {}

/* ------------------------------ Init ------------------------------ */
require( './strftime' )
IRC = require( 'irc-js' )

/* ------------------------------ Channel ------------------------------ */
function Channel ( chan, clients ) {
  this.toString = function toString () {
    return chan
  }

  Object.defineProperty( this,
                         "clients",
                         { enumerable: true
                         , configurable: false
                         , get: function(){
                             return Object.keys( clients )
                           }
                         })
}

/* ------------------------------ Jerk ------------------------------ */
Jerk = new ( function Jerk() {
  var bot
    , watchers = []
    , join_watchers = []
    , leave_watchers = []
    , clients = {}
    , connect = _connect.bind( this )
    , watch_for = _watch_for.bind( this )
    , user_join = _user_join.bind( this )
    , user_leave = _user_leave.bind( this )

  /* ------------------------------ Public Methods ------------------------------ */
  this.addWatchers = function( block ) {
    block( { watch_for: watch_for, user_join: user_join, user_leave: user_leave } )
    return { connect: connect }
  }

  /* ------------------------------ Private Methods ------------------------------ */
  function _connect( options ) {
    bot = new IRC( options || {} )
    bot
      .on( 'privmsg', _receive_message.bind( this ) )
      .on( 'join', _user_joined.bind( this ) )
      .on( 'part', _user_leaving.bind( this ) )
      .on( 'quit', _user_leaving.bind( this ) )
      .on( '353', _channel_clients.bind( this ) )
      .on( 'error', function( message ) {
        console.log( 'There was an error! "' + message.params[0] + '"' )
        this.disconnect().connect( _on_connect.bind( this ) )
      })
      .connect( _on_connect.bind( bot ) )
    return { say:     _privmsg_protected.bind( this )
           , forget: _forget.bind( this )
           , action:  _bot_do( function( to, msg ) { return bot.privmsg( String( to ), '\001ACTION ' + msg + '\001' ) } ).bind( this )
           , part:    _bot_do( 'part' ).bind( this )
           , join:    _bot_do( 'join' ).bind( this )
           , quit:    _bot_do( 'quit' ).bind( this )
           }
  }

  function _on_connect() {
    if ( this.options.waitForPing )
      this.once( 'ping', justDoIt )
    else
      justDoIt.call( this )

    function justDoIt () {
      setTimeout( function() {
        // Join channels
        var i
        if ( Array.isArray( this.options.channels ) )
          for ( i = 0; i < this.options.channels.length; i++ )
             this.join.apply( this, this.options.channels[i].split(':') )

        // Call onConnect callback
        if ( this.options.onConnect )
          this.options.onConnect()
      }.bind( this ), this.options.delayAfterConnect || 1000 )
    }
  }

  function _watch_for( pattern, hollaback ) {
    watchers.push([ pattern, hollaback ])
  }

  function _user_join( hollaback ) {
    join_watchers.push( hollaback )
  }

  function _user_leave( hollaback ) {
    leave_watchers.push( hollaback )
  }

  function _receive_message( message ) {
    var i = watchers.length
      , md

    while ( i-- )
      if ( typeof watchers[i] != 'undefined' && ( md = message.params.slice( -1 ).toString().match( watchers[i][0] ) ) )
        watchers[i][1]( _make_message( message, md ) )
  }

  function _user_joined( message ) {
    if ( message.person.nick == bot.options.nick )
      return

    if ( ! clients[ message.params[0] ] )
      clients[ message.params[0] ] = {}

    // Add user to client cache
    clients[ message.params[0] ][ _normalize_nick( message.person.nick ) ] = true

    var i = join_watchers.length

    while ( i-- )
      join_watchers[i]( _make_message( message ) )
  }

  function _user_leaving( message ) {
    if ( message.person.nick == bot.options.nick )
      return

    // Remove user from clients cache
    var nick = _normalize_nick( message.person.nick )
    if ( message.command == 'part' )
      delete clients[ message.params[0] ][ nick ]
    else
      Object.keys( clients ).forEach( function( chan ) {
        var client
        for ( client in clients[ chan ] )
          if ( client == nick )
            delete clients[ chan ][ nick ]
      })

    var i = leave_watchers.length

    while ( i-- )
      leave_watchers[i]( _make_message( message ) )
  }

  function _channel_clients ( message ) {
    if ( ! clients[ message.params[2] ] )
      clients[ message.params[2] ] = {}

    message.params[3].split(" ").forEach( function( client ) {
      client = _normalize_nick( client )
      clients[ message.params[2] ][ client ] = true
    })
  }
  
  function _bot_do( what ) {
    if ( typeof what === 'string' )
      return function() { return bot[what].apply( bot, arguments ) }
    else
      return what
  }

  function _privmsg_protected( receiver, msg ) {
    return bot.privmsg( String( receiver ), msg, true )
  }

  function _forget( pattern ) {
    var i, l, pattern = String( pattern )
    for ( i = 0, l = watchers.length; i < l; i++ )
      if ( pattern == String( watchers[i][0] ) )
        delete watchers[i]
  }

  function _to_string() {
    return new Date().strftime( '[%H:%M]' ) + ' <' + this.user + '> ' + this.text
  }

  function _make_message ( message, md ) {
    var source
    if ( message.params[0] == bot.options.nick ) 
      source = message.person.nick
    else
      source = new Channel( message.params[0], clients[ message.params[0] ] )

    return true,
      { say:        _privmsg_protected.bind( this, source )
      , msg:        _privmsg_protected.bind( this, message.person.nick )
      , match_data: md || []
      , user:       message.person.nick
      , source:     source
      , text:       message.params.slice( -1 )
      , toString:   _to_string
      }
  }

  function _normalize_nick ( nick ) {
    switch ( nick[0] ) {
      case '~':
      case '&':
      case '@':
      case '+':
        return nick.slice(1)
      default:
        return nick
    }
  }

})()

/* ------------------------------ Package Info ------------------------------ */
fs.readFile( path.join( __dirname, '..', 'package.json' ), function( err, data ) {
  if ( err )
    throw err
  else
    Jerk.info = JSON.parse( data )
})

/* ------------------------------ EXPORTS ------------------------------ */
module.exports = Jerk.addWatchers

