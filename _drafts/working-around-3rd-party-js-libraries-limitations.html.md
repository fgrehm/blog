---
title: 'An approach for working around 3rd party JS API limitations'
# date: TBD When publishing
tags:
---

I've recently had to integrate with a 3rd party Flash component and the way it
structured it's Javascript API felt really wrong to me. When I went through its
documentation for the first I thought: "Holy crap, how am I going to test this?
How the hell I'm going to use Backbone with this crazy global methods?".

Unfortunately I'm not able to say the name of the product, so I came up with an
imaginary YouTube Flash widget to illustrate to problems I faced during the
project.

https://developers.google.com/youtube/js_api_reference#Events

Lets imagine that the widget allows you to:

* Fetch users tweets
* Search tweets
* Post tweets
* Customize tweet's templates using a function that returns some HTML code

And that this is the JS API they expose:

```javascript
// Sets the mode of the widget ('timeline', 'search' 'newTweet')
Twitter_setMode(mode)
```


* Ability to have multiple instances of the widget on a page



* Metodos globais de callback
* Dispatcher
* Testes com jasmine / backbone / coffee
* Eventos
