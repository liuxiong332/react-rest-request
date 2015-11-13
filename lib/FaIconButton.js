import React from 'react'
import {Glyphicon} from 'react-bootstrap'

var FaIconButton = React.createClass({
  getDefaultProps() {
    return {size: 'lg', className: ''};
  },

  propTypes: {
    size: React.PropTypes.string,
    faIconName: React.PropTypes.string,
    glyph: React.PropTypes.string,
    className: React.PropTypes.string
  },

  sizeToClassName() {
    let size = this.props.size;
    if(size == null) return '';
    return `fa-${size}`;
  },

  render() {
    let {size, className, faIconName, glyph, ...nativeProps} = this.props;
    let spanClass = ["icon-button", this.sizeToClassName(), className].join(' ');
    let icon = null;
    if(faIconName) {
      let className = ["fa", `fa-${faIconName}`].join(' ');
      icon = <i className={className} />
    } else if(glyph) {
      icon = <Glyphicon glyph={glyph} />
    }
    return (
      <span className={spanClass} {...nativeProps}>{icon}</span>
    )
  }
});

export default FaIconButton;
