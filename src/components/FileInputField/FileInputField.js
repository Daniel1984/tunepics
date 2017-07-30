import React from 'react';
import './FileInputField.scss';

function FileInputField(props) {
  return (
    <div className="file-input-field_container">
      <input className="file-input-field_input" type="file" accept="video/mp4,video/x-m4v,video/*" onChange={props.onFileSelected} />
      {props.message}
    </div>
  );
}

export default FileInputField;
