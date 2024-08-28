import React from "react";
import Layout from '@src/layout';
import {safeCredentials, safeCredentialsFormData, handleErrors} from '@utils/fetchHelper';

import './addProperty.scss'

class AddProperty extends React.Component {

    handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData(event.target);
        const image = document.getElementById('image-select').files[0];

        form.append('property[title]', form.get('title'));
        form.append('property[city]', form.get('city'));
        form.append('property[country]', form.get('country'));
        form.append('property[property_type]', form.get('property_type'));
        form.append('property[price_per_night]', form.get('price_per_night'));
        form.append('property[max_guests]', form.get('max_guests'));
        form.append('property[bedrooms]', form.get('bedrooms'));
        form.append('property[beds]', form.get('beds'));
        form.append('property[baths]', form.get('baths'));
        form.append('property[description]', form.get('description'));

        if (image) {
            form.append('image', image, image.name);
        }

        fetch('api/add_property', safeCredentialsFormData({
            method: 'POST',
            body: form,
        }))
            .then(handleErrors)
            .then(() => {
                window.location.href = '/user_properties';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    render () {

        return (
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="info col-12 col-lg-8">
                            <div className="mb-3 mt-3">    
                                <h3>New Property:</h3>                          
                                <form id="property-info" onSubmit={this.handleSubmit}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Image:</td>
                                                <td><input className="mb-2 mt-2" type="file" id="image-select" name="image" accept="image/*" /></td>
                                            </tr>
                                            <tr>
                                                <td>Title: </td>
                                                <td><input className="form-control" name="title" required /></td>
                                            </tr>
                                            <tr>
                                                <td>City: </td>
                                                <td><input className="form-control" name="city" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Country: </td>
                                                <td><input className="form-control" name="country" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Property type: </td>
                                                <td><input className="form-control" name="property_type" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Price per night: $</td>
                                                <td><input className="form-control" name="price_per_night" type="number" min="0" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Max guests: </td>
                                                <td><input className="form-control" name="max_guests" type="number" min="0" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Bedrooms: </td>
                                                <td><input className="form-control" name="bedrooms" type="number" min="0" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Beds: </td>
                                                <td><input className="form-control" name="beds" type="number" min="0" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Baths: </td>
                                                <td><input className="form-control" name="baths" type="number" min="0" required /></td>
                                            </tr>
                                            <tr>
                                                <td>Description: </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <textarea className="form-control mt-2 mb-2" name="description" required />
                                    <button className="btn btn-success mb-2" type="submit">Save ✅</button>
                                    <br></br>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default AddProperty