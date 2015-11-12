import React from 'react'
import {Tabs, Tab, Input, Grid, Row, Col, Button, Glyphicon} from 'react-bootstrap'

var IconLabel = React.createClass({
  render() {
    return <div className="icon-label"><Glyphicon glyph={this.props.glyph} /></div>;
  }
});

var KeyValueEditItem = React.createClass({
  render() {
    return (
      <Row>
        <Col xs={1}><IconLabel glyph="list" /></Col>
        <Col xs={4}><Input type="text" placeholder="Key"/></Col>
        <Col xs={4}><Input type="text" placeholder="Value"/></Col>
        <Col xs={2}>
          <Button><Glyphicon glyph="ok" /></Button>
          <Button><Glyphicon glyph="remove" /></Button>
        </Col>
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
