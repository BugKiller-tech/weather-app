import React, { Component } from 'react'
import ReactTable from "react-table";
import * as moment from 'moment';


import { DateRangePicker, SingleDatePicker, DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';

import Spinner from 'react-spinkit';
import {CSVLink} from 'react-csv';

import api from '../../../api';
import { RaisedButton, RadioButtonGroup, RadioButton, IconButton } from 'material-ui';

import './style.css'

class DataPage extends Component {


  state = {
    date_selection_type: 'last_week',
    startDate: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    endDate: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    focusedInput: null,


    data: [],

    loading: false,
  }


  componentDidMount = () => {
    this.fetchData();    
  }

  fetchData = () => {

    // console.log(this.state.startDate, this.state.endDate);
    if (this.props.user && !this.props.user.isAdmin && this.props.user.fields.length <=0) {
      alert('You do not have any ability to browse data')
      return;
    }
    
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;

    if (this.state.date_selection_type == 'last_week') {
      startDate = moment().startOf('week').subtract(7, 'days');
      endDate =  moment().endOf('week').subtract(7, 'days').endOf('hour'); ; 
    } else if (this.state.date_selection_type == 'last_month') { 
      startDate = moment().subtract(1,'months').startOf('month');
      endDate =  moment().subtract(1,'months').endOf('month').endOf('hour'); ;
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
    var columns = [
      // { Header: 'className', accessor: 'className' },
      // { Header: 'location', accessor: 'location' },
      { Header: 'district', accessor: 'district' },
      { Header: 'village', accessor: 'village' },
      { Header: 'stationName', accessor: 'stationName' },
      { Header: 'date', accessor: 'date' },
      { Header: 'time', accessor: 'time' },
      { Header: 'tempOut', accessor: 'tempOut' },
      { Header: 'hiTemp', accessor: 'hiTemp' },
      { Header: 'lowTemp', accessor: 'lowTemp' },
      { Header: 'outHum', accessor: 'outHum' },
      { Header: 'dewpt', accessor: 'dewpt' },
      { Header: 'avgWindSpeed', accessor: 'avgWindSpeed' },
      { Header: 'hiWindSpeed', accessor: 'hiWindSpeed' },
      { Header: 'windDir', accessor: 'windDir' },
      { Header: 'bar', accessor: 'bar' },
      { Header: 'rain', accessor: 'rain' },
      { Header: 'rainRate', accessor: 'rainRate' },
      { Header: 'heatDD', accessor: 'heatDD' },
      { Header: 'coolDD', accessor: 'coolDD' },
      { Header: 'leafWet', accessor: 'leafWet' },
      { Header: 'batVlt', accessor: 'batVlt' },
    ]

    if (this.props.user && !this.props.user.isAdmin) {
      var availableFields = this.props.user.fields;
      columns = columns.filter(column => {
        return availableFields.includes(column.Header)
      })
    }
    const dispData = this.state.data;


    const downloadHeader = []
    columns.map(colume => {
      downloadHeader.push( {label: colume.Header, key: colume.accessor})
    })




    return (
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <h3>View Weather data</h3>
            <div className="row">
              <div className="col-lg-6 text-center">
                <RadioButtonGroup name="date_range_type" 
                  className="date-range-group" defaultSelected='last_week'
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
              <RaisedButton primary={true} label="Search" onClick={this.fetchData} style={{ margin: '10px' }} />
              <CSVLink data={dispData} headers={downloadHeader} filename={`weather-data-downloaded-at-${moment().toString()}`} style={{ float: 'right' }}>
                  Download as CSV
              </CSVLink>
              </div>
            </div>  
            <div className="row">
              <div className="col-md-12 text-center">
              { this.state.loading ? (
                  <div>
                    <Spinner name="pacman" style={{ display: 'inline-block' }} /> Loading data ...
                  </div>
                ) : '' }
              </div>
            </div>
            
            <ReactTable 
              data={dispData}
              columns={columns}
              defaultPageSize={13}
              filterable={true}
            />

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect( mapStateToProps )(DataPage);