# Jerk

A fun little IRC bot library for node.js. Ridiculously simple to set-up and get going!

## OHMYGOD

Seriously, it's stupidly simple.

### Your First Bot

Firstly, we'll need to grab Jerk. If you use [npm](http://npmjs.org/) it's as easy as:

    npm install jerk

If you prefer straight-up git:

    git clone git://github.com/gf3/Jerk.git

Hoo haa, now that we're locked and loaded, let's write a goddamn bot! We need to include Jerk:

```javascript
var jerk = require( 'jerk' )
```

You'll need some `options`. Jerk takes the exact same options object as the [IRC-js library](https://github.com/gf3/IRC-js/). Let's just go ahead and supply some basic info:

```javascript
var options =
  { server: 'irc.freenode.net'
  , nick: 'YourBot9001'
  , channels: [ '#your-channel' ]
  }
```

Hah, now you're going to cry once you see how easy this is:

```javascript
jerk( function( j ) {

  j.watch_for( 'soup', function( message ) {
    message.say( message.user + ': soup is good food!' )
  })

  j.watch_for( /^(.+) are silly$/, function( message ) {
    message.say( message.user + ': ' + message.match_data[1] + ' are NOT SILLY. Don't joke!' )
  })

}).connect( options )
```

Really. That's it.

### ADVANCED USER OF THE INTERNETS

The jerk object (`j`) has only one method: `watch_for`. Which takes two arguments, the first can be either a string or a regex to match messages against. The second argument is your hollaback function for when a match is found. The hollaback receives only one argument, the `message` object. It looks like this:

```javascript
{ user:       String
, source:     String
, match_data: Array
, say:        Function( message )
}
```

One thing I will tell you though, is the `say` method is smart enough to reply to the context that the message was received, so you don't need to pass it any extra info, just a reply :)

The `connect` method returns an object with some handy methods that you can use outside of your `watch_for`s:

```javascript
{ say:    Function( destination, message )
, action: Function( destination, action )
, part:   Function( channel )
, join:   Function( channel )
, quit:   Function( message )
}
```

Example:

```javascript
var superBot = jerk( ... ).connect( options )
// Later...
superBot.say( '#myChan', 'Soup noobs?' )
superBot.join( '#haters' )
superBot.action( '#hates', 'hates all of you!' )
```

I think everything there is pretty self-explanatory, no? 

### Running Your Bot

    node yourBot9001.js

Run your bot on a remote server:

    nohup node yourBot9001.js &

Although I recommend using something like [forever](https://github.com/indexzero/forever) to keep your bot running for a while.

Done.

### A Better Example

Here's a more practical example, meet [protobot](https://github.com/gf3/protobot/blob/master/protobot.js). Protobot hangs out on [Freenode#prototype](irc://irc.freenode.net/prototype) all day &ndash; stop by and say hi!

A few bots using Jerk:

* [Protobot](https://github.com/gf3/protobot)
* [csbot](https://github.com/rdrake/csbot)
* [Codebot](https://github.com/BHSPitMonkey/Codebot)
* Crockbot

Wrote a bot with Jerk? [Email me](mailto:gianni@runlevel6.org) and I'll add it to the list!

## Credit & Junk

Written by [Gianni Chiappetta](https://github.com/gf3) &ndash; [gf3.ca](http://gf3.ca)

Jerk is [UNLICENSED](http://unlicense.org/).

