import React from "react";
import ReactDOM from 'react-dom';
import Property from './property';

document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('params');
    const data = JSON.parse(node.getAttribute('data-params'));
    const bookingConfirmation = document.body.getAttribute('data-booking-confirmation') === 'true';

    ReactDOM.render(
        <Property property_id={data.property_id} bookingConfirmation={bookingConfirmation} />,
        document.body.appendChild(document.createElement('div')),
    )
})