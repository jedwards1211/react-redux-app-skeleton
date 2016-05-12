/* @flow */

import {composeMiddleware} from 'mindfront-redux-utils'
import {pluginMiddleware} from 'redux-plugins-immutable'

export default composeMiddleware(
  pluginMiddleware
)
