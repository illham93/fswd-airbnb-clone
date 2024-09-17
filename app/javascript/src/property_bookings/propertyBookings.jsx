import React from "react";
import Layout from '@src/layout';
import { handleErrors, safeCredentials } from "../utils/fetchHelper";

import './propertyBookings.scss';

class PropertyBookings extends React.Component {

    state = {
        property: null,
        bookings: [],
        loading: true
    }

    componentDidMount() {

        fetch(`/api/properties/${this.props.property_id}`)
        .then(handleErrors)
        .then(data => {
            console.log(data);
            this.setState({
                property: data.property,
                loading: false,
            })
        });

        fetch(`/api/properties/${this.props.property_id}/bookings`)
            .then(handleErrors)
            .then(data => {
                console.log(data);
                this.setState({
                    bookings: data.bookings,
                })
                console.log(this.state.bookings.start_date);
            })
    }

    render () {

        const {property, bookings, loading} = this.state;

        if (loading) {
            return <p>loading...</p>;
        };

        return (
            <Layout>
                <div className="property-image mb-3" style={{ backgroundImage: `url(${property.image_url})`}} />
                <div className="container">
                    <div className="row">
                        <div className="info col-12 col-lg-8">
                            <div className="mb-3">
                                <h3 className="mb-0">{property.title}</h3>
                                <p className="text-uppercase mb-0 text-secondary"><small>{property.city}</small></p>
                                <p className="mb-0"><small>Hosted by <b>{property.user.username}</b></small></p>
                            </div>
                            <div>
                                <p className="mb-0 text-capitalize"><b>{property.property_type}</b></p>
                                <p>
                                    <span className="me-3">{property.max_guests} guests</span>
                                    <span className="me-3">{property.bedrooms} bedrooms</span>
                                    <span className="me-3">{property.beds} beds</span>
                                    <span className="me-3">{property.baths} baths</span>
                                </p>
                            </div>
                            <hr />
                            <p>{property.description}</p>
                        </div>
                    </div>
                    <h4 className="mb-4">
                        {bookings.length > 0 ?
                        'Here are the trips booked for this property:' :
                        'There are no trips booked for this property'}
                    </h4>
                    {bookings.map(booking => {
                        var days = (new Date(booking.end_date) - new Date(booking.start_date)) / 1000 / 60 / 60 / 24
                        return (
                            <div className="booked-trip card shadow-sm rounded mb-4 p-3" key={booking.id}>
                                <div className="card-body">
                                    <h5 className="card-title">Booking Details</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Username: <strong>{booking.user.username} </strong></li>
                                        <li className="list-group-item">Check-in Date: <strong>{booking.start_date}</strong></li>
                                        <li className="list-group-item">Check-out Date: <strong>{booking.end_date}</strong></li>
                                        <li className="list-group-item">Number of days: <strong>{days}</strong></li>
                                    </ul> 
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Layout>
        )
    }
}

export default PropertyBookings;