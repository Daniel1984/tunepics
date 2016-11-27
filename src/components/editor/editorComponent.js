import React, { PropTypes } from 'react';
import TollsList from '../toolsList/toolsListComponent';
import Canvas from '../canvas/canvasComponent';
import Properties from '../properties/propertiesComponent';

function Editor(props) {
  return (
    <div className="editor">
      <TollsList />
      <Canvas />
      <Properties />
    </div>
  );
}

export default Editor;
