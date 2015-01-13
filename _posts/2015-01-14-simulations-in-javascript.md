---
title: Simulations in JavaScript
layout: post
author: Jan Monschke
draft: true
---

## Deep Space

https://www.youtube.com/watch?v=0HJPilemNns
http://simonswain.com/deepspace/

## Complex Systems

Vince Allen started his talk by introducing the audience to a very unique technique to render pixels onto a website. A technique which doesn't make use of canvas, images or SVG. He uses a `single DIV element` to program very complex animations by manipulating the element's `box-shadow` property. A box shadow can be manipulated in a way so that it has the `shape of a square` at an arbitrary position with arbitrary properties such as color and blur. In addition to that, DIV elements can have an arbitrary amount of box-shadow declarations which allows to display several squares on a webpage although the page's body only contains one DIV element.

Vince doesn't stop there and uses this rendering technique to visualize various simulations he created.

The first one is a simulation of a tornado that he creates from very simple core elements such as a base and a spine. The tornado's movement and the spine are both generated from the [Perlin noise](http://en.wikipedia.org/wiki/Perlin_noise) algorithm which creates 'natural' random values. Different variations of the simulation show how a very natural effect and truly beautiful visualizations can result from a simple rendering technique and a simple random number generator.

[![Tornado visualization](/images/simulations/tornado.jpg)](/images/simulations/tornado.jpg)

Vince then shows two more demos: an alternative version of the sheep vs. wolf simulation [(22:21)](https://www.youtube.com/watch?v=mrxsD0mCpZ4#t=1341) which Simon showed as well and a termite simulation [(27:12)](https://www.youtube.com/watch?v=mrxsD0mCpZ4#t=1632). Both of them are based on the concept of [Braitenberg vehicles](http://en.wikipedia.org/wiki/Braitenberg_vehicle), 'vehicles' that only consist of a sensor and a motor. Stimulation of the sensor (or alternatively the sensors) leads to a reaction of the motor. The resulting new position towards other objects then creates a new stimulation of the sensor which will again create a reaction of the motor. These two elementary concepts lead in interesting visualizations. Especially when the sheep/wolf demo is enhanced by another entity, Zombies [(23:55)](https://www.youtube.com/watch?v=mrxsD0mCpZ4#t=1435):

[![Sheep, Wolves and Zombies](/images/simulations/sheep-wolves-and-zombies.jpg)](/images/simulations/sheep-wolves-and-zombies.jpg)

Just as a reminder: The above demos are also rendered as multiple box-shadows of only a single div-element.

[![Photoshop and JavaScript](/images/simulations/photoshop-and-js.jpg)](/images/simulations/photoshop-and-js.jpg)

Another outstanding element of Vince's talk is that he uses Photoshop to render videos of his simulations. In this way he can create HD-quality videos with realistic motion blur and shallow depth of field. He uses node.js to feed Adobe Generator with positional data from each frame of the visualization. Adobe Generator then creates high-resolution Photoshop images from that data. Those images can then be concatenated into a video [(17:14)](https://www.youtube.com/watch?v=mrxsD0mCpZ4#t=1034). Oh, and did I mention that he uses the Web Audio API for atmospheric background noise generation? ;) His noise library is called Soundbed and can be found on [Github](https://github.com/vinceallenvince/soundbed).

https://www.youtube.com/watch?v=mrxsD0mCpZ4
http://vinceallenvince.github.io/jsasia2014/

- zombie vs sheep equlibrium, beautiful visuals