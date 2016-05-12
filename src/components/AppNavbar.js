/* @flow */

import React, {Component, PropTypes} from 'react'
import * as Immutable from 'immutable'
import {connect} from 'react-redux'

import Navbar, {NavLink} from '../../mindfront-react-components/bootstrap/Navbar.jsx'

import type {Dispatch} from '../../mindfront-react-components/flowtypes/reduxTypes'

import * as actions from '../actions/rootActions'

type SelectProps = {
  navbarExpanded?: boolean,
};

type ReduxProps = {
  dispatch: Dispatch
};

type Props = SelectProps & ReduxProps;

class AppNavbar extends Component<void, Props, void> {
  static propTypes = {
    navbarExpanded: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  };
  onCollapse = () => {
    if (this.props.navbarExpanded) {
      this.props.dispatch(actions.setNavbarExpanded(false))
    }
  };
  onExpand = () => {
    if (!this.props.navbarExpanded) {
      this.props.dispatch(actions.setNavbarExpanded(true))
    }
  };
  render(): React.Element {
    let {navbarExpanded} = this.props

    return (<Navbar className="mf-navbar navbar-inverse navbar-fixed-top" expanded={navbarExpanded}
        onCollapse={this.onCollapse} onExpand={this.onExpand}
            >
      <Navbar.Nav>
        <NavLink to={'/'}>Home</NavLink>
      </Navbar.Nav>
    </Navbar>)
  }
}

function select(state: Immutable.Map): SelectProps {
  return {
    navbarExpanded: state.get('navbarExpanded')
  }
}

export default connect(select)(AppNavbar)
