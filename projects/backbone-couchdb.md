---
project_name: backbone-couchdb
title: backbone-couchdb - Give your Couchapp some Backbone!
repository : http://github.com/janmonschke/backbone-couchdb
version: 1.2
layout: project
---

#### Description {#description}

backbone-couchdb is a plugin for Backbone.js that takes care of synching (Backbone-) Models and Collections automatically with a CouchDB instance. It makes heavy use of CouchDBs built-in Couchapp functionality. Normally it would be necessary to set up a webserver and a webapp (Rails, Sinatra, Django...) in order to persist Models. But with this plugin it is only needed to host Backbone Apps as Couchapp and the persistence layer is ready out of the box.

Since the App runs as a Couchapp, it is also capable of using the CouchDB \_changes-feed which enables the App to receive real-time updates for Collections and Models. If this functionality is not needed it can be turned off easily.

#### TOC
1.[Description](#description)
2.[Usage](#usage)
3.[Examples](#examples)
4.[Recipes](#recipes)
  - [custom views](#custom_views)
  - [using filters](#using_filters)
  - [custom parameters (include_docs, keys, startkey, skip...)](#custom_parameters)
5.[Dependencies](#dependencies)
6.[Changelog](#changelog)

#### Usage {#usage}
All Backbone apps should work normally without any changes. Simply include backbone-couchdb.js with its dependencies into your project and configure the connector with your database infos.

{% highlight js %}
Backbone.couch_connector.config.db_name = "backbone-couchapp";
Backbone.couch_connector.config.ddoc_name = "backbone-couchapp";
Backbone.couch_connector.config.global_changes = false;
{% endhighlight %}

As you can see you also need to create a new database in your CouchDB and a new design document that contains the following view (should be named "byCollection.js"):

{% highlight js %}
function(doc) {
  if (doc.collection) {
    emit(doc.collection, doc);
  }
}
{% endhighlight %}

In order to sync properly, all Collections need a url property (functions work as well). The url is then translated into the collection property that has been used in the example above. To learn how to use custom views and keys for Collections, have a look at the [recipes](#recipes).

If you set `Backbone.couch_connector.config.global_changes = true`, the connector will automatically update your models with remote changes in near real time.
But first you also have to add a [filter function](http://guide.couchdb.org/draft/notifications.html#filters) to your design document. By default a filter function called `by_collection` is used, which can look like this:

{% highlight js %}
function(doc, req){
  // is the document part of a collection?
  if(doc.collection && req.query && req.query.collection && doc.collection == req.query.collection)
    return true;
  // has the document been deleted?
  else if (req.query && req.query.collection && doc._deleted)
    return true;
  else
    return false;
}
{% endhighlight %}

If you happen to use the `initialize` function in your Collection, make sure that you also call its super function because the changes-feed initialization happens in the connector's `initialize` function.
You simply have to add this line as the first line of your initialize function:

{% highlight js %}
Backbone.Collection.prototype.initialize.call(this, arguments);
{% endhighlight %}

#### Examples {#examples}

Real time chat with support for private messages ([demo](http://backbone.iriscouch.com/backbone-couchapp/_design/backbone_example/index.html) / [source](https://github.com/janmonschke/backbone-couchdb/tree/master/chat_example)).

Real time comment system e.g. for blogs ([demo](ttp://backbone.iriscouch.com/backbone-couchapp/_design/backbone_couchapp_comments/index.html) / [source](https://github.com/janmonschke/backbone-couchdb/tree/master/comments_example)).

#### Recipes {#recipes}
For the basic usage of this plugin there is no need to know anything about CouchDB because it manages everything automatically. To write more advanced apps (real-world apps) a basic knowledge of CouchDB components such as views, keys and filters is needed. I therefore recommend reading the [O’Reilly open source CouchDB book](http://github.com/oreilly/couchdb-guide).

##### Views - Using a custom view for a Collection {#custom_views}
By default all Collections will use the byCollection-view as described in [usage](#usage). But often it is necessary to retrieve a more detailed list of of Models than the list of all Models of a certain type. In a todo-list you would for example only need to get all entries that were not yet marked as done:

{% highlight js %}
TodoCollection = Backbone.Collection.extend({
  url : "/tasks"
  db : {
    view : "not_done_tasks"
  }
})
{% endhighlight %}


The corresponding view (`not_done_tasks.js`) looks like this:

{% highlight js %}
function(doc){
  if (doc.collection == "tasks" && doc.done == false) {
    emit(doc.collection, doc);
  }
}
{% endhighlight %}

##### Filters - Only sync changes that are important for a certain user {#using_filters}

This is a very common use-case in chats (private messages). When a private message is sent, only the recipient should receive the update. I recommend using the built-in authentication of CouchDB with this [jQuery-couchlogin plugin](https://github.com/couchapp/couchdb-login-jquery).

Our Collection, assuming that there are two collections (normal messages / private messages), needs to have a custom filter function that allows us to decide which updates should be send to the \_changes-feed for which user.

{% highlight js %}
PMCollection = Backbone.Collection.extend({
  url : "/private_messages"
  db : {
    filter : Backbone.couch_connector.config.ddoc_name + "private_messages"
  }
})
{% endhighlight %}

The filter-function needs to be placed inside the filters-folder of the couchapp directory and needs to be named exactly like the name we specified in our collection (in this case `private_mesages.js`).

{% highlight js %}
function(doc, req) {
  if (doc.collection == "private_messages" && doc.to == req.userCtx.name)
    return true;
  else
    return false;
};
{% endhighlight %}

##### Add custom request parameters {#custom_parameters}

In order to pass custom parameters to e.g. view-calls you can add parameters to the db-config of your collection. This includes `view`, `ddoc`, `keys` and `list`.

{% highlight js %}
myCollection.db.keys = ["key1", "key2"]; // add custom keys to the requests
{% endhighlight %}

You can even add more parameters to a collection's fetch call like this:

{% highlight js %}
myCollection.fetch({
  limit: 10,
  skip: 10,
  include_docs: true,
  startkey: "A",
  endkey: "C"
});
{% endhighlight %}

All these options are optional, of course :)

#### Dependencies {#dependencies}

- [jQuery](http://www.jquery.com/)
- [Underscore.js](https://github.com/documentcloud/underscore)
- [Backbone.js](https://github.com/documentcloud/backbone) (>= 0.5.1)
- [jquery.couch.js](https://github.com/apache/couchdb/blob/master/share/www/script/jquery.couch.js) (already included in each CouchDB instance)

#### Changelog {#changelog}
- __1.2__
  - CouchDB list support [#37](https://github.com/janmonschke/backbone-couchdb/pull/37)
  - Support for custom design documents for collections [#38](https://github.com/janmonschke/backbone-couchdb/pull/38)
  - Fix for views that emit `null` [#35](https://github.com/janmonschke/backbone-couchdb/pull/35)
  - A better way to test the library [/test](https://github.com/janmonschke/backbone-couchdb/tree/master/test)
  - more request information in error callbacks [#20](https://github.com/janmonschke/backbone-couchdb/issues/20#issuecomment-5461404)
  - Support for more options when fetching a collection [#34](https://github.com/janmonschke/backbone-couchdb/pull/34)
  - tested with Backbone 0.9.2

- __1.1__
  - Fixed a bug with empty key param
  -
- __1.0__
  - CoffeeScript rewrite
  - Backbone 5.1 support
  - Collection#db and Model#db objects
  - Custom view support
  - Custom key support
  - Various bugs fixed
  - Started versioning ;)
