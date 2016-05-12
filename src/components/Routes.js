/* @flow */

import React, {Component} from 'react'
import Router from 'redux-plugins-immutable-react-router'
import {Route, Redirect, hashHistory} from 'react-router'

import AppShell from './AppShell'

// this class is basically just for hot-loading route changes
export default class Routes extends Component {
  routes: React.Element = <Route component={AppShell}>
    <Route path="/" component="div" />
    <Redirect from="/*" to="/" />
  </Route>;

  render(): React.Element {
    return (
      <Router history={hashHistory}>
        {this.routes}
      </Router>
    )
  }
}
