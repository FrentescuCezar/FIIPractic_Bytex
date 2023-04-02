import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Homepage } from './layouts/Homepage/Homepage';
import { SearchPoketexesPage } from './layouts/SearchPoketexesPage/SearchPoketexesPage';
import { Route, Redirect, Switch, RouteProps } from 'react-router-dom';
import { PoketexPage } from './layouts/PoketexPage/PoketexPage';
import SilhouetteImage from './layouts/GuessThePokemon/SilhouetteImageProps';

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className='flex-grow-1'>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>

          <Route path='/home' exact>
            <Homepage />

          </Route>

          <Route path='/search'>
            <SearchPoketexesPage />
          </Route>

          <Route path='/pokemon/:poketexId'>
            <PoketexPage />
          </Route>

        </Switch>
      </div>

      <Footer />
    </div>
  );
};
