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
            })
    }

    render () {

        const {property, bookings, loading} = this.state;

        if (loading) {
            return <p>loading...</p>;
        };

        const {
            id,
            title,
            description,
            city,
            country,
            property_type,
            price_per_night,
            max_guests,
            bedrooms,
            beds,
            baths,
            image_url,
            user,
        } = property;

        return (
            <Layout>
                <div className="property-image mb-3" style={{ backgroundImage: `url(${image_url})`}} />
                <div className="container">
                    <div className="row">
                        <div className="info col-12 col-lg-8">
                            <div className="mb-3">
                                <h3 className="mb-0">{title}</h3>
                                <p className="text-uppercase mb-0 text-secondary"><small>{city}</small></p>
                                <p className="mb-0"><small>Hosted by <b>{user.username}</b></small></p>
                            </div>
                            <div>
                                <p className="mb-0 text-capitalize"><b>{property_type}</b></p>
                                <p>
                                    <span className="me-3">{max_guests} guests</span>
                                    <span className="me-3">{bedrooms} bedrooms</span>
                                    <span className="me-3">{beds} beds</span>
                                    <span className="me-3">{baths} baths</span>
                                </p>
                            </div>
                            <hr />
                            <p>{description}</p>
                        </div>
                    </div>
                    <h4 className="mb-4">
                        {bookings.length > 0 ?
                        'Here are the trips booked for this property:' :
                        'There are no trips booked for this property'}
                    </h4>
                    {bookings.map(booking => {
                        return (
                            <div className="booked-trip rounded mb-4 p-3" key={booking.id}>
                                <p><strong>Username:</strong></p>
                                <p><strong>Check-in Date:</strong></p>
                                <p><strong>Check-out Date:</strong></p>
                            </div>
                        )
                    })}
                </div>
            </Layout>
        )
    }
}

export default PropertyBookings;