# Setup React Native Web project

1. Create a react native project

2. Installation react native web: 
```sh
yarn add react-dom react-native-web
yarn add --dev babel-plugin-react-native-web
npm install -g webpack-cli
```

3. Create a 'src' folder, move a 'App.js' file to this

4. Change import App in 'index.js' file:
```sh
import App from './src/App';
```

5. Create a 'index.web.js' in a root folder with content: 
```sh
import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('ReactNativeWebDemo', () => App);
AppRegistry.runApplication('ReactNativeWebDemo', {
  initialProps: {},
  rootTag: document.getElementById('react-app')
});
```

6. Create a folder 'web' in a root folder, create a 'dist' folder in this, create a 'index.html' file in 'dist' folder with content:
```sh
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">

  <title>ReactNativeWebDemo</title>
</head>

<body>
  <div id="react-app"></div>
  <script src="/bundle.js"></script>
</body>

</html>
```

7. Create a 'webpack.config.js' in 'web' folder with content:
```sh
const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native-uncompiled')
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // Babel configuration (or use .babelrc)
      // This aliases 'react-native' to 'react-native-web' and includes only
      // the modules needed by the app.
      plugins: ['react-native-web'],
      // The 'react-native' preset is recommended to match React Native's packager
      presets: ['react-native']
    }
  }
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]'
    }
  }
};

const devServer = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: 3000,
  },
}

module.exports = {
  devServer: devServer.devServer,
  devtool: 'source-map',
  // your web-specific entry file
  entry: path.resolve(appDirectory, 'index.web.js'),

  // configures where the build ends up
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // ...the rest of your config

  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration
    ]
  },

  plugins: [
    // `process.env.NODE_ENV === 'production'` must be `true` for production
    // builds to eliminate development checks and reduce build size. You may
    // wish to include additional optimizations.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV === 'production' || true
    })
  ],

  resolve: {
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: ['.web.js', '.js']
  }
}
```

8. Go to 'package.json' file, add script for build web:
```sh
"scripts": {
    ...
    "web": "webpack-dev-server --config web/webpack.config.js --hot"
  },
```

9. Build web:
```sh
yarn web
```
Open 'http://localhost:3000/' on browser for test local


# Setup delpoy to firebase for test public

1. Install firebase:
```sh
npm install -g firebase-tools
```

2. Firebase login in a root folder project:
```sh
firebase login
```
Login by google account

3. Create project in Firebase console website

4. Init firebase in project
```sh
firebase init
```
- Select Hosting

5. Edit a 'firebase.json' file with content:
```sh
{
  "hosting": {
    "public": "web/dist"
  }
}
```

6. Edit a '.firebaserc' file with content: 
```sh
{
  "projects": {
    "default": "[project name create in Firebase console]"
  }
}
```

7. Go to 'package.json' file, add script for deploy to firebase:
```sh
"scripts": {
    ...
    "web-build": "webpack -p --config web/webpack.config.js",
    "web-deploy": "firebase deploy",
    "web-release": "yarn web-build && yarn web-deploy"
  },
```

8. Run a command deploy app:
```sh
yarn web-release
```

