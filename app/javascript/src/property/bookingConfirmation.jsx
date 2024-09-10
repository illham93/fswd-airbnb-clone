import React from "react";
import { safeCredentials, handleErrors } from "../utils/fetchHelper";

class BookingConfirmation extends React.Component {
    state = {
        loading: true,
        confirmed: false,
        error: null,
        start_date: null,
        end_date: null,
        total_cost: null,
    }

    async componentDidMount () {
        const params = new URLSearchParams(window.location.search);
        const property_id = params.get('property_id');
        const start_date = params.get('start_date');
        const end_date = params.get('end_date');
        const session_id = params.get('session_id');

        try {
            const bookingExists = await this.checkExistingBooking(property_id, start_date, end_date, session_id);
            if (bookingExists) {
                console.log('booking exists');
                this.setState({confirmed: true, loading: false, start_date: start_date, end_date: end_date});
            } else {
                await this.createBooking(property_id, start_date, end_date, session_id);
                this.setState({confirmed: true, loading: false, start_date: start_date, end_date: end_date});
            }
        } catch (error) {
            this.setState({error: true, loading: false})
        }
    }

    checkExistingBooking(property_id, start_date, end_date) {
        return fetch(`/api/bookings/check?property_id=${property_id}&start_date=${start_date}&end_date=${end_date}`)
            .then(handleErrors)
            .then(data => data.exists)
            .catch(() => false);
    }
    
    createBooking(property_id, start_date, end_date, session_id) {
        return fetch('/api/bookings', safeCredentials({
            method: 'POST',
            body: JSON.stringify({
                booking: {
                    property_id: property_id,
                    start_date: start_date,
                    end_date: end_date,
                    checkout_session_id: session_id
                }
            })
        }))
            .then(handleErrors)
            .catch(() => { throw new Error('Booking failed'); });
    }

    render () {
        const { loading, confirmed, error, start_date, end_date, total_cost } = this.state;

        const {price_per_night} = this.props;

        let days = 0;
        if (start_date && end_date) {
            const start = new Date(start_date);
            const end = new Date(end_date);
            const diffTime = Math.abs(end - start);
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>There was an error confirming your booking</div>
        }

        return (
            <div id="booking-confirmation">
                {confirmed ? (
                    <div id="booking-success">
                        <p>Your booking was successfully confirmed!</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Start Date: </td>
                                    <td><strong>{start_date}</strong></td>
                                </tr>
                                <tr>
                                    <td>End Date:</td>
                                    <td><strong>{end_date}</strong></td>
                                </tr>
                                <tr>
                                    <td>Total cost:</td>
                                    <td><strong>${(price_per_night * days).toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>Your booking could not be confirmed.</div>
                )}
            </div>
        );
    }
}

export default BookingConfirmation;