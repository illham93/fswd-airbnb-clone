import React from "react";
import Layout from '@src/layout';
import {safeCredentials, safeCredentialsFormData, handleErrors} from '@utils/fetchHelper';

import './editProperty.scss'

class EditProperty extends React.Component {
    state = {
        property: {},
        loading: true,
    }

    componentDidMount () {
        fetch(`/api/properties/${this.props.property_id}`)
            .then(handleErrors)
            .then(data => {
                this.setState({
                    property: data.property,
                    loading: false,
                });

                if (data.property.image) {
                    fetch(`/api/properties/${this.props.property_id}/image`)
                        .then(handleErrors)
                        .then(imageData => {
                            this.setState({
                                imageUrl: imageData.url,
                            });
                        })
                        .catch(error => console.error('Error fetching image:', error));
                }
            })
            .catch(error => console.error('Error fetching property:', error));
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData(event.target);
        const data = {
            title: form.get('title'),
            city: form.get('city'),
            property_type: form.get('property_type'),
            max_guests: form.get('max_guests'),
            bedrooms: form.get('bedrooms'),
            beds: form.get('beds'),
            baths: form.get('baths'),
            description: form.get('description'),
        };

            fetch(`/api/properties/${this.props.property_id}`, safeCredentials({
                method: 'PUT',
                body: JSON.stringify({ property: data }),
            }))
                .then(handleErrors)
                .then(() => {
                    window.location.href = '/user_properties';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
    }; 

    handleDelete = (event) => {
        event.preventDefault();

        if (confirm('Are you sure you want to delete this property?')) {
            fetch(`/api/properties/${this.props.property_id}`, safeCredentials({
                method: 'DELETE',
            }))
                .then(handleErrors)
                .then(() => {
                    window.location.href = '/user_properties';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    imageUpload = () => {
        const form = new FormData();
        const image = document.getElementById('image-select').files[0];

        if (image) {
            form.append('image', image, image.name);

            fetch(`/api/properties/${this.props.property_id}/upload_image`, safeCredentialsFormData({
                method: 'PUT',
                body: form,
            }))
                .then(handleErrors)
                .then((response) => {
                    this.setState(prevState => ({ 
                        property: {
                            ...prevState.property,
                            image_url: response.property.image_url
                        }
                    }), () => {
                        console.log('updated property:', this.state.property);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            
        }
    }

    render () {
        const {property, loading, imageUrl} = this.state;
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
        } = property;

        return (
            <Layout>
                <div className="property-image mb-3" style={{ backgroundImage: `url(${property.image_url || 'default-image-url'})`}} />
                <div className="container">
                    <div className="row">
                        <div className="info col-12 col-lg-8">
                            <div className="mb-3">
                                <div>
                                    <input className="mb-2" type="file" id="image-select" name="image" accept="image/*" />
                                    <button id="post-image" className="btn btn-primary mb-2" onClick={this.imageUpload}>Upload New Image</button>
                                </div>
                                
                                <form id="property-info" onSubmit={this.handleSubmit}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Title: </td>
                                                <td><input className="form-control" defaultValue={title} name="title" /></td>
                                            </tr>
                                            <tr>
                                                <td>City: </td>
                                                <td><input className="form-control" defaultValue={city} name="city" /></td>
                                            </tr>
                                            <tr>
                                                <td>Property type: </td>
                                                <td><input className="form-control" defaultValue={property_type} name="property_type" /></td>
                                            </tr>
                                            <tr>
                                                <td>Max guests: </td>
                                                <td><input className="form-control" defaultValue={max_guests} name="max_guests" type="number" min="0" /></td>
                                            </tr>
                                            <tr>
                                                <td>Bedrooms: </td>
                                                <td><input className="form-control" defaultValue={bedrooms} name="bedrooms" type="number" min="0" /></td>
                                            </tr>
                                            <tr>
                                                <td>Beds: </td>
                                                <td><input className="form-control" defaultValue={beds} name="beds" type="number" min="0" /></td>
                                            </tr>
                                            <tr>
                                                <td>Baths: </td>
                                                <td><input className="form-control" defaultValue={baths} name="baths" type="number" min="0" /></td>
                                            </tr>
                                            <tr>
                                                <td>Description: </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <textarea className="form-control mt-2 mb-2" defaultValue={description} name="description" />
                                    <button className="btn btn-success mb-2" type="submit">Save ✅</button>
                                    <br></br>
                                </form>
                                <button className="btn btn-danger" type="button" onClick={this.handleDelete}>Delete ❌</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}


export default EditProperty;