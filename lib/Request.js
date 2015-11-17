import React from 'react'
import RequestHeader from './RequestHeader'
import RequestInfo from './RequestInfo'

var Request = React.createClass({
  propTypes: {
    method: React.PropTypes.string,
    url: React.PropTypes.string,
    headers: React.PropTypes.object,
    body: React.PropTypes.string,
    onMethodChange: React.PropTypes.func,
    onUrlChange: React.PropTypes.func,
    onLoad: React.PropTypes.func
  },

  getValue() {
    let {header, info} = this.refs;
    return {
      method: header.getMethod(),
      url: header.getUrl(),
      headers: info.getHeaders(),
      body: info.getBody()
    };
  },

  getDefaultProps() {
    return {method: 'GET', url: '', headers: {}, body: ''};
  },

  render() {
    let {method, url, headers, body, onMethodChange, onUrlChange, onLoad} = this.props;
    let headerProps = {method, url, onMethodChange, onUrlChange, onLoad};
    return (
      <div>
        <RequestHeader ref="header" {...headerProps}/>
        <RequestInfo ref="info" headers={headers} body={body}/>
      </div>
    );
  }
});

export default Request;
