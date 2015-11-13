import React from 'react'

var StackFaIcon = React.createClass({
  getDefaultProps() {
    return {size: 'lg'};
  },

  propTypes: {
    // size can be string such as 'lg', '2x', '3x', '4x', '5x'
    size: React.PropTypes.string,
    largeIconName: React.PropTypes.string,
    smallIconName: React.PropTypes.string
  },

  sizeToClassName() {
    let size = this.props.size;
    if(size == null) return '';
    return `fa-${size}`;
  },

  render() {
    let {largeIconName, smallIconName} = this.props;
    let spanClass = ["fa-stack", this.sizeToClassName()].join(' ');
    let largeIcon = null, smallIcon = null;
    if(largeIconName) {
      let className = ["fa fa-stack-2x", `fa-${largeIconName}`].join(' ');
      largeIcon = <i key="2x" className={className} />;
    }
    if(smallIconName) {
      let className = ["fa fa-stack-1x", `fa-${smallIconName}`].join(' ');
      smallIcon = <i key="1x" className={className} />
    }
    return (
      <span className={spanClass}>
        {[largeIcon, smallIcon]}
      </span>
    )
  }
});

export default StackFaIcon;
