import React from 'react'
import { connect } from 'react-redux';
import ToolsItem from '../toolsItem/toolsItemComponent';
import './toolsListStyles.scss';

function ToolsList(props) {
  return (
    <section className="tools">
      <div className="tools_title">Tools</div>
      {props.videoData.videoWidth &&
        <div>
          <div className="tools_download-video" onClick={props.downloadVideo}>Downlaod</div>
          <div className="tools_download-video" onClick={props.addMask}>Add Mask</div>
        </div>
      }
    </section>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    videoData: state.videoData
  }
}

export default connect(mapStateToProps)(ToolsList);
