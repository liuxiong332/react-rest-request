import React from 'react'
import {Grid, Row, Col, DropdownButton, MenuItem, Input, Button} from 'react-bootstrap'

const METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

let RequestHeader = React.createClass({
  getDefaultProps() {
    return {method: 'GET', url: ''};
  },

  propTypes: {
    method: React.PropTypes.string,
    url: React.PropTypes.string,
    onMethodChange: React.PropTypes.func,
    onUrlChange: React.PropTypes.func
  },

  getMethod() {
    return this.state.methodKey;
  },

  getUrl() {
    return this.state.url;
  },

  componentWillReceiveProps(nextProps) {
    let {method, url} = nextProps;
    this.setState({methodKey: method, url});
  },

  componentWillMount() {
    let {method, url} = this.props;
    this.setState({methodKey: method, url});
  },

  handleChange(event) {
    let value = event.target.value;
    this.setState({url: value});
    let {onUrlChange} = this.props;
    if(onUrlChange) onUrlChange(value);
  },

  validationState() {
    let length = this.state.url.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  },

  onSelect(event, eventKey) {
    this.setState({methodKey: eventKey});
    let {onMethodChange} = this.props;
    if(onMethodChange) onMethodChange(eventKey);
  },

  render() {
    let {url, methodKey} = this.state;
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={2}>
            <DropdownButton title={methodKey} id="bg-nested-dropdown" onSelect={this.onSelect}>
              { METHODS.map((method, i) => <MenuItem eventKey={method} key={i}>{method}</MenuItem>) }
            </DropdownButton>
          </Col>
          <Col xs={8}>
            <Input type="text" value={url} placeholder="Enter text"
              bsStyle={this.validationState()} hasFeedback
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
