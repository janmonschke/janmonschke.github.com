---
title: Backbone-couchdb - Give your couchapp some Backbone!
date: 2010-11-12
permalink: blog/2010/11/12/backbone-couchdb-Give-your-couchapp-some-backbone.html
tags: post
pomodoros: 3
---

**The code and information about the library in this article may be out of date since this article is pretty old now and was written when the library was first released. Check the [project page](/projects/backbone-couchdb.html) for a more updated description.**

Recently I read a lot about CouchDB, couchapps and Backbone.js and I really liked the way you can create apps with these tools. To combine them I created a connector for Backbone that syncs your Backbone app to your CouchDB. The source is available on [Github](https://github.com/janmonschke/backbone-couchdb) and an example couchapp is hosted at [couchone](https://backbone.couchone.com/backbone-couchapp/_design/backbone-couchapp/index.html).

Vote it up on Hackernews if you like it: [vote](https://news.ycombinator.com/item?id=1898726).

This is the description that I also published on Github:

## backbone-couchdb

This is a Backbone connector that overrides the default sync-behavior Backbone and connects your app to your [CouchDB](https://github.com/apache/couchdb) so that you can [RELAX](https://vimeo.com/11852209) and don't need to worry about server-side code.

### Why a new connector?

I developed this connector because I didn't want to write a whole new server that persists
the models that Backbone.js creates. Instead of writing a server I now only have to write a simple design document
containing one simple view and I'm done with server-side code and can fully concentrate on my Backbone App.

Also I wanted to get real time updates when my models are changed on the server (e.g. by a second user). The CouchDB changes-feed seemed
like a perfect match for this problem.

### Getting Started

All Backbone apps should work normally without any changes. Simply include `backbone-couchdb.js` with its dependencies into your project and configure the connector with your database infos.

```js
Backbone.couchConnector.databaseName = "backbone-couchapp";
Backbone.couchConnector.ddocName = "backbone-couchapp";
Backbone.couchConnector.viewName = "byCollection";
Backbone.couchConnector.enableChanges = true;
```

As you can see you also need to create a new database in your CouchDB and a new design document that contains the following view:

```js
function(doc) {
  if(doc.collection){
    emit(doc.collection, doc);
  }
}
```

If you set `Backbone.couchConnector.enableChanges` to true, the connector will update your models with remote changes in near real time.

### Give your [couchapp](https://github.com/couchapp/couchapp) some backbone

An easy way to host single-page apps is to enclose them in a couchapp. I included a sample couchapp project to show you how to create
couchapps with backbone and this CouchDB connector. Also there is a step by step tutorial located in the [readme of the couchapp](https://github.com/janmonschke/backbone-couchdb/blob/master/backbone-couchapp/README.md).

There is an instance of this couchapp running on [couchone](https://backbone.couchone.com/backbone-couchapp/_design/backbone-couchapp/index.html) and I uploaded a file with the [annotated source](https://janmonschke.github.com/backbone-couchdb/app.html) of the app. (Created with [docco](https://github.com/jashkenas/docco))

### Dependencies

[Backbone.js](https://github.com/documentcloud/backbone) and therefore [Underscore.js](https://github.com/documentcloud/underscore)

[jquery.couch.js](https://github.com/apache/couchdb/blob/trunk/share/www/script/jquery.couch.js) and therefore [jQuery](https://www.jquery.com/)

### Learn more

To show how backbone-couchdb works under the hood I created an annotated source file located [here](https://janmonschke.github.com/backbone-couchdb/backbone-couchdb.html).
