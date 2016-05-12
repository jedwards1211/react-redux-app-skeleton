import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import appMiddleware from '../middleware'
import {createPluggableMiddleware} from 'mindfront-redux-utils'

let middleware = []

if ("production" !== process.env.NODE_ENV) {
  middleware.push(createLogger())
}

let pluggableAppMiddleware = createPluggableMiddleware(appMiddleware)

middleware.push(pluggableAppMiddleware)

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })

    // enable Webpack hot module replacement for middleware
    module.hot.accept('../middleware', () => {
      pluggableAppMiddleware.replaceMiddleware(require('../middleware').default)
    })
  }

  return store
}
