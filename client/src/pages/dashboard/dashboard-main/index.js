import React, { Component } from 'react'
import { Fragment } from 'react';
import PropTypes from 'prop-types';


// import { Pie, Bar, Line } from 'react-chartjs';
import { Line } from 'react-chartjs-2';
import { Paper, DropDownMenu, MenuItem } from 'material-ui';

import * as moment from 'moment';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import api from '../../../api';
import { RaisedButton, RadioButtonGroup, RadioButton } from 'material-ui';
import Spinner from 'react-spinkit';
import { fetchAllWeatherStations } from '../../../actions/weather-stations';
import { fetchAllDataPoints } from '../../../actions/data-points';
import Select from 'react-select';

import './style.css'

const graphColors = [
  '244,67,54',
  '233,30,99',
  '156,39,176',
  '103,58,183',
  '63,81,181',
  '33,150,243',
  '3,169,244',
  '0,188,212',
  '0,150,136',
  '76,175,80',
  '139,195,74',
  '205,220,57',
  '255,235,59',
  '255,193,7',
  '255,152,0',
  '255,87,34',
  '121,85,72',
  '158,158,15',
  '96,125,139',
  '0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0','0,0,0',
]

class DashboardMain extends Component {
  state = {
    
    date_selection_type: 'last_week',
    startDate: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    endDate: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    focusedInput: null,

    selectedLocations: [],

    data: [],

    user: {},
    allLocations: [],
    loading: false,

  }
  componentDidMount = () => {
    this.setState({ user: this.props.user, allLocations: this.props.allLocations })
    this.props.fetchAllWeatherStations();
    if (this.props.dataPoints.length <= 0) this.props.fetchAllDataPoints();
    this.fetchData();
  }
  componentWillReceiveProps = (nextProps) => {
    var nextState = { ...this.state }

    if (nextProps.allLocations) { 
      nextState.allLocations = nextProps.allLocations 
      if (this.state.user && this.state.user.isAdmin) {
        if (this.state.selectedLocations.length == 0 && nextProps.allLocations.length > 0)
          nextState.selectedLocations = [{ value: nextProps.allLocations[0]._id, label: nextProps.allLocations[0].code }];
      }
    }

    if (nextProps.user) { 
      nextState.user = nextProps.user 
      if (!nextProps.user.isAdmin && nextProps.user.locations.length > 0) {
        if (this.state.selectedLocations.length == 0 && nextProps.allLocations.length > 0)
          nextState.selectedLocations = [{ value: nextProps.user.locations[0]._id, label: nextProps.user.locations[0].code }];
      }
    }
    this.setState(nextState);
    
  }

  fetchData = () => {

    // console.log(this.state.startDate, this.state.endDate);
    // if (this.props.user && this.props.user.fields.length <=0) {
    //   alert('You do not have any ability to browse data')
    //   return;
    // }

    var startDate = this.state.startDate;
    var endDate = this.state.endDate;

    if (this.state.date_selection_type == 'last_week') {
      startDate = moment().startOf('week').subtract(7, 'days');
      endDate =  moment().endOf('week').subtract(7, 'days').endOf('hour'); 
    } else if (this.state.date_selection_type == 'last_month') { 
      startDate = moment().subtract(1,'months').startOf('month');
      endDate =  moment().subtract(1,'months').endOf('month').endOf('hour');
    }

    this.setState({ loading: true })
    api.fetchData({
      startDate: startDate,
      endDate: endDate.set({ hour: 23, minute: 59, second:59, millisecond: 0 })
    })
    .then(res => {
      console.log(res.data);
      this.setState({
        data: res.data.data,
        loading: false,
      })
    })
    .catch(err => {
      this.setState({
        data: [],
        loading: false,
      })
      console.log(err);
    })
  }
  render () {

    const { user } = this.state;

    var interestedLocationOptions = [];

    if (this.props.user) {
      if (this.props.user.isAdmin) {
        interestedLocationOptions = this.props.allLocations.map((item, idx) => {
          return {
            value: item._id,
            label: item.code
          }
        })
      } else{
        interestedLocationOptions = this.props.user.locations.map((item, idx) => {
          return {
            value: item._id,
            label: item.code
          }
        })
        console.log('user from redux', this.props.user);
        console.log('user locations', interestedLocationOptions)
      }
    }

    const allDrawData = { };
    this.props.dataPoints.map(item => {
      if (item.isChartDispElement) allDrawData[item.name] = {};
    })
    console.log('drawArrays', allDrawData);
    

    
    var xAxislabels = [];

    const interestedLocations = this.state.selectedLocations.map(location => location.label);
    const interestedLocationCount = interestedLocations.length;

    if (interestedLocationCount > 0) {
      Object.keys(allDrawData).map(drawItemKey => {

        for(var i = 0; i<interestedLocationCount; i++) {
          
          var currentLocation = interestedLocations[i];
          
          var sum_data1 = 0; var sumcount1 = 0;  const drawData1 = []  //hiTemp
          var currentDate = moment().add(-100, 'days');
          const labels = []

          this.state.data.map(d => {
            if (d.station.code != currentLocation) { return }
            let date = moment(d.time);
            if (date.diff(currentDate) > 0)  {
              labels.push(currentDate)
              
              if (sumcount1 != 0) {  drawData1.push(sum_data1 / sumcount1) } else {  drawData1.push(0) }
              sumcount1 = 1;  sum_data1 = parseFloat(d[drawItemKey]);
              
              currentDate = d.date;

            } else {
              sumcount1 += 1; sum_data1 += parseFloat(d[drawItemKey])
            }
          })
          labels.push(currentDate.format('YYYY/MM/DD'));
          if (sumcount1 != 0) {  drawData1.push(sum_data1 / sumcount1) } else {  drawData1.push(0) }


          allDrawData[drawItemKey][currentLocation] = drawData1;

          if (labels.length > xAxislabels.length) {
            xAxislabels = labels
            console.log('x axis labels', xAxislabels)
            console.log('labels', labels);
          }
        }
      })
    }


    const drawLineData = {};
    Object.keys(allDrawData).map(fieldKey => {
      drawLineData[fieldKey] = {
        labels: xAxislabels,
        datasets: [ ]
      };

      if (interestedLocationCount > 0) {
        for (var i=0; i<interestedLocations.length; i++) {
          let codeName = interestedLocations[i];
          if (allDrawData[fieldKey][codeName].length >= 1) {
            drawLineData[fieldKey].datasets.push({
              label: codeName,
              fill: false,
              borderColor: `rgba(${graphColors[i]}, 1)`,
              pointBorderColor: `rgba(${graphColors[i]}, 1)`,
              // backgroundColor: `rgba(${graphColors[i]}, 0.4)`,
              data: allDrawData[fieldKey][codeName]
            });
          }
        }
      }
    });
    console.log('DASHBOARD TOTAL CALC', allDrawData, drawLineData);

    

    return (
      <div className="container-fluid">
        <h3 className="text-center m-3">Welcome to Admin Page!!</h3>
            {/* { console.log('~~~~~~~ data ~~~~~~~~~')}
            { console.log(xAxislabels) }
            { console.log(hiTempLineData) } 
            { console.log(lowTempLineData) }
            { console.log(rainTempLineData) } */}
        <div className="text-center mb-2">
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-2 text-center" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="align-bottom"> Pick Location interested:</span>
            </div>
            <div className="col-md-6 text-center">
              <Select
                name="form-locations"
                className="mt-3 mb-3"
                value={this.state.selectedLocations}
                onChange={(selectedFields) => { this.setState({ selectedLocations: selectedFields }) }}
                multi={true}
                
                options={interestedLocationOptions}
              />
            </div>
          </div>
          <div className="row">
            
            <div className="col-lg-12 text-center">
              <DropDownMenu 
                  value={this.state.date_selection_type} 
                  onChange={ (event, index, value) => { this.setState({ date_selection_type: value }) }}
                  style={{ minWidth: '200px'}}
                  >
                  <MenuItem value={"last_week"} primaryText="Last Week" ></MenuItem>
                  <MenuItem value={"last_month"} primaryText="Last Month"></MenuItem>
                  <MenuItem value={"custom"} primaryText="Custom"></MenuItem>
              </DropDownMenu>
              <DateRangePicker
                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                startDateId="start_date_id" // PropTypes.string.isRequired,
                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                endDateId="end_date_id" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                disabled={ this.state.date_selection_type !='custom' ? true: false }
              />
              <RaisedButton primary={true} label="Search" onClick={this.fetchData} style={{ marginLeft: '30px' }} />
            </div>
          </div>  
      
          { this.state.loading ? (
            <div className="loading-indicator">
              <Spinner name="pacman" style={{ display: 'inline-block' }} />
            </div>
            ) : '' }
        </div>
        <div className="row">
        {
            Object.keys(drawLineData).map((fieldKey, index) => {
              return (
                <div className="col-md-6 text-center no-padding" key={index}>
                  <Paper style={{padding: '10px'}}>
                    <h4>{fieldKey} Graph</h4>
                    { interestedLocationCount > 0 && xAxislabels.length > 1 &&
                      <Line data={drawLineData[fieldKey]} options={{ responsive: true }}/>
                    }
                  </Paper>
                </div>
              )
            })
        }
        </div>
      </div>
    )
  }
}

DashboardMain.propTypes = {
  fetchAllWeatherStations: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    allLocations: state.stations.stations,
    dataPoints: state.dataPoints.dataPoints,
  }
}
export default connect(mapStateToProps, { fetchAllWeatherStations, fetchAllDataPoints })(DashboardMain);