import React, { Component } from 'react'
import { Fragment } from 'react';
import { Pie, Bar, Line } from 'react-chartjs';
import { Paper } from 'material-ui';

import * as moment from 'moment';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import api from '../../../api';
import { RaisedButton, RadioButtonGroup, RadioButton } from 'material-ui';
import Spinner from 'react-spinkit';

class DashboardMain extends Component {
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
    if (this.props.user && this.props.user.fields.length <=0) {
      alert('You do not have any ability to browse data')
      return;
    }

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

    var currentDate = '';


    const labels = []
    
    var sum_data1 = 0; var sumcount1 = 0;  const drawData1 = []  //hiTemp
    var sum_data2 = 0; var sumcount2 = 0;  const drawData2 = [] // lowTemp
    var sum_data3 = 0; var sumcount3 = 0;  const drawData3 = []  //rain
        
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
        sumcount1 += 1; sum_data1 += parseFloat(d.hiTemp)
        sumcount2 += 1; sum_data2 += parseFloat(d.lowTemp)
        sumcount3 += 1; sum_data3 += parseFloat(d.rain)
      }
    })

    labels.push(currentDate)
    if (sumcount1 != 0) {  drawData1.push(sum_data1 / sumcount1) } else {  drawData1.push(0) }
    if (sumcount2 != 0) {  drawData2.push(sum_data2 / sumcount2) } else {  drawData2.push(0) }
    if (sumcount3 != 0) {  drawData3.push(sum_data3 / sumcount3) } else {  drawData3.push(0) }

    const hiTempLineData = {
      labels: labels,
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: drawData1
        },
      ]
    };

    const lowTempLineData = {
      labels: labels,
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: drawData2
        },
      ]
    };

    const rainTempLineData = {
      labels: labels,
      datasets: [
        {
          label: "My First dataset",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: drawData3
        },
      ]
    };

    // const allLineData = {
    //   labels: labels,
    //   datasets: [
    //     {
    //       label: "hiTemp",
    //       fillColor: "rgba(220,220,220,0.2)",
    //       strokeColor: "rgba(220,220,220,1)",
    //       pointColor: "rgba(220,220,220,1)",
    //       pointStrokeColor: "#fff",
    //       pointHighlightFill: "#fff",
    //       pointHighlightStroke: "rgba(220,100,100,1)",
    //       data: drawData1
    //     },
    //     {
    //       label: "lowTemp",
    //       fillColor: "rgba(220,220,220,0.2)",
    //       strokeColor: "rgba(220,220,220,1)",
    //       pointColor: "rgba(220,220,220,1)",
    //       pointStrokeColor: "#fff",
    //       pointHighlightFill: "#fff",
    //       pointHighlightStroke: "rgba(100,220,100,1)",
    //       data: drawData2
    //     },
    //     {
    //       label: "Rain",
    //       fillColor: "rgba(220,220,220,0.2)",
    //       strokeColor: "rgba(220,220,220,1)",
    //       pointColor: "rgba(220,220,220,1)",
    //       pointStrokeColor: "#fff",
    //       pointHighlightFill: "#fff",
    //       pointHighlightStroke: "rgba(100,100,220,1)",
    //       data: drawData3
    //     },
    //   ]
    // };

    


    return (
      <div className="container-fluid">
        <h3 className="text-center m-3">Welcome to Admin Page!!</h3>
        <div className="text-center mb-2">
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
          <div className="row">
            <div className="col-md-12 text-center">
            { this.state.loading ? (
                <div>
                  <Spinner name="pacman" style={{ display: 'inline-block' }} /> Loading data ...
                </div>
              ) : '' }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 text-center mb-1">
            <Paper style={{padding: '10px'}}>
              <h4>hiTemp Graph</h4>
              <Line data={hiTempLineData} options={{ responsive: true }}/>
            </Paper>
          </div>
          <div className="col-md-6 text-center mb-1">
            <Paper style={{padding: '10px'}}>
              <h4>lowTemp Graph</h4>
              <Line data={lowTempLineData} options={{ responsive: true }}/>
            </Paper>
          </div>
          <div className="col-md-6 text-center mb-1">
            <Paper style={{padding: '10px'}}>
              <h4>Rain Graph</h4>
              <Line data={rainTempLineData} options={{ responsive: true }}/>
            </Paper>
          </div>

        </div>
      </div>
    )
  }
}

export default DashboardMain;