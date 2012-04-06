var jerk = require( '../lib/jerk' ), util = require('util');
var options =
  { server: 'localhost'
  , port: 6667
  , nick: 'Bot9121'
  , channels: [ '#jerkbot' ]
  };

jerk( function( j ) {
  j.watch_for( 'cake', function( message ) {
    var out = 'Cake is a lie!'
      , channel = message.source;
    for ( client in channel.clients ) {
      if ( 'GlaDOS' == channel.clients[client] ) {
        out = 'psst, I have something to tell you but I can\'t say it while GlaDOS is in ' + String(channel);
      }
    }
    message.say( message.user + ': ' + out );
  });
}).connect( options );

