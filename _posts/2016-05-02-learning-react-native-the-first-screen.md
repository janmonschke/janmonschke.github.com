---
title: Learning React Native - 02 The first screen
layout: post
author: Jan Monschke
draft: true
---

Now let's get started with our first own React Native components. The first screen that we are going to build is the game's menu screen. It will be the central navigation point for the players from which they can reach all other screens:

// insert menu screenshot

## Buttons

React Native has several different components that can react to touches: [TouchableOpacity](link), which decreases the targets opacity as feedback to a user's touch; [TouchableHighlight](link), which lets the underlying's view color shine through during a touch; [TouchableWithoutFeedback](link), which does not provide a default feedback behaviour, but can be used to implement your own touch reaction; [TouchableNativeFeedback], which is an Android-only component that provides Android-specific feedback. On top of that, all [Text](link) components also react to touches which comes in handy when implementing links in larger text blocks.

Our menu buttons will be composed of the standard `TouchableOpacity` component and a `Text` component to display the button's label.

{% highlight javascript %}
class Button extends Component {
  render() {
    const { label, onPress, style } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, style]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  }
}
{% endhighlight %}

We want to keep the component as simple/dumb as possible (look up Dan Abramov's definition for smart vs dumb components), so we are passing all its "state" as props and we are not keeping any internal state. The button component provides an internal base style and also allows for simple customization by combining the base style with a user-defined `style` prop: `style={[styles.button, style]}`. Now let's look at how to style components in React Native.

{% highlight javascript %}
const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 14
  }
});
{% endhighlight %}

Style declarations in React Native are grouped in StyleSheet objects that look very similar to regular CSS stylesheets. Instead of using CSS-like selectors, styles are explicitly assigned to components based on their keys (`style={styles.buttonText}`). Style properties have the 'same' names as their CSS counterparts but instead of written with hyphens, they are written in camelCase. This makes it very easy to style components if you are already familiar with CSS. Pixel values (e.g. `padding: 15`) are device-dependent pixels. So they will result in larger paddings on larger devices automatically. Colors can be declared in your favorite color system, be it hex-values, `rgba()` or `hsl()`. Style inheritance like in CSS does exist as well by simply declaring styles in arrays: `style={[styles.button, style]}`. In that case, the attributes from `style` will override the attributes in `styles.button`. CSS shorthand-syntax e.g. `padding: 0 10;` are handled slightly differently in React Native. Instead of declaring shorthand values on the same key, the keys are split up into more specific keys. So `padding: 0 10;` becomes `paddingVertical: 0, paddingHorizontal: 10`. Same applies to several other definitions such as `border` or `margin`. For a complete list of supported CSS properties and their usage, check out the official documentation: <insert link to docs here>.

Now that we have a simple button component, let's create the menu component that renders the buttons.

- index.android.js + index.ios.js -> app-index.js
- weirdly start the game by building the menu
- build touchable primitives
- animated thing in the background?
