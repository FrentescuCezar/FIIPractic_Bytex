import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Homepage } from './layouts/Homepage/Homepage';
import { SearchPoketexesPage } from './layouts/SearchPoketexesPage/SearchPoketexesPage';

export const App = () => {
  return (
    <div className="App">
      <Navbar />
      {/* <Homepage /> */}
      <SearchPoketexesPage />
      <Footer />
    </div>
  );
};
