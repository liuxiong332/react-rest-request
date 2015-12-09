import React from 'react'
import {Tabs, Tab, Input, Grid, Row, Col, Button, Glyphicon} from 'react-bootstrap'
import StackFaIcon from './StackFaIcon'
import FaIconButton from './FaIconButton'
import classnames from 'classnames'
import Immutable from 'Immutable'
import AceEditor from 'react-ace'
import PureRenderMixin from 'react-addons-pure-render-mixin'

require('brace/mode/json');
require('brace/theme/github');

var IconLabel = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return <div className="icon-label"><Glyphicon glyph={this.props.glyph} /></div>;
  }
});

var KeyValueEditItem = React.createClass({
  mixins: [PureRenderMixin],

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

  onHover() {
    this.setState({hover: true});
  },

  onUnhover() {
    this.setState({hover: false});
  },

  render() {
    let dragProps = {
      draggable: "true",
      onDragStart: this.onDragStart,
      onDragOver: this.onDragOver,
      onDrop: this.onDrop
    };
    let {keyVal, value, valid, hover} = this.state;
    let moveBarClassName = classnames('move-bar', {'invisibility': !valid, hover});
    let validShowClass = classnames(valid ? '' : 'hidden', {hover});
    let invalidShowClass = classnames(valid ? 'hidden' : '', {hover});
    let checkClassName = classnames('checkbox',
      this.state.checked ? 'check-active' : 'check-deactive', validShowClass, {hover});
    let inputClass = classnames('form-control', {hover});
    return (
      <div className="editor-item" onMouseOver={this.onHover} onMouseOut={this.onUnhover} {...dragProps}>
        <FaIconButton className={moveBarClassName} faIconName="arrows"/>
        <div className="inputs">
          <input type="text" value={keyVal} placeholder="Key" className={inputClass}
            onChange={this.onKeyChange} onFocus={this.onActive}/>
          <input type="text" value={value} placeholder="Value" className={inputClass}
            onChange={this.onValueChange} onFocus={this.onActive}/>
        </div>
        <FaIconButton faIconName="edit" className={invalidShowClass} onClick={this.onActive}/>
        <FaIconButton className={checkClassName} onClick={this.onCheck} faIconName="check"/>
        <FaIconButton className={validShowClass} faIconName="remove" onClick={this.onRemove}/>
      </div>
    );
  }
});

var KeyValueEditor = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    headers: React.PropTypes.object
  },

  componentWillMount() {
    let headers = this.props.headers;
    let dataList = new Immutable.List(), count = 0;
    for(let key in headers)
      dataList = dataList.push({key, value: headers[key], valid: true, id: count++});
    dataList = dataList.push({id: count++, valid: false});
    this.setState({dataList, count});
  },

  getDataList() {
    return this.state.dataList;
  },

  onKeyChange(index, key) {
    let dataList = this.state.dataList;
    dataList = dataList.set(index, Object.assign({}, dataList.get(index), {key}));
    this.setState({dataList});
  },

  onValueChange(index, value) {
    let dataList = this.state.dataList;
    dataList = dataList.set(index, Object.assign({}, dataList.get(index), {value}));
    this.setState({dataList});
  },

  onCheck(index, checked) {
    let dataList = this.state.dataList;
    dataList = dataList.set(index, Object.assign({}, dataList.get(index), {valid: checked}));
    this.setState({dataList});
  },

  onRemove(index) {
    let dataList = this.state.dataList.splice(index, 1);
    this.setState({dataList});
  },

  onInsertBefore(sourceIndex, destIndex) {
    let dataList = this.state.dataList;
    let item = dataList.get(sourceIndex);
    dataList = dataList.splice(sourceIndex, 1);
    dataList = dataList.splice(destIndex, 0, item);
    this.setState({dataList});
  },

  onAddNew(index) {
    let dataList = this.state.dataList.push({
      id: this.state.count++,
      valid: true
    });
    dataList = dataList.set(index, {...dataList.get(index), valid: true});
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
    return <Grid fluid={true}>{children}</Grid>;
  }
});

var RequestInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    headers: React.PropTypes.object,
    body: React.PropTypes.string,
    onBodyChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {headers: {}, body: ''};
  },

  onBodyChange(newVal) {
    this._body = newVal;
    let onBodyChange = this.props.onBodyChange;
    if(onBodyChange) onBodyChange(newVal);
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
          <AceEditor mode="json" theme="github" value={body} fontSize={16} onChange={this.onBodyChange} />
        </Tab>
      </Tabs>
    )
  }
});

export default RequestInfo;
