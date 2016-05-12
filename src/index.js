import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import Routes from './components/Routes'
import FastClick from 'fastclick'
import Immutable from 'immutable'

import './index.sass'

let devGlobals = require('./util/devGlobals') // require because module doesn't use es6 export
devGlobals.React = React

if ('production' !== process.env.NODE_ENV) {
  try {
    var installDevTools = require("immutable-devtools")
    if (installDevTools.default) installDevTools = installDevTools.default
    installDevTools(Immutable)
  }
  catch (e) {
    /* eslint-disable no-console */
    console.error(e.stack)
    /* eslint-enable no-console */
  }
}

const store = configureStore(Immutable.Map())
devGlobals.store = store

FastClick.attach(document.body)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
