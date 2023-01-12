---
title: Using Webmentions on your Gatsby site
type: draft
path: using-webmentions-on-your-gatsby-site
keywords: ['webmentions', 'gatsby', 'github actions', 'github workflow', 'webhook', 'webmentions.io']
date: 2023-01-09
pomodoros: 12
---
- explain web mentions
- what are the different players?
	- webmention.io
		- receives mentions for you
		- stores them and lets you fetch them
		- gives you a webhook API or a fetch API
	- brid.gy
		- bring mentions from Twitter and Mastodon
		- Sadly mastodon does not support webmentions
			- link to issue

## Bringing webmentions into Gatsby

I will show you two ways of how to use webmentions in your Gatsby site. The first one is the simplest one and, apart from setting up webmention.io and potentially brid.gy, requires pretty much no extra setup. The second flow is a bit more involved and requires Github actions, a proper integration into Gatsby's GraphQL layer and, optionally, setting up a webhook for your Github actions.

> TODO: is it github actions or github workflows? or github actions workflow?

The first flow is perfect if you quickly want to see how webmentions will look like on your site. However, I recommend going with the second flow (if possible). It has the advantage of owning your mentions. It's more resilient to outages and shutdowns of the third-party sites you rely on and it will load much faster. It is also more flexible, as we'll see later on.

### Fetching webmentions on-demand

The simplest way to show webmentions is to fetch them on the client-side from webmention.io.

```javascript

function Webmentions({ postUrl }) {

const [mentions, setMentions] = useState(null);

useEffect(() => {

fetch('https://webmention.io/api/mentions.jf2?target=' + postUrl)

.then((response) => response.json())

.then((mentionsJson) => setMentions(mentionsJson.children));

}, []);



if (!mentions || mentions.length === 0) {

return null;

}



return (

<aside>

<ul>

{mentions

.filter((wm) => ['in-reply-to', 'mention-of'].includes(wm['wm-property']))

.map((mention) => (

<li key={mention.id}>

@{mention.author.name}: {mention.content.text}

</li>

))}

</ul>

</aside>

);

}

```


This will render a list of all webmentions for the given post on your site. Each mention will contain the user's name and their message like so:

> @Jeremy: I found this really cool blog post by Ada adas.site/webmentions-explained

The webmention object has a lot more properties that we are not using in this example but you might want to check them out for your use-case (e.g. a link back to the author at [`author.url`], the author's profile pic [`author.photo`] or a link back to the original post [`mention.url`]).

This component can be placed anywhere on a blog post or any other site. Its only parameter is `postUrl` which is the public url of the page you want to fetch webmentions for (e.g. `https://adas.site/webmentions-explained/`). This url is the one that you or other users post on social media or their webmention-enabled blog. **Brid.gy** and **webmention.io** will only use that public url to send and store your mentions.

If we have another look at where the code iterates over the mentions, you'll find that we are filtering the mentions based on their `wm-property`.

```javascript
mentions
  .filter((wm) => ['in-reply-to', 'mention-of'].includes(wm['wm-property']))
````

We're doing this in order to only show replies or mentions of our post. Other types of webmentions do not include `content` , so the code above would not support them. Other types include `like-of` for likes of your post and `repost-of` for reposts of your post. A full list of the supported values of `wm-property` can be found in the [webmention.io documention](https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page).

It is generally a good idea to group webmentions by type and show them in distinct lists. For example a simpler list of likes and more complex list for actuall mentions with content. But also feel free to integrate all types in the same list. There are no rules and the world is your oyster!

This approach is pretty simple and but has some disadvantages:
- It makes an extra request for each user
- When webmention.io is down, your mentions (and likes etc.) won't load
- In case webmention.io shuts down, you lose all your webmentions

### Owning your webmentions and building them statically

The approach that I took for webmentions on this site makes sure that webmentions are checked into GitHub. That makes them resilient to issues with third-party webmention providers and it allows to build them statically. Meaning we don't need to make an additional request, yay 🎉

> This approach is heavily influenced by [Sebastian De Deyne's webmention integration](https://sebastiandedeyne.com/webmentions-on-a-static-site-with-github-actions/) . Instead of integrating webmentions into Hugo, I'm explaining here how to integrate them into Gatsby. There are already Gatsby plugins for webmentions but they load them dynamically and not statically.

#### Synchronizing webmentions into your GitHub repository

Similarly to the first approach, we need to fetch webmentions from webmention.io. This time, however, we are going to sync all mentions for our domain, instead of mentions per post/site. We could do it per post, but I find Sebastian's solution quite elegant, so we'll stick to it.

The synchronization works like this:
1. Fetch all mentions for our domain (in my case https://janmonschke.com)
2. For each webmention, we will read out it's `wm-target` property
3. Check in `./webmentions/data/` if we already have a JSON webmention file for that post (e.g. `webmentions-explained.json`)
4. If the file exists, then merge the new mention into that file
	1. Make sure to exclude duplicates by comparing the `wm-id` property 🔎
	2. Sort mentions by `wm-id` to keep a roughly correct order in the cache file. The actual order for mentions will be based on the `published` property later on. However, likes and reposts don't have this property, so `wm-id` is the best we can do at this point. ✅
	3. Write the file to disk 🎉
5. If the file does not exist, create a new cache file for this post which only contains this webmention: `[webmention]` 🎉


You can check out the code below or directly in my [site's GitHub repo](https://github.com/janmonschke/janmonschke.github.com/blob/dev/webmentions/sync.js).
<iframe
  src="https://gist.github.com/janmonschke/49d354bc96393348a9037dba0018fa6b.pibb"
  style="width: 100%; height: 200px; border: 0;margin-top: -1.5em;"
>
</iframe>

I found that a good directory for the JSON files is `./webmentions/data`. First I tried to co-locate blog posts and their webmentions cache but it turned out to be quite complicated to find the correct directory for based on the `wm-target` property.

One optimization for this flow is to not always fetch all webmentions. If you regularly sync your mentions, you can use the `since` parameter in the webmention.io API in order to limit the timeframe for new mentions.

#### Sourcing webmentions into Gatsby's GraphQL layer


- getting them into Gatsby
	- [x] Fetch on-demand
	- Own the content and build statically
		- [x] Saving webmentions into your gut repo
		- Sourcing them into Gatsby's graphql layer
		- Displaying likes and mentions
			- Also show the cool content enhancement
	- Automatically sync mentions
		- Using GitHub actions to sync periodically
		- Setting up webhooks to sync in 'real-time'
			- Bridgy only syncs your mentions every couple of hours

	- fetch them on-demand
	- use a webhook to regenerate your page when a new mention comes in
		- take payload from webmention and add to JSON file in your repo
		- commit that JSON file, merge to main, deploy
	- third combination?
		- don't rely on webhooks, rather build your site periodically
		- https://sebastiandedeyne.com/webmentions-on-a-static-site-with-github-actions/
		- And build it when you receive a we hook
		- https://kontent.ai/blog/how-to-trigger-github-action-using-webhook-with-no-code/
		- Todo: what can we do about deleted webmentions?
- Getting.webmention data into Gatsby https://dimitri.codes/using-json-with-gatsby/
