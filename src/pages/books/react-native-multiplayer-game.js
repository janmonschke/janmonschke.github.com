import React from 'react';
import cover from './assets/react-native-multiplayer-game-cover-v2.png';
import Newsletter from '../../components/Newsletter';
import './react-native-multiplayer-game.css';

export default function ReactNativeMultiplayerGame() {
  return (
    <div className="reactNativeMGBook">
      <div className="reactNativeMGBook__bg"></div>
      <h1>Learn how to build a miltiplayer game</h1>
      <img src={cover} />
      <Newsletter />
    </div>
  );
}
