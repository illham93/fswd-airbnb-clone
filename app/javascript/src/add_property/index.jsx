import React from "react";
import ReactDOM from 'react-dom';
import AddProperty from './addProperty';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <AddProperty />,
        document.body.appendChild(document.createElement('div')),
    )
})