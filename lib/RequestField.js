import React from 'react'
import ResponseInfo from './ResponseInfo'
import Request from './Request'
import request from 'request'
import PureRenderMixin from 'react-addons-pure-render-mixin'

var RequestField = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    method: React.PropTypes.string,
    url: React.PropTypes.string,
    headers: React.PropTypes.object,
    body: React.PropTypes.string,
    request: React.PropTypes.func
  },

  getDefaultProps() {
    return {method: 'GET', url: '', headers: {}, body: '', request: request};
  },

  getInitialState() {
    return {isLoad: false};
  },

  getValue() {
    return this.refs.request.getValue();
  },

  onLoad() {
    let reqInfo = this.refs.request.getValue();
    if(!/^http/.test(reqInfo.url))
      reqInfo.url = 'http://' + reqInfo.url;
    reqInfo.json = true;
    this.props.request(reqInfo, (err, res, body) => {
      let response;
      if(err) {
        console.log(err);
        let statusMessage = err.toString();
        response = {statusCode: 0, statusMessage, headers: {}, body: ''};
      } else {
        response = {statusCode: res.statusCode, statusMessage: res.statusMessage,
          headers: res.headers, body: JSON.stringify(body)};
      }
      this.setState({isLoad: true, response});
    });
  },

  render() {
    let {method, url, headers, body} = this.props;
    return (
      <div>
        <Request ref="request" method={method} url={url} headers={headers} body={body}
          onLoad={this.onLoad} />
        {
          this.state.isLoad ? <ResponseInfo {...this.state.response} /> : ''
        }
      </div>
    );
  }
});

export default RequestField;
