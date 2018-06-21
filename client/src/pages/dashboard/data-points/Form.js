import React, { Component } from 'react'
import { Dialog } from 'material-ui';

class Form extends Component {
  state = {
    open: false
  }
  constructor (){
    
  }
  componentWillReceiveProps = () => {
    
  }
  render () {
    return (
      <Dialog
        title="Scrollable Dialog"
        // actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}>
      </Dialog>
    )
  }
}

export default Form