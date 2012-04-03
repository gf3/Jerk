var jerk = require( '../lib/jerk' ), util = require('util');
var options =
  { server: 'localhost'
  , port: 6667
  , nick: 'Bot9121'
  , channels: [ '#jerkbot' ]
  };

jerk( function( j ) {
  j.watch_for( 'soup', function( message ) {
    message.say( message.user + ': soup is good food!' )
  });

  j.watch_for( /^(.+) are silly$/, function( message ) {
    message.say( message.user + ': ' + message.match_data[1] + ' are NOT SILLY. Don\'t joke!' )
  });

  j.user_join(function(message) {
    message.say(message.user + ": Hey, welcome!");
  });

  j.user_leave(function(message) {
    util.puts("User: " + message.user + " has left");
  });
}).connect( options );

