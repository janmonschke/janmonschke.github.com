---
title: JavaScript in University
layout: post
author: Jan Monschke
---

This is a post about my personal opinion of how underrated web development is in universities at the moment. It represents only what I experienced in my Bachelor (Düsseldorf, Germany) and Master (Berlin, Germany) studies. Maybe the status quo is different in other universities, maybe it is the same everywhere else, I simply don't know. But I don't want it to stay like that.

_If you experienced something completely different or if you are in the same situation, please let me know in the comments (far ;) ) below._

--------

When I started my Master's studies at HTW Berlin in 2011 I was already fully web-focused. All my side-projects and freelance jobs where web-related. Even my [Bachelor Thesis](https://github.com/janmonschke/Bachelor-Thesis/raw/master/Design%20and%20Implementation%20of%20a%20web-based%20platform%20to%20present%20designer-portfolios_CP.pdf) was 100% web and I tried to do as many web courses.
I came to HTW Berlin in order to focus even more on web technology since they're offering a web-specialization in their [Master's program](http://imi-master.htw-berlin.de/informieren/).

Unluckily, the professor, who was mainly doing all the web courses, got an offer from another university and went away before I came to Berlin. As a result we had substitute professors in most of the web courses.

In general I was surprised by how few we had to code in the web-courses. In half of them we even didn't have to code at all: Didactics and Media Engineering (I still don't understand why they chose these courses for web students…). So I ended up having to bring JavaScript and other Web Technologies into my studies on my own.

### JavaScript the silver bullet

The non-web courses, on the other hand, were completely different. We had to code a lot and in many different languages (Java, C#, C++). Even though we were always supposed to solve the tasks in specific languages, we could always argue the profs to let us use the language of our choice. 

In 'Programming' we started off with C++ and had to solve some maximum substring-matching problem in DNA-strings. I have to admit that I suck at C++. To me, all the pointer and referencing stuff always stands in the way and I find it hard to concentrate on the main problem.

I was lucky to have Felix ([@mrflix](http://twitter.com/mrflix)) in my team in that course (actually we were flat mates at that time) so that it was not only me suffering from C++ ;). Instead of struggling with the lack of C++-skills, both coming from a web-background, we immediately started to implement the algorithm in JavaScript and it took us just some hours to get very good results. Unfortunately we were forced to provide a C++ solution to the problem but it didn't take us long from a working JavaScript solution to a working C++ solution. Once we had an idea how to tackle the problem and we were able to formulate the problem in a language we were fluent in, it was all much easier for us.

It was not the last time we were using JavaScript in that course. The last task was to develop a GUI-project in C# and we came up with the idea of creating an Instapaper client. The Instapaper API was easy to use and also C# as a language wasn't as bad as we expected it to be (once we'd found out about delegates and all that nice stuff ;) ). But there was one thing that really simply refused to work: OAuth!

##### JavaScript to the rescue

None of the C#-OAuth libraries we found created the correct hashes for the Instapaper API and we almost gave up. Since I worked with OAuth before in JavaScript I had the idea to somehow do the hashing with a JavaScript library. But it's not as easy to run JavaScript in C# as we thought, so we came up with a little hack. The .NET framework provides as WebView element which is able to display HTML pages and run the JavaScript they contain. Now every time we had to create new hashes we rendered the WebView, injected the necessary information into it, called our little OAuth-script which then returned the correct hashes. ([OAuthHelper.cs](https://github.com/janmonschke/InstaBlitz/blob/master/InstaBlitz/OAuthHelper.cs),  [oauth-signature.html](https://github.com/janmonschke/InstaBlitz/blob/master/InstaBlitz/htmlshizzle/oauth-signatur-manizzle.html))

After trying to make it work with one of the bloated and complicated C# libraries, it took us only an hour and ~20 lines of JavaScript with the WebView hack. Want to try the hack for yourself? We published the InstaPaper client on Github: [https://github.com/janmonschke/InstaBlitz](https://github.com/janmonschke/InstaBlitz) (We haven't touched the code for a year now, so no guarantee that it's still working. Also the OAuth-keys have expired.) 

### Canvas > Java

Two other courses in which the profs were open to JavaScript were 'Image Processing' and 'Computer Vision'. Typically all tasks would have been solved with Java and in some special cases in C#, but the prof never had students who wanted to solve it in JavaScript. Also he thought it could not be done in JavaScript completely since it needed a lot of CPU power and also access to raw image data (he didn't know that you can now access raw image data using canvas).

The goal of the 'Image Processing' course was to write a program that could vectorize an input image. Each task during the semester would add a new step to the process so that we'd have the complete algorithm by the end of the semester.

[![Binarization](http://f.cl.ly/items/1K2c3P3j3o2e3K463l0p/Screen%20Shot%202013-01-07%20at%2012.11.47%20AM.png)](http://janmonschke.com/Image-Processing-with-HTML5-Canvas/Ue01-Monschke-Jan)

Above you see the first exercise, two simple binarization algorithms for images.

It was a fun course because it was something I never did before in my Bachelor studies. Also it felt like very low-level development, although all the code was written in JavaScript (or in my case in CoffeeScript). Sadly, I stopped doing the exercises in CoffeeScript after some time because my prof didn't like its syntax and already had a hard time to understand JavaScript. For the last exercises I switched to Java afterwards, which also was a _fun_ experience after so many years with Ruby, JS, Python and CoffeeScript ;)

### Canvas Filters

'Computer Vision' also was a course that dealt with calculations on image data and its aim was to write algorithms that could detect objects semantically in images. E.g. it should say that there's a duck on the image if you'd show it an image of a duck swimming in a pond.

[![Edge detection](http://f.cl.ly/items/2H2W453C333r2Z342u1C/Screen%20Shot%202013-01-06%20at%2011.46.41%20PM.png)](http://janmonschke.com/ComputerVision/01_Edge_Detection)

Above you see the first exercise, the first steps towards edge detection with different filters.

I was able to use typed-Arrays in JavaScript for the first time, before that I barely knew about them and I was pretty amazed by how much faster they made the whole application.

## The bad parts

In general I have to say that I'm disappointed by the lack of coding in web courses and that lack of knowledge about current web technology in courses like 'Web Applications'. A Master course that teaches the basics of PHP, HTML, CSS and almost no JavaScript. In my opinion this is way too basic for a Master course and the knowledge of these things should be requirement in order to enroll in a Master's web course.

I don't want to repeat myself or rage about the negative parts here, they're all mentioned above, so let's switch to the __good parts:__

## The good parts

Despite my disappointment, my overall 'Master experience' is positive. I was able to learn new things by using JavaScript in fields which it wasn't (originally) designed for. I may not have been able to program web stuff in the web courses, but therefore I did it even more in the other courses and in project-courses, where students can choose projects on their own. Currently I'm working on a huge web project with Felix in cooperation with [Transparency International](http://transparency.org) and [HTW Berlin](http://htw-berlin.de). We were given the chance to completely decide on the development stack with maximum freedom which led to our first mid-scale node.js project with a Backbone.js frontend. (More info on the project when it's done ;) ). 

But still, the status quo is very unsatisfying and I don't want future-students to experience the same disappointing web courses. In summer 2012 I met Simon ([@sjockers](https://twitter.com/sjockers)), who was at that time a Master student and Bachelor lecteror at the same time, teaching web development to Bachelor students. After some [Berlin.js](http://berlinjs.org) meetups, he came up with the idea to make an own uni course which should be specifically for all web-interested students.

The idea for the course spread quickly among the web students at my uni and in our first meeting, right before a Berlin.js meetup of course, we laid down the foundation for the course by [brainstorming topics](https://gist.github.com/4170211) and discussing organizational stuff. Even though we did not announce anything in uni, 8 students showed up, who were all eager to change something. According to the great feedback we got after the meeting, it looks like JavaScript will have a bright future at (our) university. Simon convinced a professor to allow us to create an additional course in the next semester, the first step is done! :)

The key is, that as a student you have the freedom to choose __what__ you learn and, more importantly, __how__ you learn it. Of course, it's always easier to just stick to the agenda and do what the profs say. But the benefits of going your own way are worth every extra-hour spent! There is so much more to learn which is not in the curriculum!