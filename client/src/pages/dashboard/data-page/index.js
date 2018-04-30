import React, { Component } from 'react'
import ReactTable from "react-table";
import * as moment from 'moment';


import { DateRangePicker, SingleDatePicker, DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';

import Spinner from 'react-spinkit';




import api from '../../../api';
import { RaisedButton } from 'material-ui';

class DataPage extends Component {


  state = {
    startDate: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    endDate: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    focusedInput: null,


    data: [],

    loading: false,
  }


  componentDidMount = () => {
    
  }

  fetchData = () => {

    // console.log(this.state.startDate, this.state.endDate);
    if (this.props.user && !this.props.user.isAdmin && this.props.user.fields.length <=0) {
      alert('You do not have any ability to browse data')
      return;
    }

    this.setState({ loading: true })
    api.fetchData({
      startDate: this.state.startDate.unix(),
      endDate: this.state.endDate.set({ hour: 23, minute: 59, second:59, millisecond: 0 }).unix()
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

    return (
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <h3>View Weather data</h3>
            <div>
              <DateRangePicker
                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                startDateId="start_date_id" // PropTypes.string.isRequired,
                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                endDateId="end_date_id" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
              />
              <RaisedButton primary={true} label="Search" onClick={this.fetchData} />
              <br/>
              { this.state.loading ? (
                  <div>
                    <Spinner name="pacman" style={{ display: 'inline-block' }} /> Loading data ...
                  </div>
                ) : '' }
            </div>
            <ReactTable 
              data={dispData}
              columns={columns}
              defaultPageSize={15}
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