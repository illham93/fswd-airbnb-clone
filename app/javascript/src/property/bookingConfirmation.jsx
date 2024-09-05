import React from "react";
import { safeCredentials, handleErrors } from "../utils/fetchHelper";

class BookingConfirmation extends React.Component {
    state = {
        startDate: null,
        endDate: null,
        totalCost: null
    }

    render () {
        return (
            <div>test booking confirmation</div>
        )
    }
}

export default BookingConfirmation;