import React, { Component } from 'react';
import styled from 'styled-components';

const Opps = styled.div`
  position: relative;
  padding: 20px;
  border: 1px solid gray;
  border-radius: 20px;
  box-shadow: 5px 5px 5px #dddddd;
  margin-top: 50px;
`


class NotFound extends Component {
  render () {
    return (
      <div className="container text-center">
        <Opps>
          <h3>Opps! can not find the page! </h3>
        </Opps>
      </div>
    )
  }
}

export default NotFound