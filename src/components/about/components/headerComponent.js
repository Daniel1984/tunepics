import React from 'react';
import { Link } from 'react-router';
import './headerStyles.scss';

function HeaderComopnent(props) {
  return (
    <ul className="about_header">
      <li>
        <Link to="/" className="about_header-link about_header-link--logo">Tp</Link>
      </li>
      <li>
        <Link to="/editor" className="about_header-link">Editor</Link>
      </li>
    </ul>
  );
}

export default HeaderComopnent;
