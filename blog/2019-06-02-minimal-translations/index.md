---
title: Building a minimal i18n library
tags: post
permalink: building-a-minimal-i18n-library
date: 2019-06-10
pomodoros: 8
keywords: ["JavaScript", "i18n", "library", "tutorial"]
---

I am currently building the website for [my wedding next year](https://twitter.com/thedeftone/status/1034480375781830656) which has to be translated into English, German and French to make the information accessible for all our guests.

From work I know about the significance of internationalization (i18n) but also about the complexity of the topic. Which is why I started to look for libraries that were lightweight and easy to use. I quickly found myself in a deep rabbit hole, comparing the feature set of the big libraries like [Format.js](https://formatjs.io/), [i18next](https://github.com/i18next/i18next) and small ones like [polyglot.js](https://github.com/airbnb/polyglot.js). `Format.js` would be my go-to solution for a production app but I found that its setup and the translation format would be overkill for my tiny website. The same was true for `i18next`. Even `polyglot.js` offered too much functionality (e.g. support for all kinds of pluralizations that I knew I did not have to support) for what I needed.

At that point I took a step back and began to formulate the structure for an i18n library that would suit my minimal requirements. What I essentially needed was a function that, when given a translation key, would return a string translated in the users language.

```js
t("bus_tickets");
// => Your bus tickets
```

## Detecting the user's language

This raised the question: how do I detect the user's desired language. I knew about the [Accept-Language HTTP header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language) but since my website does not have a server, I was not able to use that header so I used [navigator.language](https://developer.mozilla.org/docs/Web/API/NavigatorLanguage/language) which returns the language that the browser is set to.

```js
const defaultLocale = "en";
const userLocale =
  navigator.language || navigator.userLanguage || navigator.browserLanguage;
```

The next step was to match the the user's language to one of the languages that I was translating, or, if the user's language was not supported, to fall back to the default locale. The matching is kept simple here on purpose because the locales that I would support are pretty simple. I was also not planning on adding special translations in cases like `de_AT` (Austrian German) or `fr_CA` (French Canadian). (If you're planning on localizing your product's website, you should definitely consider adding support for those locales!)

```js
const supportedLocales = [defaultLocale, "de", "fr"];

function getSupportedLocale(supported, userLocale, fallback) {
  // simple string match of the locale
  const locale = supported.find((loc) =>
    userLocale.toLowerCase().startsWith(loc)
  );
  return locale || fallback;
}

let locale = getSupportedLocale(supportedLocales, userLocale, defaultLocale);
```

## Getting static translations

Great, now we have the user's locale! In order to get a translated string, we now have to set up a data structure for our translations. The structure that I selected does purposely not adhere to a standard like the gettext format ([PO files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html)) or the [ICU message format](http://userguide.icu-project.org/formatparse/messages). Those formats are great, but I did not want to integrate a parser or a runtime for my translation system. (Again, if you build a real product, you should use those formats, I can't stress that enough 😅).

```js
const translations = {
  bus_tickets: {
    en: "Your bus tickets",
    de: "Deine Bustickets",
    fr: "Tes billets pour le bus",
  },
};
```

The only thing missing to get translated strings is the translation function itself. That function takes the user's locale and looks up the translation from our `translations` object.

```js
function t(translationKey) {
  const translations = strings[translationKey];

  if (translations) {
    // The translation in the user's locale
    const localized = translations[userLocale];
    // The translation in the default locale
    const defaultString = translations[defaultLocale];
    if (localized) {
      return localized;
    } else if (defaultString) {
      return defaultString;
    }
  }

  return "";
}
```

If I would only have to support static strings, this is where I could have stopped 🎉 Our website however does have interactive elements so I had to add support for interpolated strings.

## Interpolated strings

```js
t("singed_in_as")("your@email.com");
// => Signed in as: your@email.com
```

To keep things simple, I used JavaScript [template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals) for interpolation which from a developer's perspective is pretty neat, but from a security perspective is pretty bad since it might allow for [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting) if not used correctly. I debated the risk and came to the conclusion that the risk is very low in my case since I am rendering the translations as children of React nodes, which does have XSS protection built in.

Leveraging functionality of template literals, interpolated strings are defined as follows in my translations object:

```js
const translations = {
  signed_in_as: {
    en: (user) => `Signed in as: ${user}`,
    de: (user) => `Eingeloggt als: ${user}`,
    fr: (user) => `Connecté en tant que: ${user}`,
  },
};
```

## Plurals

```js
t("bus_tickets_booked")(2);
// => You have booked 2 tickets
```

Adding support for pluralization was a bit more tricky than adding interpolations because it requires you to take the pluralization rules of each language into account. In English and German for example you use the singular form when the quantity is exactly one and then you use the plural form for zero quantiries and for quantities that are bigger than one. However, different rules apply for French. There you use the singular form for quantities of zero and one and then the plural for everything that is more than one.

```js
const translations = {
  bus_tickets_booked: {
    en: pluralize([
      () => "You have booked one ticket",
      (num) => `You have booked ${num} tickets`,
    ]),
    fr: pluralize([
      (num) => `Tu as réservé ${num} ticket`,
      (num) => `Tu as réservé ${num} tickets`,
    ]),
  },
};
```

Translations that require pluralization, are wrapped with the `pluralize` helper that selects the correct plural/singular form for the user's language.

```js
function indexEN(num) {
  return num === 1 ? 0 : 1;
}

function indexFR(num) {
  return num > 1 ? 1 : 0;
}
const pluralIndex = {
  en: indexEN,
  de: indexEN,
  fr: indexFR,
};

export function pluralize(translationArr) {
  return function (num) {
    const index = pluralIndex[locale](num);
    const translationFn = translationArr[index];
    return translationFn.apply(null, arguments);
  };
}
```

`pluralize` [curries](https://en.wikipedia.org/wiki/Currying) the actual translation interpolation function. It selects the correct index function for the current locale and then returns the translation index.

The concept of selecting the index of a translation array, is not a concept that I came up with but that is very common for translation libraries. The rules for these indices can be looked up in the [CLDR pluralization rules documentation](https://www.unicode.org/cldr/charts/34/supplemental/language_plural_rules.html).

In my case I only have to support English, German and French that all have only two cases: singular and plural. If we would have to support Russian or Arabic, I'd have to provide more translation for different cases of plurals. Russian for example has four cases: singular, few, many and other. Adding support for a new language would only require providing a new index selector for that language.

## Setting the locale

Now that static translations, interpolations and plurals are implemented, the only thing that was missing was to allow the user to select a preferred locale. This is an absolute requirement for translated websites. When we were parsing the user's language, we were just making an informed guess as to which language they might prefer. We don't know if the user would actually prefer to read our website in English, even though their browser language is set to French and we should let them decide.

```js
export function setLocale(newLocale) {
  locale = newLocale;
  try {
    localStorage.setItem("locale", newLocale);
  } catch (e) {}
}
```

The solution for this is to add a language selector to your page that either sets a cookie or that stores the selected locale in `localStorage` so that you can read out the user's preference when deciding which language to render. That only adds a couple of lines to our initial guess of the userLocale:

```js
function getStoredLocale() {
  // try getting the locale from local storage
  try {
    return localStorage.getItem("locale");
  } catch (e) {
    return undefined;
  }
}

const userLocale =
  getStoredLocale() ||
  navigator.language ||
  navigator.userLanguage ||
  navigator.browserLanguage;
```

## How to use the library

```jsx
import { t } from "./translations";

function SignInInfo({ user }) {
  return (
    <Fragment>
      <span>{t("signed_in_as")(signIn.email)}</span>
      <SignOutButton />
    </Fragment>
  );
}
```

In order to use translations in your views, simply call the `t` function with your translation key and, if required, additional parameters for interpolation or pluralization.

You can use the library with any JavaScript framework that you like. In my case it's `React`, but it would work just as good with `Vue.js`, `Angular` or whichever hto new JS framework there is these days (`Backbone` anyone? 😉).

Check out this [Glitch project](https://glitch.com/~minimal-i18n-library) for an example project and find the code on GitHub: https://github.com/janmonschke/minimal-i18n.

## Wrapping up

Did I save time by skipping the setup of one of the established i18n libraries by writing my own library? Most probably not 😄! But I did learn a lot about internationalization in general and feel like I have a lot more empathy now with users that use translated products and that have to deal with wrong translations constantly. I feel like I will pay a lot more attention to how I use translations at work now.

Once more: the library was only built for a tiny website and mainly for educational purposes so please don't use it in your production projects. Depending on how you use the library, it's a potential source for XSS attacks and there are plenty of basic features that it does not support yet (e.g. multiple plurals in a single sentence).
