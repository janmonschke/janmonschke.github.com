---
title: Building a gpx editor with xstate and lit-html
type: blog
path: building-a-gpx-editor-with-xstate-and-lit-html
keywords: ['xstate', 'lit-html', 'gpx editor', 'side project']
date: 2021-11-11
pomodoros: 6
image: ./gpx-editor-state-machine.png
---

![GPX editor screenshot](./gpx-editor-screenshot.png)
<small><a href="https://janmonschke.com/gpx-editor" target="_blank">(try out the editor)</a></small>

When [I go hiking](https://aweekinthewoods.com/france/auvergne/), I am recording the trek with this battery efficient [GPS Logger app](https://gpslogger.app/) 🏕. Battery efficiency is important because there's often no way to charge my phone on a multi-day hike. The app let's me define custom intervals in which it records a GPS point which I usually set to somewhere betwwen 45 seconds and a minute. That resolution is accurate enough for recordings of walks and it does not add too much strain on my battery.

So the app is requesting a GPS fix at certain points in an interval and disables GPS in between the recordings. This results in inaccurate readings of elevation and sometimes inaccurate GPS locations. At least in my case and on my current phone. Which in turn means that when I upload the recording to a tour website like [komoot](https://www.komoot.com/user/214500264344) the stats can be quite off and people that use my GPS recording to go on the same tour might take wrong turns due to the inaccurate GPS 🛰.

For that reason I built a GPX editor which allows me to adjust the recorded points and then strip out the elevation recording. The cool thing about komoot is that they add the elevation info to your route if you don't provide any. The info is based on topology data that is a more accurate than my phone's recording.

My usual approach to building a small aoo like that would be to spin up [create-react-app](https://create-react-app.dev/) and code away. In the case of this small editor it did feel like overkill though and I was also interested in trying out a new kind of app setup. Due to my previous experience with [XState](https://xstate.js.org/docs/) I wanted to use it to drive the busness logic of the editor. For the rendering I used [list-html](https://lit-html.polymer-project.org/guide) which is tiny and super easy-to-use (when you're already familiar with sth. like jsx).

The last new building-block of my setup was [parcel](https://parceljs.org/). Previously I had pretty much exclusively used [webpack](https://webpack.js.org/) and I was in the mood for trying out something new. I was also curious to see if parcel really required zero configuration (spoiler: It really did not need any configuration 🎉).

![GPX editor diagram](./gpx-editor-diagram.png)

I tried to visualize the application architecture in the diagram above. At the core of it is the state machine. It holds all of the application's state, it transistions based on user interaction and performs side-effects when necessary. Side-effects may also cause transitions e.g. in case of a file parsing error.

The user interface reacts to the state machine's transitions. Depending on the current state, it will render the appropriate component. It also acts as the glue-code between user interaction and the machine:

```ts
editor.onTransition((state) => {
  switch (state.value) {
    case "choose-gpx":
      const onFileSelected = (file) => machine.send({ type: "FILE_SELECTED", file });

      return render(ChooseFile({ onFileSelected }), contentElement);
    case "export-gpx":
      return render(Export(), contentElement);
  }
})
```

For a given state of the machine, in this case `choose-gpx` and `export-gpx`, the application renders a different component. The application also defines callbacks for the components. These callbacks are executed on user interaction and they result in state transitions (and their side-effects e.g. file parsing).

```ts
type Props = {
  onFileSelected: (file: File) => void;
};
export const ChooseFile = (props: Props) =>
html`
  <form>
    <label>
      <input
        type="file"
        @change=${(event: Event) =>
          props.onFileSelected(
            (event.currentTarget as HTMLInputElement).files[0]
          )}
      />
      Select a .gpx file
    </label>
  </form>`;
```

The `ChooseFile` component renders a file input and calls the `onFileSelected` callback when a file gets selected. This is the same callback as we saw before in the application file. When the callback is invoked, the event is causing a transition of the state machine. Which in turn will then result in the render of a different component. Bonus: I like how this component almost looks like a React component 🎉.

![GPX editor state machine](./gpx-editor-state-machine.png)

In the diagram above you can see all of the state machine's states, it's transitions and side effects. The XState visualizer at [stately.ai/viz](https://stately.ai/viz) is just super amazing. You paste the machine's code and it will render this interactive diagram. It let's you play around with the transitions, send custom events and to save it to your account in case you want to show it to someone else. Pretty much every time I'm writing a state machine, I start inside this visualizer. It makes prototyping a workflow such a blast.

Overall I'm very happy with the current setup. I feel productive, the state machine adds a great structure and lit-html is a great renderer for small aplications like this one. I will definitely reuse this stack in other applications. If you are insterested in trying out the editor yourself, you can find it on https://janmonschke.com/gpx-editor. The code is up on GitHub at [janmonschke/gpx-editor](https://github.com/janmonschke/gpx-editor).

PS: A special shoutout goes out to [Leaflet](https://leafletjs.com/) an excellent map renderer and [spectre.css](https://picturepan2.github.io/spectre/) a great and light CSS framework
