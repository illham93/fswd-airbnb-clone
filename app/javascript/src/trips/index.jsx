import React from 'react';
import ReactDOM from 'react-dom';
import Trips from './trips';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Trips />,
        document.body.appendChild(document.createElement('div')),
    )
})