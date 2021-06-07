import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";

interface CellInt {
  x: number
  y: number
}

const SocketWrapper = () => {
  const [snake, setSnake] = useState<CellInt[]>([{x: 1, y: 1}])

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("moveSnake", data => {
      setSnake(data)
    });
  }, []);

  return (
    <App placeSnake={snake}/>
  );
}


ReactDOM.render(
  <React.StrictMode>
    <SocketWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
