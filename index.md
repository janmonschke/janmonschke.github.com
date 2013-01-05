---
layout: master
title: Portfolio by Jan Monschke
---

#### Posts
{% for post in site.posts limit: 5 %}
- [{{ post.title }}]({{post.url}}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}

#### Projects
- [backbone-couchdb.js](/projects/backbone-couchdb.html) - Easily connect CouchDB and Backbone.js
- [GeoMock](/projects/geomock.html) - Mock GPS data in your Webapps