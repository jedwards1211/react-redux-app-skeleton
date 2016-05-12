/* @flow */

import React, {Component, PropTypes} from 'react'

import {Body} from '../../mindfront-react-components/common/View.jsx'

import AppNavbar from './AppNavbar.js'

import './AppShell.sass'

type Props = {
  children: any,
};

export default class AppShell extends Component<void, Props, void> {
  static propTypes = {
    children: PropTypes.any.isRequired

  };
  render(): React.Element {
    // strip out some of these props
    let {children, ...props} = this.props

    return (<div className="mf-AppShell">
      <AppNavbar />
      <Body className="mf-AppShell-body">
        {React.cloneElement(children, props)}
      </Body>
    </div>)
  }
}
