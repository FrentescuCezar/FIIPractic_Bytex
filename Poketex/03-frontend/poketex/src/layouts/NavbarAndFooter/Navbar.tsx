// Navbar.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';




export const Navbar: React.FC<{}> = (props) => {

    const { oktaAuth, authState } = useOktaAuth();

    if (!authState) {
        return <SpinnerLoading />
    }

    const handleLogout = async () => oktaAuth.signOut();

    //console.log(authState.accessToken.accessToken);


    return (

        <nav className="navbar navbar-expand-lg main-color-gray shadow-sm py-3">
            <div className="container">
                <NavLink className="navbar-brand" to="/home">
                    <img
                        src={require('./../../Images/PublicImages/Pokytex-2.png')}
                        alt="Poketex"
                        style={{ height: '100px' }}
                    />
                </NavLink>

                {/* 3 Lines Button for mobile */}
                <button className="navbar-toggler navbar-toggler-mobile btn-black" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto my-2 my-lg-0">
                        <li className="nav-item me-auto mx-4 ">
                            <NavLink className="nav-link btn-black-bold" to="/home">Home</NavLink>
                        </li>
                        <li className="nav-item mx-2">
                            <NavLink className="nav-link btn-black-bold" to="/search">Search</NavLink>
                        </li>
                        <li className="nav-item ">
                            <NavLink className="nav-link btn-black-bold" to="/monbuilder">MonBuilder</NavLink>
                        </li>
                        <li className="nav-item ">
                            <NavLink className="nav-link btn-black-bold" to="/pokemystery">PokéMystery</NavLink>
                        </li>
                    </ul>
                    {!authState.isAuthenticated
                        ?
                        <Link type='button' className="btn btn-outline-dark mx-5 btn-red-hover" to='/login'>Sign In</Link>
                        :
                        <button className='btn btn-outline-dark mx-5 btn-red-hover' onClick={handleLogout}>Logout</button>
                    }
                </div>
            </div>
        </nav>
    );
};
