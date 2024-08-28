import React, { useEffect, useState } from 'react';

const Layout = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [authenticityToken, setAuthenticityToken] = useState('');

    useEffect(() => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        setAuthenticityToken(token);

        fetch('/api/authenticated', {
            method: 'GET',
            headers: {
                'X-CSRF-Token': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    setLoggedIn(true);
                }
            })
            .catch(error => {
                console.error("Error fetching authentication status:", error);
            });
    }, []);

    return (
        <React.Fragment>
            <nav className='navbar navbar-expand navbar-light bg-light'>
                <div className='container-fluid'>
                    <a className='navbar-brand text-danger' href='/'>Airbnb</a>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto'>
                            <li className='nav-item'>
                                <a className='nav-link' href='/'>Home</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='/user_properties'>My Properties</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='/trips'>Trips</a>
                            </li>
                        </ul>
                        <ul className='navbar-nav ms-auto'>
                            <li className='nav-item'>
                                {loggedIn ? (
                                    <form action='/api/logout' method='post'>
                                        <input type='hidden' name='_method' value='delete' />
                                        <input type='hidden' name='authenticity_token' value={authenticityToken} />
                                        <button type='submit' className='nav-link btn btn-link' style={{textDecoration: 'none'}}>Log Out</button>
                                    </form>
                                ) : (
                                    <a className='nav-link' href='/login'>Log In</a>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {props.children}
            <footer className='p-3 bg-light'>
                <div>
                    <p className='me-3 mb-0 text-secondary'>Airbnb Clone</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

export default Layout;