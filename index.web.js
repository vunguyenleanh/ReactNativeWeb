import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('ReactNativeWebDemo', () => App);
AppRegistry.runApplication('ReactNativeWebDemo', {
  initialProps: {},
  rootTag: document.getElementById('react-app')
});