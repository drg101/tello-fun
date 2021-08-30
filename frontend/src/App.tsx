import React, { useState } from 'react';
import logo from './logo.svg';
import { TextField } from '@material-ui/core';
import './App.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    reconnectionDelayMax: 10000
});

function App() {
    const [textFieldValue, setTextFieldValue] = useState('');

    document.onkeypress = function (e) {
        e = e || window.event;
        // use e.keyCode
        if (e.key === 'Enter') {
            console.log(`EMMITING ${textFieldValue}`)
            socket.emit('telloControl', textFieldValue)
            setTextFieldValue('')
        }
    };
    return (
        <div className="App">
            <br/>
            <TextField value={textFieldValue} onChange={(e) => setTextFieldValue(e.target.value)} />
        </div>
    );
}

export default App;
