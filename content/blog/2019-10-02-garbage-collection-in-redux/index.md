---
title: Garbage Collection in Redux Applications
type: blog
path: garbage-collection-in-redux-applications
date: 2019-10-02
pomodoros: 1
keywords: ['JavaScript', 'React', 'Redux', 'garbage collection']
---

The topic that I focused on a lot in my [recent conference talks](/#talks) was garbage collection in Redux applications. At [work](https://soundcloud.com) we built a full-fledged Xbox application in React with Redux.

Building for the Xbox runtime is a tricky business for web apps that should run in the background when games are playing because they available memory for your app is very limited and your web app shares the memory with the browser process that needs to be active. When your app is over the maximum budget of 128 MB, the OS might decide to just kill your app, even when it's playing music. This is not a lot of memory when you consider that the browser process eats most of it.

Usually, memory is not a big concern when building web apps, but in our case we were dealing with an application that is often running for several hours in the background and might not even be closed for several days in some cases. We noticed that our Redux store kept on growing and growing while the user was listening to more music and especiall when searching for new songs a lot.

That's why we came up with a system to identify unused state in our Redux store that then automatically removes those objects when they're not needed anymore. Our solution involved:

- normalization of the store object
- keeping track of active selectors
- a custom garbage collection algorithm
- finding the right moment to remove unused state

I wrote about our approach in length on the SoundCloud developer blog, you can check it out there if you are interested :)

→ [developers.soundcloud.com/blog/garbage-collection-in-redux-applications](https://developers.soundcloud.com/blog/garbage-collection-in-redux-applications)

Let me know on [Twitter](https://twitter.com/thedeftone) what you think about it and if you have any questions about the solution.
