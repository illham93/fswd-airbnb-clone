import React from "react";
import Layout from '@src/layout';
import { handleErrors, safeCredentials } from "../utils/fetchHelper";

import './trips.scss'

class Trips extends React.Component {

    state = {
        bookings: [],
        loading: true
    }

    componentDidMount() {
        fetch('/api/trips')
            .then(handleErrors)
            .then(response => {
                this.setState({
                    bookings: response.bookings,
                    loading: false
                })
                console.log(this.state.bookings);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    cancelBooking(e, bookingId) {
        e.preventDefault();

        if(confirm('Are you sure you want to cancel this booking?')) {
            fetch(`/api/bookings/${bookingId}`, safeCredentials({
                method: 'DELETE',
            }))
                .then(handleErrors)
                .then(() => {
                    window.location.href = '/trips';
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        }
    }

    render () {

        const { bookings, loading } = this.state;

        // Calculate the total price of each booking
        bookings.forEach(booking => {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
            booking.total_price = days * booking.price_per_night;
        });

        return (
            <Layout>
                <div className="container p-4">  
                    <h3 className="mb-4">
                        {bookings.length > 0 ? 
                        'Here are your booked trips: ' : 
                        <>
                            You do not have any trips booked. <br/>
                            <br/>
                            Click <a href="/">here</a> to view some properties to book.
                        </>}
                    </h3>
                {bookings.map(booking => {
                    return (                     
                        <div className="user-trip rounded mb-4 p-3" key={booking.id}>
                            <img className="rounded" src={booking.image_url}/>
                            <p><strong>Property:</strong> <a href={`property/${booking.property_id}`}>{booking.property_title}</a></p>
                            <p><strong>City:</strong> {booking.property_city}</p>
                            <p><strong>Check-in Date:</strong> {booking.start_date}</p>
                            <p><strong>Check-out date:</strong> {booking.end_date}</p>
                            <p><strong>Owner:</strong> {booking.owner_name}</p>
                            <p><strong>Total cost: </strong>${booking.total_price}</p>
                            <button className="btn btn-danger" onClick={(e) => this.cancelBooking(e, booking.id)}>Cancel booking</button>
                        </div>
                    )
                })}
                    {loading && <p>loading...</p>}
                </div>
            </Layout>
        )
    }
}

export default Trips;