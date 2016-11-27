import React, { Component } from 'react'
import { connect } from 'react-redux';
import './canvasStyles.scss';

class Canvas extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="canvas">
        name = {this.props.tool.name}
      </section>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    tool: state.tool
  }
}

export default connect(mapStateToProps)(Canvas);
