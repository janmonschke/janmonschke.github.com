---
title: Simple frontend data migration
path: simple-frontend-data-migration
type: draft
keywords: ['frontend', 'data migration', 'JavaScript', 'React Native']
date: 2019-12-12
pomodoros: 5
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
    // make sure it does not break when
    // v2 data is passed
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

What's worse though is that, we have to add special code so that when we call `migrate` with an object that is already migrated to `v2` the function does not crash. 😱

Also, imagine we want to use the `name` key again for storing some other data. At that point, it cannot be used anymore to detect versions and we have to come up with event more complex logic to migrate our data. With every change of the migration function, we also have to consider that not all users have migrated to the newest version and it has to support all migrating users from the first version of our data, to the latest version of our data. 🤯

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

If you compare the complexity of the functions in the `migrations` object above to the `migrate` function that we were looking at before it becomes clear how much simpler it will be to maintain migrations over time because you will only ever have to think about the migration of one version to the next one and never two or mutliple ones at the same time. That also means, you can now test each migration step in isolation. 🎉

The `migrate` function executes each of these functions in the correct order, until there are no more migrations available and when it reaches that point, your data is fully migrated. That assumes that you are keeping the `Versions` and the `migrations` object in sync with your underlying data structure every time you update it. 😉

The approach here is only applied to simple migrations to make it easier to explain but it scales to more complex operations as well. Maybe you don't only have a single object containing all your app's data and it is all stored in a more complex `IndexedDB` schema. You have full control over when and how to call your migrations functions. You could have different migrations for different kind of models as well.

I hope this little piece of code is helpful for you now or in future projects. It shurely has helped me a lot in my side projects. 🎉

## Bonus: Adding TypeScript support

The code above is basically thr exact code that I have been using a couple of times now but I usually work in TypeScript but to make this blog post more accessible for all kinds of frontend peeps, I decided to port it to JavaScript. But I would also like to provide all y'all TypeScript devs with my (lazy) TypeScript implementation (only has one type cast with `as` 😅):

```typescript
enum Versions {
  one,
  two,
  three
}

interface VersionedData {
  version: Versions;
}

// The newest schema
interface NewestSchema extends VersionedData {
  info: { first: string; last: string };
  version: Versions.three;
}

// All old interfaces
interface LocalDataV2 extends VersionedData {
  name: { first: string; last: string };
  version: Versions.two;
}

interface LocalDataV1 extends VersionedData {
  firstName: string;
  lastName: string;
  version: Versions.one;
}

// Migrations are defined as functions of
// (d: VersionedData) => VersionedData
type Migrations = {
  [version in Versions]: ((data: VersionedData) => VersionedData) | undefined;
};

// The list of migration functions
// This time with more type safety 🎉
const migrations: Migrations = {
  [Versions.one]: (v1Data: LocalDataV1) => ({
    name: { first: v1Data.firstName, last: v1Data.lastName },
    version: Versions.two
  }),
  [Versions.two]: (v2Data: LocalDataV2) => ({
    info: { ...v2Data.name },
    version: Versions.three
  }),
  [Versions.three]: undefined
};

function migrate(input: VersionedData): NewestSchema {
  const migrationFn = migrations[input.version];

  if (!migrationFn) {
    return input as NewestSchema;
  } else {
    return migrate(migrationFn(input));
  }
}

const oldData = {
  version: Versions.one,
  firstName: 'a',
  lastName: 'b'
};

console.log('after', migrate(oldData));
```
