---
title: JavaScript in University
layout: post
author: Jan Monschke
published: false
---

When I started my Master's studies at HTW Berlin in 2011 I was already fully web-focused. All my side-projects and freelance jobs where web-related. Even my Bachelor Thesis was 100% web.
I came to HTW Berlin in order to focus even more on web technology since they're offering a web-specilization in their [Master's programme](http://htw-berlin.de).

Unluckily, the professor, who was mainly doing all the web courses, got an offer from another university and went away before I came to Berlin. So that I only had  substitutional profs in almost all web courses.

In general I was surprised by how few we had to code in the web-courses. In half of them we even didn't have to code at all: Didactics and Media Engineering (I still don't understand why they chose these courses for web students…). So I ended up having to bring Javascript into my studies on my own.

### JavaScript the silver bullet

The non-web courses, on the other handy, were completely different. We had to code a lot and in many different languages (Java, C#, C++). Even though we were always supposed to solve the tasks in specific languages, we could always argue the profs to let us use the language of our choice. 

In 'Programming' we started off with C++ and had to solve some maximum substring-matching problem in DNA-strings. I have to admit that I suck at C++. To me, all the pointer and referencing stuff always stands in the way and I find it hard to concentrate on the main problem.

I was lucky to have [@mrflix](http://twitter.com/mrflix) in my team in that course (actually we were flat mates at that time) so that it was not only me suffering from C++ ;). Instead of struggling with the lack of C++-skills, both coming from a web-background, we immediately started to implement the algorithm in JavaScript and it took us just some hours to get very good results. Unfortunately we were forced to provide a C++ solution to the problem but it didn't take us long from a working JavaScript solution to a working C++ solution. Once we had an idea how to tackle the problem and we were able to formulate the problem in a language we were fluent in, it was all much easier for us.

It was not the last time we were using JavaScript in that course. The last task was to develop a GUI-project in C# and we came up with the idea of creating an Instapaper client. The Instapaper API was easy to use and also C# as a language wasn't as bad as we expeceted it to be (once we'd found out about delegates and all that nice stuff ;) ). But there was one thing that really simply refused to work: OAuth!

##### JavaScript to the rescue

None of the C#-OAuth libraries we found created the correct hashes for the Instapaper API and we almost gave up. Since I worked with OAuth before in JavaScript I had the idea to somehow do the hashing with a JavaScript library. But it's not as easy to run JavaScript in C# as we thought, so we came up with a little hack. The .NET framework provides as WebView element which is able to display HTML pages and run the JavaScript they contain. Now everytime we had to create new hashes we rendered the WebView, injected the necessary information into it, called our little OAuth-script which then returned the correct hashes. ([OAuthHelper.cs](https://github.com/janmonschke/InstaBlitz/blob/master/InstaBlitz/OAuthHelper.cs),  [oauth-signature.html](https://github.com/janmonschke/InstaBlitz/blob/master/InstaBlitz/htmlshizzle/oauth-signatur-manizzle.html))

After trying to make it work with one of the bloated and complicated C# libraries, it took us only an hour and ~20 lines of JavaScript with the WebView hack. Want to try the hack for yourself? We published the InstaPaper client on Github: [https://github.com/janmonschke/InstaBlitz](https://github.com/janmonschke/InstaBlitz) (We haven't touched the code for a year now, so no guarantee that it's still working) 

#### Canvas for Image Processing

### The good parts

- Simon Jockers
- Web Applications -> own project
- master's project -> own project