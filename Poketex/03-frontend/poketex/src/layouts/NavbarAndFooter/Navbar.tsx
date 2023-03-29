// Navbar.tsx
import React from 'react';



export const Navbar: React.FC<{}> = (props) => {
    return (

        <nav className="navbar navbar-expand-lg main-color-gray shadow-sm py-3">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img
                        src={require('./../../Images/PublicImages/Pokytex-2.png')}
                        alt="Poketex"
                        style={{ height: '100px' }}
                    />
                </a>

                {/* 3 Lines Button for mobile */}
                <button className="navbar-toggler navbar-toggler-mobile btn-black" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto my-2 my-lg-0">
                        <li className="nav-item me-auto mx-5 ">
                            <a className="nav-link btn-black-bold" href="#">Home</a>
                        </li>
                        <li className="nav-item mx-5">
                            <a className="nav-link btn-black-bold" href="#">Search</a>
                        </li>
                    </ul>
                    <button className="btn btn-outline-dark mx-5 btn-red-hover" type="button">Sign In</button>
                </div>
            </div>
        </nav>
    );
};
