import React from "react";
import Layout from '@src/layout';
import { handleErrors } from "../utils/fetchHelper";

import './trips.scss'

class Trips extends React.Component {

    state = {
        trips: [],
        loading: true
    }

    componentDidMount() {
        fetch('/api/trips')
            .then(handleErrors)
            .then(response => {
                this.setState({
                    trips: response.trips,
                    loading: false
                })
                console.log(response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    render () {
        return (
            <Layout>
                <h3>Trips</h3>
            </Layout>
        )
    }
}

export default Trips;