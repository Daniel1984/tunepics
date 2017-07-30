import React from 'react';
import PropTypes from 'prop-types';

App.propTypes = {
  children: PropTypes.node.isRequired,
};

function App({ children }) {
  return (
    <div className="app">
      {children}
    </div>
  );
}

export default App;
