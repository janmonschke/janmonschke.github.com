---
title: Making of 'JavaScript, what are you?'
layout: post
author: Jan Monschke
draft: true
---

The story of how we created the web-based audiovisual performance for JSConf.eu 2015.

[[VIDEO]]

During my talk at JSConf.eu 2014 I mentioned the idea to form a band like [The Glitch Mob](https://soundcloud.com/theglitchmob) but create the instruments with web technology instead of state of the art music software. At that time I did not really think about really forming a band but found the idea interesting. In my free time I wrote down ideas for a potential software architecture that would be needed but my free time was limited and I was switching my career path from being a freelance developer to being a full-time employee and I somehow forgot about this idea and did not pursue it further.

[[find Malte's tweet where he was asking me to perform]]

In 2015 I formed the Web Audio Berlin meetup to gather Web Audio developers and people that were curious about Web Audio in general. The first meetup was great and it was surprising to see how many of the Berlin-based web developers had a strong background in music. Since Web Audio is a relatively new way of creating music, the community was very small at that time and it was hard to find like-minded people. This first gathering initiated many friendships and made me think about that idea from JSConf.eu again. And as it happened to be, I met the perfect person to colaborate with. Adam Renklint demoed his beat programming library which was exactly what I was looking for. And he also mentioned his musical background from the days where he toured with a hip hop group in Sweden before he moved to Berlin. That sounded exactly like the direction that I wanted to get into in. So I met up with Adam and he was immediately up for making it happen.

[[Kahlil's tweet about his musical past]]

A few days later though, I saw a very interesting tweet in my timeline from Kahlil Lechelt, whom I met at JSConf.eu the year before and whom I knew from his various podcasts (Descriptive, Reactive). He shared a music video from the time before he was a full-time developer, where he was a full-time dancehall artist. I could not stop myself from inviting him to join Adam and me. It was the perfect timing! Now we had two music programmers and one rapper, ready to rock a stage! So we began to meet up on Slack and talk about potential performance ideas. It really felt like we just created a band and we were dicussing musical styles, music that influenced us and our musical background. Truly some of the best Skype calls I ever had :)

This was XX months before JSConf.eu and we saw that we didn't have time to come up with a completely new song plus lyrics plus visuals so Kahlil proposed to use some of his brother's (Boris) beats to start with. Boris and Kahlil made music together before and while listening to the beats it was immediately obvious how well they would work together with Kahlil's raps, even though they sounded a bit too gloomy/dark to me in the beginning ;)

Sadly, Adam had to leave the group later on due to high workload but Kahlil convinced Boris to join our group. I still wonder now what Boris might have thought when he Kahlil asked him. I mean, his background is in architecture and I'm not talking about software architects here. I imagine it to be a rather ineresting request to perform music at a conference in a field that I don't know much about. Especially when you are not a full-time musician ;) It was fun to explain him the concept of JSConf.eu and to show him previous performances (Jed Schmidt, Jan Krutisch). I guess at that time it was still weird for him because conferences in architecture seem to have a pretty different vibe to them and normally don't open up with a hip hop act :D

After deciding on a beat I immediately started working on a web app that would let us perform the song live. I built an application that works similarly to other live-performing tools that give you a lot of freedom over your arrangement but take care of scheduling to the beat. So the idea was to slice up the beat into pieces that we would then recreate live on stage and Kahlil would sing over them.

We decided to meet up at Kahlil's to work together on the beat and the software for an entire weekend. Best idea ever ;) After showing them my software it became clear, that it would not be easy to slice up the beat and we should focus on using the web app to trigger JS-related quotes in the manner of [[find TED talk]]. This was one of my early ideas for the performance anyways but I thought we wouldn't need to do this now that we had a dedicated rapper. So then the big work began: Scanning and cutting hours and hours of video material, mixing down the beat, writing lyrics, coming up with an idea for the visualisation, building a video component that has zero delay and coming up with a topic for the video slices. After two days of work in the heat of Stuttgart we had a very rough idea about in which direction the performance could go. It quickly really had the feeling of forming a band with friends.

From that weekend on we still had [[6 weeks?]] to work on it and we only had a rough concept. It tooks us several weekends and week-evenings to really form it into something we could be proud of. And also, working on it for so long without telling other friends from the community what exactly we were working on. It was supposed to be a big sruprise for all attendees at JSConf.eu. Some impressions from our regular sync-meetings:

One day before, rehearsal in big room, rehearsal in hotel room, Kahlil ultra cool, Boris and me shaking,

next day Kahlil mega nervous and Boris and me super smooth. Kahlil decided not to stand on the stage, so only Boris and me and then another suprise when Kahlil comes to the stage.
