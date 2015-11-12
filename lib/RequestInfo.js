import React from 'react'
import {Tabs, Tab} from 'react-bootstrap'

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
