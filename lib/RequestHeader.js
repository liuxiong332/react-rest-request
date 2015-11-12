import React from 'react'
import {Grid, Row, Col, DropdownButton, MenuItem, Input, Button} from 'react-bootstrap'

let RequestHeader = React.createClass({
  getInitialState() {
    return {value: ''};
  },

  handleChange() {
    this.setState({
      value: this.refs.input.getValue()
    });
  },

  validationState() {
    let length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  },

  render() {
    let methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];
    return (
      <Grid>
        <Row>
          <Col xs={2}>
            <DropdownButton title="Dropdown" id="bg-nested-dropdown">
              { methods.map((method, i) => <MenuItem key={i}>{method}</MenuItem>) }
            </DropdownButton>
          </Col>
          <Col xs={8}>
            <Input type="text" value={this.state.value} placeholder="Enter text"
              bsStyle={this.validationState()} hasFeedback ref="input"
              groupClassName="group-class" onChange={this.handleChange} />
          </Col>
          <Col xs={1}>
            <Button bsStyle="primary">Done</Button>
          </Col>
        </Row>
      </Grid>
    )
  }
});

export default RequestHeader;
