import React from 'react'
import {Tabs, Tab, Input, Grid, Row, Col, Button, Glyphicon} from 'react-bootstrap'
import StackFaIcon from './StackFaIcon'
import FaIconButton from './FaIconButton'

var IconLabel = React.createClass({
  render() {
    return <div className="icon-label"><Glyphicon glyph={this.props.glyph} /></div>;
  }
});

var KeyValueEditItem = React.createClass({
  render() {
    return (
      <Row>
        <Col xs={1}><FaIconButton faIconName="arrows" /></Col>
        <Col xs={4}><Input type="text" placeholder="Key"/></Col>
        <Col xs={4}><Input type="text" placeholder="Value"/></Col>
        <Col xs={1}><FaIconButton className="item-check check-active" faIconName="check"/></Col>
        <Col xs={1}><FaIconButton faIconName="remove"/></Col>
      </Row>
    )
  }
});

var KeyValueEditor = React.createClass({
  render() {
    return (
      <Grid>
        <KeyValueEditItem />
      </Grid>
    );
  }
});

var RequestInfo = React.createClass({
  render() {
    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title="Headers">
        </Tab>
        <Tab eventKey={2} title="Body">
        </Tab>
      </Tabs>
    )
  }
});

export default KeyValueEditor;
