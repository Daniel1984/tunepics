import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App/App';
import About from './components/About/About';
import Editor from './components/Editor/Editor';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Editor} />
    <Route path="editor" component={Editor} />
  </Route>
);
