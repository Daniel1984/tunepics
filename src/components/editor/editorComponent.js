import React, { PropTypes } from 'react';
import TollsList from '../toolsList/toolsListComponent';
import Canvas from '../canvas/canvasComponent';

function Editor(props) {
  return (
    <div className="editor">
      <TollsList />
      <Canvas />
    </div>
  );
}

export default Editor;
