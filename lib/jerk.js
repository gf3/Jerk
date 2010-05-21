var sys = require('sys')
  , IRC = require('../vendor/IRC/lib/irc')
  , DEBUG = true
  ;

require('../vendor/utools/lib/utools');

/* ------------------------------ Jerk ------------------------------ */
var Jerk = new (function Jerk() {
  var bot
    , watchers = []
    , connect = _connect.bind(this)
    , watch_for = _watch_for.bind(this)
    ;


  /* ------------------------------ Public Methods ------------------------------ */
  this.addWatchers = function(block) {
    block({ watch_for: watch_for })
    return { connect: connect }
  }

  /* ------------------------------ Private Methods ------------------------------ */
  function _connect(options) {
    bot = new IRC(options || {})
    bot
      .addListener('privmsg', _receive_message.bind(this))
      .addListener('privmsg', _temp.bind(this)) // TEMP
      .connect(function(){
        setTimeout(function() {
          // Join channels
          if (!!bot.options.channels && bot.options.channels instanceof Array)
            for (var i = 0; i < bot.options.channels.length; i++)
              this.join(bot.options.channels[i])
        }.bind(this), 15000)
      })
  }

  function _temp (message) {
    sys.puts('[RECV] ' + message.person.nick + ': ' + message.params)
  }

  function _watch_for(pattern, hollaback) {
    watchers.push([pattern, hollaback])
  }

  function _receive_message(message) {
    var i = watchers.length
      , source = message.params[0] == bot.options.nick ? message.person.nick : message.params[0]
      , text = message.params.slice(-1).toString()
      , md

    while (i--) {
      // If a match is found
      if (md = text.match(watchers[i][0]))
        watchers[i][1](
          { say         : _say.bind(this, source)
          , match_data  : md
          , user        : message.person.nick
          , source      : source
          , text        : message.params.slice(-1)
          }
        )
    }
  }

  function _say(to, msg) {
    bot.privmsg(to, msg)
  }
})()

/* ------------------------------ EXPORTS ------------------------------ */
module.exports = Jerk.addWatchers
