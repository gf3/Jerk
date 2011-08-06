var jerk = require( '../lib/jerk' ), sys=require('sys');
var bot
var options =
  { server: 'localhost'
  , port: 6667
  , nick: 'Bot9121'
  , channels: [ '#jerkbot' ]
  , onConnect: function() { bot.say('#jerkbot', 'Hello Everybody!') }
  };

bot = jerk( function( j ) {
  j.watch_for( 'soup', function( message ) {
    message.say( message.user + ': soup is good food!' )
  });

  j.watch_for( /^(.+) are silly$/, function( message ) {
    message.say( message.user + ': ' + message.match_data[1] + ' are NOT SILLY. Don\'t joke!' )
  });

  j.user_nick_change(function(message) {
    message.say("You were "  + message.user + ", but you are now " + message.text );
  });  

  j.user_join(function(message) {
    message.say(message.user + ": Hey, welcome!");
  });

  j.user_leave(function(message) {
    sys.puts("User: " + message.user + " has left");
  });
}).connect( options );

