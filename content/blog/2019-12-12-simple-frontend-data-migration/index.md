---
title: Simple frontend data migration
path: simple-frontend-data-migration
type: draft
keywords: ['frontend', 'data migration', 'JavaScript', 'React Native']
date: 2019-12-12
pomodoros: 4
---

If you work on a JavaScript application that stores data locally, think of `localStorage` on the web or `AsyncStorage` in React Native, you might have found yourself in the situation where you want to change the shape of the stored data. This on its own does not seem like an impossible task but it can get quite hairy because this might not be the first time you changed the shape of that data and not all clients out there have already been migrated to the previous version of the data.

Let's look at an example to show you what I mean.

```js
// This is the inital shape of your data
const v0 = {
  firstName: 'Test',
  lastName: 'User'
};

// At some point you change it to this shape
const v1 = {
  name: {
    first: 'Test',
    last: 'User'
  }
};

// Your migration function might look sth like this
function migrate(oldData) {
  const newData = { ...oldData };
  if (!oldData.name) {
    newData.name = {
      first: newData.firstName,
      last: newData.lastName
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
    first: 'Test',
    last: 'User'
  }
};

// Let's extend our migrate function so it
// supports v0 and v1 migrations
function migrate(oldData) {
  const newData = { ...oldData };

  // v0 migration
  if (!newData.name) {
    if (newData.firstName) {
      newData.info = {
        first: newData.firstName,
        last: newData.lastName
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

Looking at our migration function we can see that after two relatively simple migrations its complexity has grown a lot already. It now has to detect the shape of `v0` by checking that the `name` key is not present. It detects `v1` by checking that `name` is present. The logic is already quite hard to make sense of and it requires us to add comments so we will be able to understand the code in the future.

What's worse though is that, imagine we want to use the `name` key again for storing some other data. At that point, it cannot be used anymore to detect versions and we have to come up with event more complex logic to migrate our data. With every change of the migration function, we also have to consider that not all users have migrated to the newest version and it has to support all migrating users from the first version of our data, to the latest version of our data.

## Versioning local data

One fix for this is to add a `version` field to our local data, either from the beginning or from the point on where you are writing your first migration. This field can be used to correctly identify the version of the local data and to split up the complexity of our migration function into multiple smaller functions:

```js
// An object with all available version identifiers
const Versions = {
  one: 1,
  two: 2,
  three: 3
};

// An object containing all available migrations
// The key represents an available migration for the
// versioned data at that version.
// Each value is a function that migrates a version to
// the next higher version.
const migrations = {
  [Versions.one]: v1Data => ({
    name: { first: v1Data.firstName, last: v1Data.lastName },
    version: Versions.two
  }),
  [Versions.two]: v2Data => ({
    info: { ...v2Data.name },
    version: Versions.three
  })
};

// Looks at the version of the data and recursively
// calls `migrate` until there are no more migrations
// available.
function migrate(input) {
  const migrationFn = migrations[input.version];

  if (!migrationFn) {
    return input;
  } else {
    return migrate(migrations[input.version](input));
  }
}

const oldData = {
  version: Versions.one,
  firstName: 'Test',
  lastName: 'User'
};

// Outputs the migrated data at version 3
console.log('migrated', migrate(oldData));
```

If you compare the complexity of the functions in the `migrations` object above to the `migrate` function that we were looking at before it becomes clear how much simpler it will be to maintain migrations over time because you will only ever have to think about the migration of one version to the next one and never two or mutliple ones at the same time.

The `migrate` function executes each of these functions in the correct order, until there are no more migrations available and at that time your data is migrated.

- have to maintain the versions obj and the migrations obj
- easy to test functions in isolation
- scales for indexed DB
- bonus, here's the tyescript version (uses only one `any` and one `as` cast :D)
- using this in side projects and has been working great so far
