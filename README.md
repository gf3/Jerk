# Jerk

A fun little IRC bot library for node.js. Ridiculously simple to set-up and get going!

## OHMYGOD

Seriously, it's stupidly simple.

### You First Bot

Firstly, we're gonna have to clone us some Jerk. So let's do that:

    git clone git://github.com/gf3/Jerk.git && cd Jerk && git submodule init && git submodule update

Hoo haa, now that we're locked and loaded, let's write a goddamn bot! We need to include Jerk:

    process.mixin(GLOBAL, require("../path/to/Jerk/lib/jerk"));

Now you'll need some `options`. Jerk takes the exact same options object as the [IRC-js library](http://github.com/gf3/IRC-js/). Let's just go ahead and supply some basic info:

    var options = {
      server: "irc.freenode.net",
      nick: "YourBot9001",
      channels: ["#your-channel"]
    };

Hah, now you're going to cry once you see how easy this is:

    jerk(function(j) {
      
      j.watch_for("soup", function(message) {
        message.say(message.user + ": soup is good food!");
      });
      
      j.watch_for(/^(.+) are silly$/, function(message) {
        message.say(message.user + ": " + message.match_data[1] + " are NOT SILLY. Don't joke!");
      });
      
    }).connect(options);

Really. That's it.

The jerk object (`j`) has only one method: `watch_for`. Which takes two arguments, the first can be either a string or a regex to match messages against. The second argument is your hollaback function for when a match is found. The hollaback receives only one argument, the `message` object. It looks like this:

    {
      user: String,
      channel: String,
      match_data: Array,
      say: Function
    }

I think everything there is pretty self-explanatory, no? One thing I will tell you though, is the `say` method is smart enough to reply to the context that the message was received, so you don't need to pass it any extra info, just a reply :)

### Running Your Bot

    node yourBot9001.js

Done.

### A Better Example

Here's a more practical example, meet [protobot](http://github.com/gf3/protobot/blob/master/protobot.js). Protobot hangs out on [Freenode#prototype](irc://irc.freenode.net/prototype) all day &ndash; stop by and say hi!

## Credit & Junk

Written by [Gianni Chiappetta](http://github.com/gf3) &ndash; [gf3.ca](http://gf3.ca)

I don't want to throw a license on this unless I really have to, they're kinda silly. However you can expect this code to remain free and open.

