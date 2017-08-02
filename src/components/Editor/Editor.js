import React from 'react';
import { connect } from 'react-redux';
import Canvas from '../Canvas/Canvas';

function Editor({ tool }) {
  return (
    <div className="editor">
      <Canvas />
      {(tool === 'addMask') && (
        <h1>adding mask</h1>
      )}
    </div>
  );
}

function mapStateToProps({ tool }) {
  return { tool };
}

export default connect(mapStateToProps)(Editor);
