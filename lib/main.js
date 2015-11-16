import React from 'react'
import ReactDOM from 'react-dom'
import Request from './Request'
import ResponseInfo from './ResponseInfo'

var obj = {
  "HELLO": "WORLD",
  "MMM": "HELLO-------------WORLD"
};
ReactDOM.render(<ResponseInfo headers={obj} body={JSON.stringify(obj)} statusCode={404}
  statusMessage="OK"/>, document.getElementById('react-app'));
