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
import { RaisedButton, RadioButtonGroup, RadioButton, IconButton, DropDownMenu, MenuItem } from 'material-ui';

import './style.css'

class DataPage extends Component {

  state = {
    date_selection_type: 'last_week',
    startDate: moment().startOf('week').subtract(7, 'days'),
    endDate:  moment().endOf('week').subtract(7, 'days').endOf('hour'),
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
      startDate: startDate,   // startDate.unix()
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

  setDateRangeType = (value) => {
    var startDate = undefined, endDate;
    if (value == 'last_week') {
      startDate = moment().startOf('week').subtract(7, 'days');
      endDate =  moment().endOf('week').subtract(7, 'days').endOf('hour'); 
    } else if (value == 'last_month') { 
      startDate = moment().subtract(1,'months').startOf('month');
      endDate =  moment().subtract(1,'months').endOf('month').endOf('hour');
    }
    if (startDate) {
      this.setState({ date_selection_type: value, startDate, endDate })
    } else {
      this.setState({ date_selection_type: value })
    }
  }

  render () {
    var dispData = this.state.data;

    var columns = [
      {
        'Header': 'Station',
        'accessor': 'station',
        // Cell: data => {
        //   return (
        //     data.value != undefined ? data.value.code : ''
        //   )
        // },
        // filterMethod: (filter, row) => {
        //   return row[filter.id].code.startsWith(filter.value) ||
        //          row[filter.id].code.endsWith(filter.value)
        // }
      },
      {
        'Header': 'Time',
        accessor: 'time',
      }
    ];
    const ignoreColumns = ['_id', 'station', '__v', 'updatedAt', 'published', 'createdAt', 'time'];
    
    
    if (dispData.length > 0) {
      dispData.map(oneData => {
        Object.keys(oneData).map(item => {
          if (ignoreColumns.includes(item)) return;

          if (columns.find(function(elem) { return elem.Header == item  }) == undefined) {
            columns.push({
              Header: item,
              accessor: item
            })
          }

        })
      })
    }
    

    if (this.props.user && !this.props.user.isAdmin) {
      var availableFields = this.props.user.fields.map(item => { return item.name });
      columns = columns.filter(column => {
        if (column.accessor == 'station') return true;
        return availableFields.includes(column.Header) 
      })

      dispData = dispData.filter(data => {
        let availableLocationIds = this.props.user.locations.map(item => { return item._id });
        return availableLocationIds.includes(data.station._id);
      })
    }


    const csvData = dispData.map((item, idx) => {
      // if (idx < 3) console.log('csv data making', item);
      item.station = item.station ? item.station.code : '';
      item.time = item.time ?  moment(item.time).format('YYYY-MM-DD HH:mm') : ''
      return item;
    })

    console.log('displaying data is', dispData);
    

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
              <div className="col-lg-12 text-center">
              <DropDownMenu 
                  value={this.state.date_selection_type} 
                  onChange={ (event, index, value) => { this.setDateRangeType(value) }}
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
                // isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                isOutsideRange={() => false}
                disabled={ this.state.date_selection_type !='custom' ? true: false }
              />
              <RaisedButton primary={true} label="Search" onClick={this.fetchData} style={{ margin: '10px' }} />
              <CSVLink data={csvData} headers={downloadHeader} filename={`weather-data-downloaded-at-${moment().toString()}.csv`} style={{ float: 'right' }}>
                  Download as CSV
              </CSVLink>
              </div>
            </div>  
            { this.state.loading ? (
                <div className="loading-indicator">
                  <Spinner name="pacman" style={{ display: 'inline-block' }} />
                </div>
              ) : '' }
            
            <ReactTable 
              data={csvData}
              columns={columns}
              defaultPageSize={10}
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