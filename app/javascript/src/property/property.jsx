import React from "react";
import Layout from '@src/layout';
import {handleErrors} from '@utils/fetchHelper';

import BookingWidget from './bookingWidget';
import BookingConfirmation from "./bookingConfirmation";
import './property.scss'

class Property extends React.Component {
    state = {
        property: {},
        loading: true,
    };

    componentDidMount() {

        fetch(`/api/properties/${this.props.property_id}`)
            .then(handleErrors)
            .then(data => {
                this.setState({
                    property: data.property,
                    loading: false,
                })
            })
    }

    render () {
        const {property, loading} = this.state;
        const {bookingConfirmation} = this.props;

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
                        <div className="col-12 col-lg-5">
                            {bookingConfirmation ? (
                                <BookingConfirmation price_per_night={price_per_night}/>
                            ) : (
                                <BookingWidget property_id={id} price_per_night={price_per_night} />
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Property