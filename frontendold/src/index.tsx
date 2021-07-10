import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {SocketProvider} from './socketContext'

// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4000";

// const SocketWrapper = () => {
//   useEffect(() => {
//     const socket = socketIOClient(ENDPOINT);
//     socket.on("FromAPI", data => {
//       console.log(data);
//     });
//   }, []);

//   return (
//     <App />
//   );
// }


ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
