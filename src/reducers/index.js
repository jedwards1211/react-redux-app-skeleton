/* @flow */

import {pluginReducer} from 'redux-plugins-immutable'

import {composeReducers} from 'mindfront-redux-utils'
import combineImmutableReducers from './../../mindfront-react-components/reducers/combineImmutableReducers'
import documentViewReducer from '../../mindfront-react-components/DocumentView/documentViewReducer'
import autobindReducer from '../../mindfront-react-components/Autobind/autobindReducer'

import * as rootActions from '../actions/rootActions'

import {createPayloadReducer} from './../../mindfront-react-components/reducers/commonReducers'

let rootReducer = combineImmutableReducers({
  navbarExpanded:       createPayloadReducer(false,           rootActions.SET_NAVBAR_EXPANDED)
})

export default composeReducers(
  rootReducer,
  pluginReducer,
  documentViewReducer,
  autobindReducer
)
