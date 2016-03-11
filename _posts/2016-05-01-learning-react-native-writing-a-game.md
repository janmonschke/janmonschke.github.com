---
title: Building a game with React Native - 01 Getting started
layout: post
author: Jan Monschke
draft: true
---

This is a series of posts that I wanted to write for a long time now: How to build a `game` in React Native. It will not be  a massively immersive 3D / VR / FPS game but a simple, addicting, color-matching game. The purpose of these posts is to introduce the reader to React Native development and to force me into writing more 😅.

I don't want to write bore you with uber-long articles, so I will split this series into several posts that will be published with a short delay. Here's the list of all available chapters: 📋

<http://include.chapters>

- this chapter sets up React Native and all dependencies and explains the core concepts of the example app

## The Game

- game mechanics
- original idea (brunch, available for brunch-release)
- take screenshots of your projects
- TV-version

## React Native

At this point you might be thinking: "why the hell does he not use a game engine for this?". And you might be right, I could also use a game engine like Unity and compile it to iOS and Android. Why am I not doing this? Because I think this game is a better example to build a React Native app than all the todo lists out there. It's more than one screen and requires navigation, it covers most basic mobile interface components (lists, buttons...) and we will use the "same" codebase for Android and iOS to see how much code we can share. On top of that, the game mechanics and interactions are simple enough that they don't need a full-fledged game engine to work.

A bit about what React Native actually is: It's a framework that allows you to write **native** applications in JavaScript. Instead of using the native application frameworks, React Native allows you to write your application like any other web-based React application. Most components that you will write will run seamlessly on iOS and Android. But if you want to write platform-specific components, React Native allows you to do that as well and does not stand in your way. No need to context-switch between different platform frameworks or languages. One language for all platforms.

If you have ever built a **native** mobile application before, you might be familiar with the native workflow: write code, compile, sleep(3min), check result, realize that you forgot a minor thing, write code for thing, compile, sleep(3min), check result... *depeneding on your code-size it might take significantly more or less than 3min to compile*

The web workflow is very similar in the sense that web applications are compiled/concatenated as well but it takes significantly less time since changes mostly only need incremental compilations. A refresh of the page takes split seconds and changes can be reviewed. [Hot module replacement](https://gaearon.github.io/react-hot-loader/) even allows you to change components in real time with no refresh needed.

React Native allows you to work on mobile applications with a web-workflow. It supports live-reload AND hot module replacement right out of the box. This increases development speed immensely and allows you to iterate on your mobile app much faster.

I might be biased, but I think React Native has the chance to change mobile app development tremendously and, looking at the talks from this year's ReactConf, I don't seem to be the only one thinking that: <https://www.youtube.com/watch?v=2Zthnq-hIXA>

There is one problem that React Native is not yet solving: building iOS applications on non-Apple devices. If you are using a Windows or a Linux machine you are only able to build Android apps.

## React Native setup

Before we can start, you need to setup a new React Native project. The [official guide](install-guide) is probably the best resource to get you started. Make sure to install **all** dependencies. Meaning: don't forget to also install all iOS and/or Android related dependencies. I know, this step takes quite some time and is not very fun but hey, you only need to do that once and you can use the tools for all your future React Native apps 👌.

Oh, and I can highly recommend to also install `watchman`, one of the optional dependencies. It really sped up the development process a lot behind the scenes. `Flow` is not needed for this course as I'm not using it in my projects...yet 😉.

Once everything is set up, create a new React Native project from the command line: `react-native init ReactNativeGame`. Enjoy your ☕️ break, this command takes ages to finish. If you feel like the command froze, abort it and rerun it with the `--verbose` flag.

When the install process has finished you can start the JavaScript packager (and watcher) with `react-native start`. Then you can run the example project in a phone simulator with either `react-native run-ios` or `react-native run-android`. Again, this command takes some time on first run, because it triggers the native compilation of the application shell (reminder: native compilation takes some time). Luckily this step only needs to be executed once. From then on, you will mostly only need to recompile the JavaScript part of your application. If you have set up the mobile simulators correctly, they should show this screen:

- insert example project screenshot (iOS)

Congratulations, you just ran your first React Native application! 🎉

## Dissecting the example application

Now let's have a look at how this application is actually structured. You should see an `index.ios.js` and an `index.android.js` in your application's root folder. These files are the entry files that run your app on either iOS or Android devices. In fresh projects they don't do much and only show the screen from above.

If you worked on a React project before the structure should look very familiar. At the top of the file we are requiring React components that we need to render in our app (INSERT IMAGE). A `<View />` component is pretty much what we know as a `<div />` in the web world. Same goes for `<Text />` which is similar to `<span />`. Then we define our application's entry-component that simply renders some views and some text (INSERT IMAGE). You might also notice that we are adding style declarations to our elements. These are defined in the stylesheet that we are creating afterwards:

And yes, you might have guessed it already, you can style elements with a very CSS-esque syntax. No need to learn how to style Android or the iOS components. It's plain old CSS. And the usage of Flexbox is recommended. In fact, you can only position elements with Flexbox or using `position: 'absolute'`. Yay, Flexbox!

## Workflow

Now let's get familiar with the React Native workflow. Go ahead and change some of the strings on that screen. On iOS you can refresh the app with `CMD + r` and on Android via the developer menu (press the simulator's menu button). The files are compiled in the background and a refresh will load the new versions. That is pretty much the most basic web workflow. But navigating to the dev menu on Android and hitting `CMD + r` on iOS is already too much work if you're asking me. That's why there is also a live-reload mode in React Native that can be enabled via the dev menu as well (open it with `CMD + d` on iOS). Now the app gets refreshed every time we save a file. Now isn't that handy?

There's one more thing, though. React Native also supports Hot Module Reloading! 🔥 One 'problem' with live-reload is, that every time it is refreshed , the app loses it's state and also navigates back to the index. Live-reloading is already a massive workflow-improvement but changing a component that is deeply nested in your app can become tedious. Hot Module Reloading (HMR), magically __(actually, it's not real magic ✨)__, injects your changed component into the live application. No need to refresh, no live-reload. The code is loaded into your live-components invisibly. Now compare this to the native mobile development workflow that I described above! It's magic...kind of! 😍 If you haven't found it yet, you can enable HMR from the device's dev menu as well.

That's it for this post. Next time we'll build the first real screen for our app. In the meantime check out the official React Native documentation. Especially the part where they describe the available components and APIs. See you next time!

## Appendix: JS-style (we'll use classes and import and all that fancy stuff)

## Rendering the field
- generating
- rendering
