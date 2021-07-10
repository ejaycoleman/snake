import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {SocketContext, socket} from './socketContext';

import {RoomProvider} from './RoomContext'


ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <RoomProvider>
        <App />
      </RoomProvider>
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
