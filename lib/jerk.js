var sys = require('sys'),
    Class = require("../vendor/IRC/lib/irc"),
    DEBUG = true;

/* ------------------------------ MISCELLANEOUS ------------------------------ */
Function.prototype.bind = (function() {
  var _slice = Array.prototype.slice;
  return function(context) {
    var fn = this,
        args = _slice.call(arguments, 1);
    
    if (args.length) { 
      return function() {
        return arguments.length
          ? fn.apply(context, args.concat(_slice.call(arguments)))
          : fn.apply(context, args);
      }
    } 
    return function() {
      return arguments.length
        ? fn.apply(context, arguments)
        : fn.call(context);
    }; 
  }
})();

/* ------------------------------ Jerk ------------------------------ */
var Jerk = new (function Jerk() {
  var bot = new Class.IRC(),
      watchers = [];
  
  bot.addListener("privmsg", _receive_message.bind(this));
  
  /* ------------------------------ Public Methods ------------------------------ */
  this.addWatchers = function(block) {
    var utils = {watch_for: _watch_for.bind(this)};
    
    block(utils);
    
    return {connect: _connect.bind(this)};
  };
  
  /* ------------------------------ Private Methods ------------------------------ */
  function _connect(options) {
    if (!!options) process.mixin(bot.options, options);
    bot.connect(function(){
      // Join channels
      if (!!bot.options.channels && bot.options.channels instanceof Array) {
        for (var i = 0; i < bot.options.channels.length; i++) this.join(bot.options.channels[i]);
      }
    });
  }
  
  function _watch_for(pattern, hollaback) {
    watchers.push([pattern, hollaback]);
  }
  
  function _receive_message(message) {
    var i = watchers.length;
    while (i--) {
      var md, text = message.params.slice(-1).toString(), source = message.params[0];
      
      // If a match is found
      if (md = text.match(watchers[i][0])) {
        var utils = {
          say: _say.bind(this, source),
          match_data: md,
          user: message.person.nick,
          channel: source,
          text: message.params.slice(-1)
        };
        
        watchers[i][1](utils);
        
        break; // Exit after first match
      }
    }
  }
  
  function _say(to, msg) {
    bot.privmsg(to, msg);
  }
})();

/* ------------------------------ EXPORTS ------------------------------ */
exports.jerk = Jerk.addWatchers;
