---
title: Simple frontend data migration
permalink: simple-frontend-data-migration/
tags: post
keywords: ["frontend", "data migration", "JavaScript", "React Native"]
date: 2019-12-12
pomodoros: 5
---

If you work on a JavaScript application that stores data locally, think of `localStorage` on the web or `AsyncStorage` in React Native, you might have found yourself in the situation where you want to change the shape of the stored data.

This on its own does not seem like an impossible task but it can get quite complex over time. You have to make sure to build a system that correctly identifies the version of the local data and that correctly migrates all the different versions to the latest versions. Users might come back to your site/app after 6 months, and might have missed several migrations in the meantime.

Let's look at an example to show you what I mean.

```js
// This is the initial shape of your data
const v0 = {
  firstName: "Test",
  lastName: "User",
};

// At some point you change it to this shape
const v1 = {
  name: {
    first: "Test",
    last: "User",
  },
};

// Your migration function might look sth like this
function migrate(oldData) {
  const newData = { ...oldData };
  if (!oldData.name) {
    newData.name = {
      first: newData.firstName,
      last: newData.lastName,
    };
    delete newData.firstName;
    delete newData.lastName;
  }
  return newData;
}
```

So far so good, you have successfully migrated your client data from `v0` to `v1`. Now let's add a `v2` to make things interesting.

```js
// We rename `name` to `info`
const v2 = {
  info: {
    first: "Test",
    last: "User",
  },
};

// Let's extend our migrate function so it
// supports v0 and v1 migrations
function migrate(oldData) {
  const newData = { ...oldData };

  // v0 migration
  if (!newData.name) {
    // make sure it does not crash when
    // v2 data is passed
    if (newData.firstName) {
      newData.info = {
        first: newData.firstName,
        last: newData.lastName,
      };
      delete newData.firstName;
      delete newData.lastName;
    }
  } else if (newData.name) {
    // v1 migration
    newData.info = { ...newData.name };
    delete newData.name;
  }

  return newData;
}
```

Looking at our migration function we can see that after two relatively simple migrations its complexity has grown a lot already. It now has to detect the shape of `v0` by checking that the `name` key is not present. It detects `v1` by checking that `name` is present. The logic is already quite hard to make sense of and it requires us to add code comments to be able to understand the code in the future.

What's worse though is that we have to add special code so the migrations does not crash, when called with an already migrated object. 😱

Also, imagine we want to use the `name` key again for storing other data. At that point we cannot use it to detect versions anymore, and we have to come up with even more complex logic to migrate our data. With every change of the migration function we also have to consider that not all users have migrated to the newest version and it has to support migrations of all the different versions of data that are out there, from the first version of our data, to the latest version of our data. 🤯

## Versioning local data

One fix for this is to add a `version` field to our local data, either from the beginning or from the point on where you are writing your first migration. We will use this field to correctly identify the version of the local data and to split up the complexity of our migration function into smaller functions:

```js
// An object with all available version identifiers
const Versions = {
  one: 1,
  two: 2,
  three: 3,
};

// An object containing all available migrations
// The key represents an available migration for the
// versioned data at that version.
// Each value is a function that migrates a version to
// the next higher version.
const migrations = {
  [Versions.one]: (v1Data) => ({
    name: { first: v1Data.firstName, last: v1Data.lastName },
    version: Versions.two,
  }),
  [Versions.two]: (v2Data) => ({
    info: { ...v2Data.name },
    version: Versions.three,
  }),
};

// Looks at the version of the data and recursively
// calls `migrate` until there are no more migrations
// available.
function migrate(input) {
  const migrationFn = migrations[input.version];

  if (!migrationFn) {
    return input;
  }

  return migrate(migrations[input.version](input));
}

const oldData = {
  version: Versions.one,
  firstName: "Test",
  lastName: "User",
};

// Outputs the migrated data at version 3
console.log("migrated", migrate(oldData));
```

Let's compare the complexity of the functions in the `migrations` object above to the `migrate` function that we were looking at before. By breaking down the function into several smaller chunks, it becomes much simpler to maintain migrations over time because you will only ever have to think about one migration at a time. That also means, you can now test each migration step in isolation. 🎉

The `migrate` function executes each of these functions in the correct order, until there are no more migrations available and when it reaches that point, your data is migrated. It is required, that you keep the `Versions` and the `migrations` object in sync with your underlying data structure every time you update it. 😉

In this example, the migration approach is only applied to simple migrations to make it easier to explain. The approach does scale to more complex operations as well. You might organize your frontend data in a more complex `IndexedDB` schema instead of stuffing it all in one giant object. Since you have full control over when and how to call your migrations functions it is possible to have could have different migrations for different shapes of data and to run them on a larger set of objects.

I hope this little piece of code is helpful for you now or in future projects. It has helped me a lot in my side projects. 🎉
