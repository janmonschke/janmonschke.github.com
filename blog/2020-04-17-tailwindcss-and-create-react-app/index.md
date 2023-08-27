---
title: Setting up TailwindCSS in create-react-app
permalink: setting-up-tailwindcss-in-create-react-app
tags: post
keywords: ["tailwindcss", "react", "create-react-app", "postcss"]
date: 2020-04-17
pomodoros: 4
---

I have started to use [TailwindCSS](https://tailwindcss.com/) in a couple of side projects now to try out utility-based styling. All of these projects are regular [create-react-app](https://create-react-app.dev/) projects (based on the TypeScript starter). The way create-react-app projects are set up does not allow you to change the project's webpack config without ['ejecting'](https://create-react-app.dev/docs/available-scripts#npm-run-eject) your app. In this post I want to show how I have added TailwindCSS to my projects without ejecting.

Ejecting from a create-react-app means you will lose the ability to easily update to newer versions of `react-scripts` but you will gain the ability to change config files like the webpack config. For side projects I try to not eject for as long as I can because I know I would spend a lot of time tweaking configs for no real reason. I like that with create-react-app I can focus on what I am building and I don't have to worry about config file.

Now, adding TailwindCSS to a create-react-app project is not as straight forward as adding it to an existing webpack config, but it's also not super complicated. I have seen several ways to do it and I am using a combination of two approaches that I have seen in other blog posts (linked to at the [bottom of this article](#sources)).

First, you have to install TailwindCSS and PostCSS. PostCSS will be used to generate the actual TailwindCSS classes.

```
npm install --save-dev tailwindcss postcss-cli
```

After that, initialize TailwindCSS (it will generate an empty config for you)

```
npx tailwind init tailwind.config.js
```

Once that is done, create a `postcss.config.js` file in the root of your project. In that config we are setting up the TailwindCSS plugin for PostCSS:

```js
const tailwindcss = require("tailwindcss");

module.exports = {
  plugins: [tailwindcss("./tailwind.config.js")],
};
```

Next, we will create our TailwindCSS entry file (`src/tailwind.css`). In that file we can define which parts of TailwindCSS we want to use and how we want them to be configured. For now, we will use the basic setup which will include all of Tailwind's utility classes:

```css
@tailwind base;

@tailwind components;

@tailwind utilities;
```

As the last step of our setup we will create custom npm scripts that will build TailwindCSS when we run `npm start` or `npm run build`.

```json
{
  (...)
  "scripts": {
    (...)
    "build:tailwind": "postcss src/tailwind.css -o src/base.css",
    "prebuild": "npm run build:tailwind",
    "prestart": "npm run build:tailwind"
  }
}
```

`build:tailwind` will compile the directives from `src/tailwind.css` and output it into `src/base.css`. That file will then contain all of Tailwind's classes. We need to import it in our top level project files as you can see in [the example below](#example).

The custom `build:tailwind` script is run by the `prebuild` and `prestart` scripts which are executed by default before the app starts or is getting build (thanks, `react-scripts`🤩).

Since `base.css` is a generated file that will be overridden every time you start or build your app, it does not make sense to put any custom CSS in there. You can keep putting your extra CSS in e.g. your component's CSS files. It also makes sense to add `base.css` to your `.gitignore` so it does not end up in your source control.

In addition to that, I can also advise you to set up `purgecss` for your project because the generated `base.css` is around 800 KB and you really don't want to ship all of that CSS to your users. `purgecss` analyzes which CSS classes you're using in your project and removes all unused class definitions from the generated CSS. This [great tutorial on the TailwindCSS website explains how to set it up in just a couple lines of code](https://tailwindcss.com/docs/controlling-file-size/#setting-up-purgecss).

I hope you found my little tutorial helpful and I wish you lots of fun building your React apps with TailwindCSS 😊.

**<a name="example"></a>Example:**

![Example component](example-component.jpg)

```jsx
import React from "react";
import ReactDOM from "react-dom";
import "./base.css";

ReactDOM.render(
  <div class="max-w-sm rounded overflow-hidden shadow-lg">
    <img
      class="w-full"
      src="//placekitten.com/400/210"
      alt="Sunset in the mountains"
    />
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
      <p class="text-gray-700 text-base">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
        quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
        nihil.
      </p>
    </div>
    <div class="px-6 py-4">
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
        #photography
      </span>
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
        #travel
      </span>
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
        #winter
      </span>
    </div>
  </div>,
  document.getElementById("root")
);
```

**<a name="sources"></a>Sources:**

- https://mikefrancis.dev/blog/create-react-app-tailwind-css
- https://medium.com/@grobeldev/setup-tailwind-with-postcss-in-create-react-app-in-5-minutes-43ae343e2789
