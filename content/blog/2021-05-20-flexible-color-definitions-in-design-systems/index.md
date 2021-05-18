---
title: Flexible color definitions in design systems
type: blog
path: flexible-color-definitions-in-design-systems
keywords: ['design', 'system', 'color', 'pattern', 'css', 'variables']
date: 2021-05-20
pomodoros: 4
image: ./color-splash.jpg
---

While working on the implementation of a new design system at work, I came across this nifty little trick that makes color definitions more usable and flexible.

Let's say our task is to build a `LinkButton` component. A component that looks like a button but it is actually a link. The component's background should be `space green` from our list of theme colors:

```css
:root {
  --colors-space-green: rgb(3, 227, 211);
  --surface-primary-button: var(--colors-space-green);
}

.ButtonLink {
  background: var(--surface-primary-button);
}
```

This results in the following component component:

<a href="#" class="ButtonLink">ButtonLink</a>

The design spec specifies, that the background should have `50%` opacity when the element is hovered. So we're adding an additional opacity rule:

```css
.ButtonLink:hover {
  opacity: 0.5;
}
```

When hovered, the component's background changes correctly. However, the text becomes a lot less readable because `opacity` is applied to the entire element which includes its child elements:

<a href="#" class="ButtonLink1">ButtonLink</a>

Not only is this bad for the readbility, it's also not correct according to the design spec which only specifies an change in opacity for the background.

Instinctively I want to solve this issue by defining a new variable `colors-space-green-opacity-50` that is a `rgba()` copy of the original color. That color is then used as the background color for the hovered button. That is a valid approach and gets you to the solution quickly.

Another approach is to define the "raw" RGB values of `space green` as its own variable and use that variable for the base color definition and the hover color. LEt me show you what I mean by "raw" RGB values:

```css
:root {
  --colors-space-green-rgb: 3, 227, 211;
  --colors-space-green: rgb(var(--colors-space-green-rgb));
}
```

The definition of `--colors-space-green-rgb` might look incomplete and invalid but it is actually a valid definition of a custom property. Custom properties are replaced **as is** so it is actually valid CSS code. `rgb(var(--colors-space-green-rgb))` is interpreted as `rgb(3, 227, 211)` which is identical to our initial color definition of `space green`.

This now allows us to define a hover version of the background color that depends on the base color definition:

```css
:root {
  --surface-primary-button-50: rgba(var(--colors-space-green-rgb), 0.5);
}

.ButtonLink:hover {
  background: var(--surface-primary-button-50);
}
```

Et voilà, our `ButtonLink` now behaves correctly and it will automatically update when we change the base color definition 🎉:

<a href="#" class="ButtonLink2">ButtonLink</a>

I like this approach as it gives a lot of flexibility and aids with maintainability.

<style>
  /* Initial approach */
  :root {
    --colors-space-green: rgb(3, 227, 211);

    --surface-primary-button: var(--colors-space-green);
  }

  .ButtonLink, .ButtonLink1 {
    background: var(--surface-primary-button);
  }
  .ButtonLink1:hover {
    opacity: 0.5;
  }

  /* RGB variable approach */
  :root {
    --colors-space-green-rgb: 3, 227, 211;
    --colors-space-green-2: var(--colors-space-green-rgb);

    --surface-primary-button-2: rgb(var(--colors-space-green-2)); /* Excuse my bad naming here */
    --surface-primary-button-50: rgba(var(--colors-space-green-rgb), 0.5);
  }

  .ButtonLink2 {
    background: var(--surface-primary-button-2);
  }

  .ButtonLink2:hover {
    background: var(--surface-primary-button-50);
  }

  .ButtonLink, .ButtonLink1, .ButtonLink2 {
    color: black;
    margin: 0.5em;
    text-decoration: none;
    padding: 1em;
    border-radius: 15px;
  }
</style>
