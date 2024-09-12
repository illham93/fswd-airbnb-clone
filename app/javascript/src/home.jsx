// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from './utils/fetchHelper';

import './home.scss';

class Home extends React.Component {

  state = {
    properties: [],
    total_pages: null,
    next_page: null,
    loading: true,
  }

  componentDidMount() {
    const apiEndpoint = this.props.userProperties ? '/api/user_properties' : '/api/properties?page=1'

    fetch(apiEndpoint)
      .then(handleErrors)
      .then(data => {
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
        })
      })
  }

  loadMore = () => {
    if (this.state.next_page === null) {
      return;
    }
    this.setState({ loading: true });
    const apiEndpoint = this.props.userProperties ? `/api/user_properties?page=${this.state.next_page}` : `/api/properties?page=${this.state.next_page}`;

    fetch(apiEndpoint)
      .then(handleErrors)
      .then(data => {
        this.setState({
          properties: this.state.properties.concat(data.properties),
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
        })
      })
  }

  render () {

    const { properties, next_page, loading } = this.state;
    return (
      <Layout>
        <div className='container pt-4'>
          <h4 className='mb-1'>{this.props.userProperties ? 'Your Properties' : 'Top-rated places to stay'}</h4>
          {this.props.userProperties && <a className='text-decoration-none' href='/add_property'><button className='btn btn-outline-primary mt-2 mb-2'>Add New Property</button></a>}
          <p className='text-secondary mb-3'>
            {this.props.userProperties ? 
              (this.state.properties.length > 0 ?
               'Here are the properties you have listed' : 
               'You do not currently have any properties listed') : 
               'Explore some of the best-reviews stays in the world'}
          </p>
          <div className='row'>
            {properties.map(property => {
              return (
                <div key={property.id} className='col-6 col-lg-4 mb-4 property'>
                  <a href={`/property/${property.id}`} className='text-body text-decoration-none'>
                    <div className='property-image mb-1 rounded' style={{ backgroundImage: `url(${property.image_url})` }} />
                    <p className='text-uppercase mb-0 text-secondary'><small><b>{property.city}</b></small></p>
                    <h6 className='mb-0'>{property.title}</h6>
                    <p className='mb-0'><small>${property.price_per_night} USD/night</small></p>
                  </a>
                  {this.props.userProperties && <a style={{marginRight: '8px'}} className='mt-2 mr-2 btn btn-outline-danger text-decoration-none' href={`/edit_property/${property.id}`}>Edit ✏️</a>}
                  {this.props.userProperties && <a className='mt-2 ml-2 btn btn-outline-primary text-decoration-none' href={`/property/${property.id}/bookings`}>View Bookings</a>}
                </div>
              )
            })}
          </div>
          {loading && <p>loading...</p>}
          {(loading || next_page === null ) || 
            <div className='text-center'>
              <button className='btn btn-light mb-4' onClick={this.loadMore}>load more</button>
            </div>
          }
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const userProperties = document.body.getAttribute('data-user-properties') === 'true';

  ReactDOM.render(
    <Home userProperties={userProperties} />,
    document.body.appendChild(document.createElement('div')),
  )
})
