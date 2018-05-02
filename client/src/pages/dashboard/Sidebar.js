import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {Fragment} from 'react';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import { Menu, MenuItem, Divider, Subheader, Toggle, FontIcon } from 'material-ui';
import { connect } from 'react-redux';
import { logout } from '../../actions/users';

import AppBar from 'material-ui/AppBar/AppBar';


class Sidebar extends Component {

  menus = [
    {
      name: 'dashboard-route',
      text: 'Dashboard',
      path: '',
      icon: 'home',
      hasChild: false,
      adminOnly: false,
    },
    {
      name: 'data',
      text: 'Data',
      path: 'data',
      icon: 'pageview',
      hasChild: false,
      adminOnly: false,
    },
    {
      name: 'account-man',
      text: 'Accounts Management',
      path: 'accounts',
      icon: 'account_circle',
      hasChild: false,
      adminOnly: true,
    },
    {
      name: 'logout',
      text: 'Log Out',
      path: 'logout',
      icon: 'account_circle',
      hasChild: false,
      adminOnly: false,
    }
   
  ]

  state = {
      open: false
      
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState( {
      open: nextProps.open
    })
  }
  
  toggleSidebar = (open) => {
    this.props.toggleSidebar(open);
    this.setState({ open})
  }
  menuClick = (path) => {
    this.toggleSidebar(!this.state.open);
    let prefix = this.props.match.url; if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
    
    if (path == 'logout') {
      this.props.logout();
      this.props.history.push('/');
      return;
    }


    this.props.history.push(`${prefix}/${path}`);
  }
  render () {
    var menus = this.menus;
    
    if (this.props.user && !this.props.user.isAdmin) {
      menus = menus.filter(menu => {
        return menu.adminOnly != true
      })
    }

    const menuRender = menus.map((menu, index) => {
      if (!menu.hasChild) {
        return (
          <Fragment key={index}>
            <ListItem primaryText={menu.text} leftIcon={<FontIcon className="material-icons">{menu.icon}</FontIcon>} onClick={() => {this.menuClick(menu.path)}} /> <Divider />
          </Fragment>
        );
      } else {
        return (
          <Fragment key={index}>
            <ListItem primaryText={menu.text} leftIcon={<FontIcon className="material-icons">{menu.icon}</FontIcon>} 
              primaryTogglesNestedList={true}
              nestedItems={
                menu.childs.map((submenu, index1) => (
                  <ListItem key={index1} primaryText={submenu.text} leftIcon={<FontIcon className="material-icons">{submenu.icon}</FontIcon>} />
                ))
              }
              />
            <Divider />
          </Fragment>
        );
      }
    })
    return (
      <div>
        <Drawer 
          open={this.state.open}
          docked={false}
          onRequestChange={this.toggleSidebar}
          label="adfasd"
          >
          <AppBar primaryText="" showMenuIconButton={false} title="WeatherAdda" />
          <List>
            { menuRender }
          </List>

        </Drawer>
      </div>
    )
  }
}
Sidebar.propTypes = {
  open: PropTypes.bool,
  toggleSidebar: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}
export default withRouter(
  connect(mapStateToProps, { logout })(Sidebar)
);
