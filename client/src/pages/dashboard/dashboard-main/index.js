import React, { Component } from 'react'
import { Fragment } from 'react';
import PropTypes from 'prop-types';


// import { Pie, Bar, Line } from 'react-chartjs';
import { Line } from 'react-chartjs-2';
import { Paper } from 'material-ui';

import * as moment from 'moment';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import api from '../../../api';
import { RaisedButton, RadioButtonGroup, RadioButton } from 'material-ui';
import Spinner from 'react-spinkit';
import { fetchAllLocations } from '../../../actions/weather-datas';
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
    this.props.fetchAllLocations();
    this.fetchData();
  }
  componentWillReceiveProps = (nextProps) => {
    var nextState = { ...this.state }

    if (nextProps.allLocations) { 
      nextState.allLocations = nextProps.allLocations 
      if (this.state.user && this.state.user.isAdmin) {
        if (this.state.selectedLocations.length == 0)
          nextState.selectedLocations = [{ value: nextProps.allLocations[0], label: nextProps.allLocations[0] }];
      }
    }

    if (nextProps.user) { 
      nextState.user = nextProps.user 
      if (!nextProps.user.isAdmin && nextProps.user.locations.length > 0) {
        if (this.state.selectedLocations.length == 0)
          nextState.selectedLocations = [{ value: nextProps.user.locations[0], label: nextProps.user.locations[0] }];
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
      startDate: startDate.unix(),
      endDate: endDate.set({ hour: 23, minute: 59, second:59, millisecond: 0 }).unix()
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
        interestedLocationOptions = this.props.allLocations.map((name, idx) => {
          return {
            value: name,
            label: name
          }
        })
      } else{
        interestedLocationOptions = this.props.user.locations.map((name, idx) => {
          return {
            value: name,
            label: name
          }
        })
        console.log('user from redux', this.props.user);
        console.log('user locations', interestedLocationOptions)
      }
    }
    


    
    

    const hiTempDrawDatas = {};
    const lowTempDrawDatas = {};
    const rainDrawDatas = {};
    var xAxislabels = []

    const interestedLocations = this.state.selectedLocations.map(location => location.value);
    const interestedLocationCount = interestedLocations.length;

    if (interestedLocationCount > 0) {
      for(var i = 0; i<interestedLocationCount; i++) {

        var currentLocation = interestedLocations[i];


        var sum_data1 = 0; var sumcount1 = 0;  const drawData1 = []  //hiTemp
        var sum_data2 = 0; var sumcount2 = 0;  const drawData2 = [] // lowTemp
        var sum_data3 = 0; var sumcount3 = 0;  const drawData3 = []  //rain
        var currentDate = '';
        const labels = []

        this.state.data.map(d => {
          if (d.date != currentDate)  {
            labels.push(currentDate)
            
            if (sumcount1 != 0) {  drawData1.push(sum_data1 / sumcount1) } else {  drawData1.push(0) }
            sumcount1 = 1;  sum_data1 = parseFloat(d.hiTemp);

            if (sumcount2 != 0) {  drawData2.push(sum_data2 / sumcount2) } else {  drawData2.push(0) }
            sumcount2 = 1;  sum_data2 = parseFloat(d.lowTemp);

            if (sumcount3 != 0) {  drawData3.push(sum_data3 / sumcount3) } else {  drawData3.push(0) }
            sumcount3 = 1;  sum_data3 = parseFloat(d.rain);



            currentDate = d.date;

          } else {
            if (d.location != currentLocation) { return }
            sumcount1 += 1; sum_data1 += parseFloat(d.hiTemp)
            sumcount2 += 1; sum_data2 += parseFloat(d.lowTemp)
            sumcount3 += 1; sum_data3 += parseFloat(d.rain)
          }
        })
        labels.push(currentDate)
        if (sumcount1 != 0) {  drawData1.push(sum_data1 / sumcount1) } else {  drawData1.push(0) }
        if (sumcount2 != 0) {  drawData2.push(sum_data2 / sumcount2) } else {  drawData2.push(0) }
        if (sumcount3 != 0) {  drawData3.push(sum_data3 / sumcount3) } else {  drawData3.push(0) }


        hiTempDrawDatas[currentLocation] = drawData1;
        lowTempDrawDatas[currentLocation] = drawData2;
        rainDrawDatas[currentLocation] = drawData3;
        if (labels.length > xAxislabels.length) {
          xAxislabels = labels
          console.log('x axis labels', xAxislabels)
          console.log('labels', labels);
        }
        
      }
    }


    const hiTempLineData = {
      labels: xAxislabels,
      datasets: [ ]
    };

    const lowTempLineData = {
      labels: xAxislabels,
      datasets: [ ]
    };

    const rainTempLineData = {
      labels: xAxislabels,
      datasets: []
    };

    if (interestedLocationCount > 0) {
      for (var i=0; i<interestedLocations.length; i++) {
        if (hiTempDrawDatas[interestedLocations[i]].length > 1) {
          hiTempLineData.datasets.push({
            label: interestedLocations[i],
            fill: false,
            borderColor: `rgba(${graphColors[i]}, 1)`,
            pointBorderColor: `rgba(${graphColors[i]}, 1)`,
            // backgroundColor: `rgba(${graphColors[i]}, 0.4)`,
            data: hiTempDrawDatas[interestedLocations[i]]
          });
        }
        if(lowTempDrawDatas[interestedLocations[i]].length > 1) {
          lowTempLineData.datasets.push({
            label: interestedLocations[i],
            fill: false,
            borderColor: `rgba(${graphColors[i]}, 1)`,
            pointBorderColor: `rgba(${graphColors[i]}, 1)`,
            // backgroundColor: `rgba(${graphColors[i]}, 0.4)`,
            data: lowTempDrawDatas[interestedLocations[i]]
          });
        }
        if( rainDrawDatas[interestedLocations[i]].length > 1 ) {
          rainTempLineData.datasets.push({
            label: interestedLocations[i],
            fill: false,
            borderColor: `rgba(${graphColors[i]}, 1)`,
            pointBorderColor: `rgba(${graphColors[i]}, 1)`,
            // backgroundColor: `rgba(${graphColors[i]}, 0.4)`,
            data: rainDrawDatas[interestedLocations[i]]
          });
        }
      }
    }
    


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
            
            <div className="col-lg-6 text-center">
              <RadioButtonGroup name="date_range_type" 
                style={{ display: 'inline-flex', minWidth: '450px' }} defaultSelected='last_week'
                onChange={(e) => { this.setState({ date_selection_type: e.target.value }) }}
                >
                <RadioButton value="last_week" label="Last Week" ></RadioButton>
                <RadioButton value="last_month" label="Last Month"></RadioButton>
                <RadioButton value="custom" label="Custom"></RadioButton>
              </RadioButtonGroup>
            </div>
            <div className="col-lg-6 text-center">
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
          <div className="col-md-6 text-center no-padding">
            <Paper style={{padding: '10px'}}>
              <h4>hiTemp Graph</h4>
              { interestedLocationCount > 0 && xAxislabels.length > 1 ?
              <Line data={hiTempLineData} options={{ responsive: true }}/>
              : '' }
            </Paper>
          </div>
          <div className="col-md-6 text-center no-padding">
            <Paper style={{padding: '10px'}}>
              <h4>lowTemp Graph</h4>
              { interestedLocationCount > 0 && xAxislabels.length > 1 ?
              <Line data={lowTempLineData} options={{ responsive: true }}/>
              : '' }
            </Paper>
          </div>
          <div className="col-md-6 text-center no-padding">
            <Paper style={{padding: '10px'}}>
              <h4>Rain Graph</h4>
              { interestedLocationCount > 0 && xAxislabels.length > 1 ?
              <Line data={rainTempLineData} options={{ responsive: true }}/>
              : '' }
            </Paper>
          </div>

        </div>
      </div>
    )
  }
}

DashboardMain.propTypes = {
  fetchAllLocations: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    allLocations: state.weatherData.allLocations
  }
}
export default connect(mapStateToProps, { fetchAllLocations })(DashboardMain);