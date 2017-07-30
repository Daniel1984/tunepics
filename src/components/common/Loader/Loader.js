import React from 'react'
import PropTypes from 'prop-types';
import { map, range } from 'ramda';
import './Loader.scss';

Loader.propTypes = {
  mesage: PropTypes.string
}

function Loader({ message }) {
  return (
    <div className="loader">
      <div className="sk-cube-grid">
        {map(
          i => (<div key={i.toString()} className={`sk-cube sk-cube${i}`} />)
        )(range(1, 10))}
      </div>

      {message}
    </div>
  );
}

export default Loader;
