import React from 'react';
import Header from './components/Header'
import './About.scss';

function AboutComponent(props) {
  return (
    <div className="about">
      <Header />
      <div className="about_info-block">
        <p className="about_title">Tune Pics</p>
        <p className="about_text">Free Picture Editing Tool</p>
      </div>
    </div>
  );
}

export default AboutComponent;
