// Navbar.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import NavBarUserCircle from './NavBarUserCircle';

import jwt_decode from 'jwt-decode';

import { extractNameFromEmail } from '../Utils/PoketexDetailsUtils';


interface JwtPayload {
    sub: string;

}


export const Navbar: React.FC<{}> = (props) => {


    const { oktaAuth, authState } = useOktaAuth();

    if (!authState) {
        return <SpinnerLoading />
    }

    const handleLogout = async () => oktaAuth.signOut();
    let JWTDecoded;
    let usernameWithoutAtSymbol;


    if (authState && authState.isAuthenticated) {
        JWTDecoded = jwt_decode<JwtPayload>(authState.accessToken.accessToken);
        usernameWithoutAtSymbol = extractNameFromEmail(JWTDecoded.sub);
    } else {
        JWTDecoded = { sub: "Not_Logged_In" };
        usernameWithoutAtSymbol = "Not_Logged_In";
    }





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
                        <li className="nav-item" style={{ marginLeft: '25px' }}>
                            <NavLink className="nav-link btn-black-bold" to="/home">Home</NavLink>
                        </li>
                        <li className="nav-item" style={{ marginLeft: '10px' }}>
                            <NavLink className="nav-link btn-black-bold" to="/search">Search</NavLink>
                        </li>
                        <li className="nav-item" style={{ marginLeft: '10px' }}>
                            {authState.isAuthenticated
                                ?
                                <NavLink className="nav-link btn-black-bold" to="/monbuilder">MonBuilder</NavLink>
                                :
                                <NavLink className="nav-link btn-black-bold" to="/login">MonBuilder</NavLink>
                            }
                        </li>
                        <li className="nav-item" style={{ marginLeft: '10px' }}>
                            <NavLink className="nav-link btn-black-bold" to="/pokemystery">PokéMystery</NavLink>
                        </li>
                    </ul>
                    {!authState.isAuthenticated
                        ?
                        <Link type='button' className="btn btn-outline-dark mx-5 btn-red-hover" to='/login'>Sign In</Link>
                        :
                        //<button className='btn btn-outline-dark mx-5 btn-red-hover' onClick={handleLogout}>Logout</button>
                        <NavBarUserCircle username={usernameWithoutAtSymbol} onLogout={handleLogout} authState={authState} />
                    }
                </div>
            </div>
        </nav>
    );
};
