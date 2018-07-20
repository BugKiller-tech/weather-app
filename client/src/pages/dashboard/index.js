import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import { AppBar } from 'material-ui';

import Sidebar from './Sidebar';

import DashboardMain from './dashboard-main';
import DataPage from './data-page';
import AccountsPage from './accounts-page';
import FtpAccounts from './ftp-accounts';
import WeatherStations from './weather-stations';
import DataPoints from './data-points';
import DataProcessing from './data-processing';
import NotFound from '../NotFound';

class Dashboard extends Component {
  state = {
    open: false,
  }
  toggleSidebar = () => {
    this.setState( {
      open: !this.state.open
    })
  }


  render () {
    console.log('dashboard', this.props);
    const { match } = this.props;
    return (
      <div>
        <AppBar
            title="WeatherAdda"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonClick = {this.toggleSidebar} 
          />
        <Sidebar open={this.state.open} toggleSidebar = {this.toggleSidebar} />

        <Switch>
          <Route path={`${match.url}/`} exact component={DashboardMain} />
          <Route path={`${match.url}/data`} exact component={DataPage} />
          <Route path={`${match.url}/accounts`} exact component={AccountsPage} />
          <Route path={`${match.url}/ftp-accounts`} exact component={FtpAccounts} />
          <Route path={`${match.url}/weather-stations`} exact component={WeatherStations} />
          <Route path={`${match.url}/data-points`} exact component={DataPoints} />
          <Route path={`${match.url}/data-cleanup`} exact component={DataProcessing} />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

export default Dashboard