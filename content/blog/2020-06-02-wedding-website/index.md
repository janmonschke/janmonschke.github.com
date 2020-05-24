---
title: Building a wedding RSVP website in React and Firebase
type: draft
path: building-a-wedding-rsvp-website-in-react-and-firebase
keywords:
  [
    'react',
    'firebase',
    'firestore',
    'react.js',
    'wedding',
    'rsvp',
    'website',
    'firebase authentication',
    'firebase firestore',
  ]
date: 2020-06-02
pomodoros: 3
---

Titles:

- Building a wedding RSVP website in React and Firebase (\*)
- How I built my wedding website with React and Firebase
- Building a wedding RSVP in React and Firebase

- Why build a wedding RSVP
- authentication
- no server
- Building the interface

## Why Firebase?

I could have deployed my own database and server for this project but I decided to go with Firebase for several reasons. First of all, it saved me a lot of time because I did not have to set up the database and the server and it comes with many features. It allowed me to fully focus on building the website and not to worry about the backend side of things.

Secondly, it comes with authentication built right in. And that was probably the most important reason for me because I really did not want to have to write a super secure and battle-tested authentication system that stores all my relative's and my friend's passwords. Sure, I could have used an open source project for this, but then I would have still needed to spend time on that and then we would be back at my first point for using Firebase: not having to build a backend system.

Thirdly, Firebase offers Firestore, a real-time database. At first this might sound like a nice gimmick and nothing more but this feature was crucial for me to build a room booking service for our guests without a server 🤯.

On top of all that, you get these features for free for small websites and their documentation gets you up to speed super quickly!

## Using Firebase's Authentication module

Firebase offers several ways to add authentication to your project. The best choice for us was to use the email -> sign-in link method. What I like about this method is that it did not require our guests to chose a new password (or use their standard password for the millionth time) and this method also eliminates the whole `I forgot my password`-flow because there is no password.

This is how the flow works: A guest enters their e-mail on the website and they receive an email asking them to click on a sign-in link. That link then brings them back to the website and they are signed in 🎉.

### Adding e-mail authentication to your website

The first thing I did was to create a Firebase project and added the Firestore and Authentication modules in Firebase's console UI at [console.firebase.google.com](https://console.firebase.google.com). The [setup-guide](https://firebase.google.com/docs/web/setup) explains all of these steps in detail.

I abstracted the initialization of Firebase and it's modules into a small module that I import whenever I need access to Firebase.

```js
// data/firebase.js
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export function getFirebase() {
  // only initialize once
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      // TODO: add your config
    });
  }

  return firebase;
}
```

The next building block is the website's router. One route is needed for the sign-in form (`<SignIn />`) and another one is used as the `callback-url` for the sign-in links (`<EmailLink />`). The router library that I used is [react-router](https://reacttraining.com/react-router/) but you can use whichever routing library you prefer.

```jsx
// App.js
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SignIn, EmailLink } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/sign-in">
          <SignIn />
        </Route>
        <Route path="/email-link">
          <EmailLink />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
```

In the `<SignIn />` component we are asking for the user's e-mail address and provide feedback when the email is submitted.

```jsx
// routes/SignIn.js
import React, { useCallback, useState } from 'react';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const onUpdate = useCallback(event => {
    setEmail(event.currentTarget.value);
  }, []);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      sendSignInLinkToEmail(email)
        .then(() => setEmailSent(true))
        .catch(error => {
          alert('Could not sign you in', error);
        });
    },
    [email]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          onChange={onUpdate}
          onKeyUp={onUpdate}
          onInput={onUpdate}
        />
        <button>Sign in</button>
      </form>
      {emailSent && <p>Check your mailbox for your sign-in link</p>}
    </div>
  );
}
```

If you add a little bit of CSS and some custom copy, the form will look something like:

![sign-in form](./signin-form.png)

- Explain why so many handlers on input
- Feedback important to tell the user that it worked and what they have to do next

```js
// data/sign-in.js
export function sendSignInLinkToEmail(email) {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain for this
    // URL must be whitelisted in the Firebase Console.
    url: `${window.location.origin}/email-link`,
    handleCodeInApp: true
  };

  // Save the email locally so you don't need to ask the user for it again
  // when they open the link on the same device.
  localStorage.setItem('emailForSignIn', email);

  return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
}
```

- Explain code above

- Now talk about signinlink component

```jsx
// routes/SignInLink.js
import React, { useEffect, useState } from 'react';

export function EmailRedirect() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    signInWithEmail()
      .then(() => setSignedIn(true))
      .catch(() => alert('Could not sign you in'));
  }, []);

  return signedIn ? (
    <Redirect
      to={{
        pathname: '/rsvp'
      }}
    />
  ) : null;
}
```

```jsx
// data/sign-in.js
import { getOrCreateUser } from './user';

export function signInWithEmail() {
  const email = localStorage.getItem('emailForSignIn');

  return firebase
    .auth()
    .signInWithEmailLink(email, window.location.href)
    .then(function(result) {
      return getOrCreateUser(result.user);
    });
}
```

```js
// data/user.js
import firebase from './firebase';

function usersCollection() {
  return firebase.firestore().collection('users');
}

function userDoc(userId) {
  return usersCollection().doc(userId);
}

export function getOrCreateUser({ id, email }) {
  const userDocRef = userDoc(id);
  return userDocRef.get().then(user => {
    if (user && user.exists) {
      return userDocRef;
    } else {
      return userDocRef.set({ email }).then(() => userDocRef);
    }
  });
}
```

## Building the RSVP form

Now that our users are authenticated

show form, show code, explain, cool

## TODO:

- shoot video of auth- and user-input-flow and attach to the beginning of the post

## Next posts

1. Admin interface
1. Using Firebase and React to build a hotel room booking system
1. Managing Firebase database access with INSERT ACCESS SYSTEM NAME HERE

- use playlist feature as example?
  - don't want to expose user's music taste to other users?
  - more people post when they are anonymous?
