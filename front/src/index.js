import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";
import LightPanel from './components/LightPanel/LightPanel';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/light-panel" element={<LightPanel />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);