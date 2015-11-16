import React from 'react'
import {Tabs, Tab, Input, Grid, Row, Col, Button, Glyphicon} from 'react-bootstrap'
import StackFaIcon from './StackFaIcon'
import FaIconButton from './FaIconButton'
import classnames from 'classnames'
import Immutable from 'Immutable'
import {shallowEqual} from 'pure-render-mixin'
import AceEditor from 'react-ace'

require('brace/mode/json');
require('brace/theme/github');

var IconLabel = React.createClass({
  render() {
    return <div className="icon-label"><Glyphicon glyph={this.props.glyph} /></div>;
  }
});

var KeyValueEditItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    keyVal: React.PropTypes.string,
    value: React.PropTypes.string,
    onKeyChange: React.PropTypes.func,
    onValueChange: React.PropTypes.func,
    onCheck: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onInsertBefore: React.PropTypes.func
  },

  getDefaultProps() {
    return {keyVal: '', value: ''};
  },

  getInitialState() {
    return {valid: false, checked: true}
  },

  componentWillMount() {
    let {keyVal, value} = this.props;
    this.setState({keyVal, value});
  },

  componentWillReceiveProps(nextProps) {
    let {keyVal, value} = nextProps;
    this.setState({keyVal, value});
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.state, nextState);
  },

  onCheck() {
    let checked = !this.state.checked;
    this.setState({checked});
    this.props.onCheck(this.props.index, checked);
  },

  onDragStart(event) {
    let nativeEv = event.nativeEvent;
    nativeEv.dataTransfer.setData("index", this.props.index);
  },

  onDragOver(event) {
    event.preventDefault();
  },

  onDrop(event) {
    event.preventDefault();
    var index = event.nativeEvent.dataTransfer.getData('index');
    this.props.onInsertBefore(parseInt(index), this.props.index);
  },

  onRemove() {
    this.props.onRemove(this.props.index);
  },

  onKeyChange(event) {
    let keyVal = event.target.value;
    this.props.onKeyChange(this.props.index, keyVal);
    this.setState({keyVal});
  },

  onValueChange(event) {
    let value = event.target.value;
    this.props.onValueChange(this.props.index, value);
    this.setState({value});
  },

  onActive() {
    if(!this.state.valid) {
      this.setState({valid: true});
      this.props.onAdd(this.props.index);
    }
  },

  render() {
    let checkClassName = classnames('checkbox',
      this.state.checked ? 'check-active' : 'check-deactive');
    let dragProps = {
      draggable: "true",
      onDragStart: this.onDragStart,
      onDragOver: this.onDragOver,
      onDrop: this.onDrop
    };
    let {keyVal, value, valid} = this.state;
    let moveBarClassName = classnames('move-bar', {'hidden': !valid});
    let validShowClass = valid ? '' : 'hidden';
    let invalidShowClass = valid ? 'hidden' : '';
    return (
      <Row className="editor-item">
        <Col xs={1}><FaIconButton className={moveBarClassName} faIconName="arrows" {...dragProps}/></Col>
        <Col xs={8} className="editor-item-content" {...dragProps}>
          <Input type="text" value={keyVal} placeholder="Key" onChange={this.onKeyChange} onFocus={this.onActive}/>
          <Input type="text" value={value} placeholder="Value" onChange={this.onValueChange} onFocus={this.onActive}/>
        </Col>
        <Col xs={1} className={invalidShowClass}><FaIconButton faIconName="edit" onClick={this.onActive}/></Col>
        <Col xs={1} className={validShowClass}>
          <FaIconButton className={checkClassName} onClick={this.onCheck} faIconName="check"/>
        </Col>
        <Col xs={1} className={validShowClass}><FaIconButton faIconName="remove" onClick={this.onRemove}/></Col>
      </Row>
    );
  }
});

var KeyValueEditor = React.createClass({
  propTypes: {
    headers: React.PropTypes.object
  },

  componentWillMount() {
    let headers = this.props.headers;
    let dataList = [], count = 0;
    for(let key in headers)
      dataList.push({key, value: headers[key], valid: true, id: count++});
    dataList.push({id: count++, valid: false});
    this.setState({dataList, count});
  },

  getDataList() {
    return this.state.dataList;
  },

  onKeyChange(index, key) {
    this.state.dataList[index].key = key;
  },

  onValueChange(index, value) {
    this.state.dataList[index].value = value;
  },

  onCheck(index, checked) {
    this.state.dataList[index].valid = checked;
  },

  onRemove(index) {
    let dataList = this.state.dataList;
    dataList.splice(index, 1);
    this.setState({dataList});
  },

  onInsertBefore(sourceIndex, destIndex) {
    let dataList = this.state.dataList;
    let item = dataList[sourceIndex];
    dataList.splice(sourceIndex, 1);
    dataList.splice(destIndex, 0, item);
    this.setState({dataList});
  },

  onAddNew(index) {
    let dataList = this.state.dataList.concat({
      id: this.state.count++,
      valid: true
    });
    dataList[index].valid = true;
    this.setState({dataList});
  },

  render() {
    let props = {
      onKeyChange: this.onKeyChange,
      onValueChange: this.onValueChange,
      onCheck: this.onCheck,
      onAdd: this.onAddNew,
      onRemove: this.onRemove,
      onInsertBefore: this.onInsertBefore
    };
    let children = this.state.dataList.map(({id, key, value}, i) => {
      return <KeyValueEditItem key={id} index={i} {...props} keyVal={key} value={value}/>
    });
    // children = children.concat(<KeyValueNewItem key={0} onActive={this.onAddNew}/>);
    return <Grid>{children}</Grid>;
  }
});

var RequestInfo = React.createClass({
  propTypes: {
    headers: React.PropTypes.object,
    body: React.PropTypes.string
  },

  getDefaultProps() {
    return {headers: {}, body: ''};
  },

  onBodyChange(newVal) {
    this._body = newVal;
  },

  getHeaders() {
    let headers = {};
    this.refs.header.getDataList().forEach((data) => {
      if(data.valid && data.key) headers[data.key] = data.value;
    });
    return headers;
  },

  getBody() {
    return this._body;
  },

  render() {
    let {headers, body} = this.props;
    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title="Headers">
          <KeyValueEditor ref="header" Headers={headers}/>
        </Tab>
        <Tab eventKey={2} title="Body">
          <AceEditor mode="json" theme="github" value={body} onChange={this.onBodyChange} />
        </Tab>
      </Tabs>
    )
  }
});

export default RequestInfo;
