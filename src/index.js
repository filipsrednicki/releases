import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import AuthProvider from "./context/AuthContext"
import DatabaseProvider from "./context/DatabaseContext"
import App from './components/App';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider><DatabaseProvider><App /></DatabaseProvider></AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

