import React from 'react'
import ToolsItem from '../toolsItem/toolsItemComponent';
import './toolsListStyles.scss';

const TOOLS = [
  { iconClass: 'some-icon-class', name: 'move' },
  { iconClass: 'some-icon-class', name: 'squareSelect' },
  { iconClass: 'some-icon-class', name: 'ovalSelect' },
  { iconClass: 'some-icon-class', name: 'crop' },
  { iconClass: 'some-icon-class', name: 'lasso' },
  { iconClass: 'some-icon-class', name: 'pencil' }
];

function ToolsList(props) {
  return (
    <section className="tools">
      <div className="tools_title">Tools</div>
      {TOOLS.map((tool, i) => <ToolsItem tool={tool} key={i} />)}
    </section>
  );
}

export default ToolsList;
