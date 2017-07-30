import React from 'react'
import { connect } from 'react-redux';
import * as toolsActions from '../../actions/toolsActions';
import './ToolsItem.scss';

function Tool(props) {
  function selectTool() {
    props.dispatch(toolsActions.selectTool(props.tool));
  }

  return (
    <div className={"tools-item " + props.tool.iconClass} onClick={selectTool}>{props.tool.name[0]}</div>
  );
}

export default connect()(Tool);
