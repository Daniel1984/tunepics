import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app/appComponent';
import About from './components/about/aboutComponent';
import Editor from './components/editor/editorComponent';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={About} />
    <Route path="editor" component={Editor} />
  </Route>
);
