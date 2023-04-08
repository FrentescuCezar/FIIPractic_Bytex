import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';

import { Homepage } from './layouts/Homepage/Homepage';
import { SearchPoketexesPage } from './layouts/SearchPoketexesPage/SearchPoketexesPage';
import { PoketexPage } from './layouts/PoketexPage/PoketexPage';
import { PokeMysteryPage } from './layouts/GuessThePokemon/PokeMysteryPage';

import { Route, Redirect, Switch, useHistory } from 'react-router-dom';

import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security } from '@okta/okta-react';
import LoginWidget from './Auth/Login';
import { CommentListPage } from './layouts/PoketexPage/Components/Comments/CommentListPage/CommentListPage';
import MonBuilderPage from './layouts/MonBuilderPage/MonBuilderPage';
import { UserPage } from './layouts/UserPage/UserPage';
import { BreedingPage } from './layouts/BreedingPage/BreedingPage';



const oktaAuth = new OktaAuth(oktaConfig)


export const App = () => {


  const customAuthHandler = () => {
    history.push('/login');
  }
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  }


  return (
    <div className="d-flex flex-column min-vh-100">
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />

        <div className='flex-grow-1'>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/home' />
            </Route>

            <Route path='/home' exact>
              <Homepage />
            </Route>

            <Route path='/search' exact>
              <SearchPoketexesPage />
            </Route>

            <Route path='/monbuilder'>
              <MonBuilderPage />
            </Route>

            <Route path='/pokemystery'>
              <PokeMysteryPage />
            </Route>

            <Route path='/login' render={() =>
              <LoginWidget config={oktaConfig} />}
            />

            <Route path='/login/callback' component={LoginCallback} />



            <Route path='/user/:userName/pokemon/:parent1/'>
              <BreedingPage />
            </Route>


            <Route exact path='/user/:userName/:userName' render={({ match }) => (
              <Redirect to={`/user/${match.params.userName}`} />
            )} />

            <Route path='/user/:userName' component={UserPage}>
              <UserPage />
            </Route>




            <Route
              path="/:poketexId"
              exact
              render={({ match }) => (
                <Redirect to={`/pokemon/${match.params.poketexId}`} />
              )}
            />


            <Route path='/commentList/:poketexId'>
              <CommentListPage />
            </Route>



            <Route path='/pokemon/:poketexId'>
              <PoketexPage />
            </Route>






          </Switch>
        </div>

        <Footer />
      </Security>
    </div>
  );
};
