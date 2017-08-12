import React from 'react'
import { connect } from 'react-redux';
import { selectTool } from '../../actions';
import './ToolsList.scss';

function ToolsList({ videoData, downloadVideo, selectTool }) {
  return (
    <section className="tools">
      <div className="tools_title">Tools</div>
      {videoData.src && (
        <div>
          <div className="tools_download-video" onClick={downloadVideo}>
            Downlaod
          </div>
          <div className="tools_download-video" onClick={() => selectTool('addMask')}>
            Add Mask
          </div>
        </div>
      )}
    </section>
  );
}

function mapStateToProps({ videoData }) {
  return { videoData };
}

export default connect(mapStateToProps, { selectTool })(ToolsList);
