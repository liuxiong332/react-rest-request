import React from 'react'
import {Tabs, Tab, Label} from 'react-bootstrap'
import AceEditor from 'react-ace'

require('brace/mode/json');
require('brace/theme/github');

var ArrowRight = function() {
  return <i className="fa fa-arrow-right"></i>
}

var ResponseHeaders = React.createClass({
  propTypes: {
    headers: React.PropTypes.object
  },

  render() {
    let headers = this.props.headers;
    let children = [];
    for(let key in headers)
      children.push(<p key={key}>{key} <ArrowRight/> {headers[key]}</p>);
    return <div>{children}</div>
  }
});

var ResponseInfo = React.createClass({
  propTypes: {
    headers: React.PropTypes.object,
    body: React.PropTypes.string,
    statusCode: React.PropTypes.number,
    statusMessage: React.PropTypes.string
  },

  render() {
    let {headers, body, statusCode, statusMessage} = this.props;
    return (
      <div>
        <Label bsStyle="default">{`${statusCode} ${statusMessage}`}</Label>
        <Tabs defaultActiveKey={1}>
          <Tab eventKey={1} title="Headers"><ResponseHeaders headers={headers}/></Tab>
          <Tab eventKey={2} title="Body">
            <AceEditor mode="json" theme="github" readOnly={true} value={body} fontSize={16} />
          </Tab>
        </Tabs>
      </div>
    )
  }
});

export default ResponseInfo;
